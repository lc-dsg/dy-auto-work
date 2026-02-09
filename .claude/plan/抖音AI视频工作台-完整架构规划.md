# 抖音 AI 视频制作工作台 - 完整架构规划

> **项目代号**: dy-auto-work
> **技术栈**: Tauri 2.x + React 18 + TypeScript + shadcn/ui + SQLite + FFmpeg
> **架构模式**: 方案 C - 独立 Worker 进程架构
> **规划日期**: 2026-02-09

---

## 一、项目概述

### 1.1 核心流程

```
主题/创意 → AI剧本生成 → 剧本编辑 → AI分镜拆解 → 分镜画布
                                                    ↓
抖音视频 ← 视频导出 ← 合成/配音/字幕 ← AI视频生成 ← AI图像生成
```

### 1.2 架构选型

| 维度 | 设计决策 |
|------|---------|
| 进程模型 | Tauri 主进程（编排） + 独立 Worker 进程（执行） |
| 数据存储 | 纯本地 SQLite，无云端依赖 |
| AI 接入 | 第三方 API（OpenAI/Claude/Stable Diffusion） |
| 视频处理 | FFmpeg sidecar 本地处理 |
| 开发策略 | 先 UI 框架，后功能填充 |

---

## 二、进程架构设计

### 2.1 职责划分

| 进程 | 核心职责 | 不负责 |
|------|---------|--------|
| **Tauri 主进程** | UI 指令接入、任务编排、状态机推进、SQLite 读写、密钥代理、Worker 生命周期 | 不执行重 CPU/GPU 计算 |
| **Worker Sidecar** | 执行 AI API 调用、FFmpeg 处理、进度上报、产物输出 | 不直接写 SQLite |

### 2.2 架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                         React UI                                │
│   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐           │
│   │ Script  │  │Storyboard│ │ Timeline │  │ Export  │           │
│   └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘           │
│        └────────────┴───────────┴────────────┘                  │
│                          │                                       │
│                    invoke / event                                │
└──────────────────────────┼───────────────────────────────────────┘
                           │
┌──────────────────────────┼───────────────────────────────────────┐
│                    Tauri Main Process                            │
│  ┌──────────────┐  ┌────────────────┐  ┌──────────────────┐     │
│  │   Commands   │  │ Worker Manager │  │   Dispatcher     │     │
│  └──────────────┘  └────────┬───────┘  └──────────────────┘     │
│                             │                                    │
│  ┌──────────────┐  ┌────────┴───────┐  ┌──────────────────┐     │
│  │   SQLite     │  │  IPC Protocol  │  │  System Keychain │     │
│  └──────────────┘  └────────┬───────┘  └──────────────────┘     │
└──────────────────────────────┼───────────────────────────────────┘
                               │
         ┌─────────────────────┼─────────────────────┐
         │                     │                     │
   ┌─────┴─────┐         ┌─────┴─────┐         ┌─────┴─────┐
   │ Worker #1 │         │ Worker #2 │         │ Worker #N │
   │  (AI)     │         │ (FFmpeg)  │         │  (TTS)    │
   └───────────┘         └───────────┘         └───────────┘
```

### 2.3 IPC 通信协议

| 字段 | 类型 | 说明 |
|------|------|------|
| `v` | string | 协议版本 (1.0) |
| `kind` | string | `command` / `event` / `ack` / `error` |
| `event` | string | 事件名 (task.submit, task.progress...) |
| `msg_id` | string | 全局唯一消息 ID |
| `trace_id` | string | 链路追踪 ID |
| `payload` | object | 业务载荷 |

**核心事件类型**：
- `worker.hello` / `worker.welcome` - 握手
- `worker.heartbeat` - 健康检查
- `task.submit` / `task.cancel` - 任务控制
- `task.started` / `task.progress` / `task.completed` / `task.failed` - 进度反馈

---

## 三、SQLite 数据模型

### 3.1 核心表结构

```sql
-- 项目表
CREATE TABLE projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    theme TEXT,
    target_platform TEXT DEFAULT 'douyin',
    status TEXT DEFAULT 'draft',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 剧本版本表 (支持版本化)
CREATE TABLE script_versions (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL REFERENCES projects(id),
    version_no INTEGER NOT NULL,
    content TEXT,
    source TEXT CHECK(source IN ('ai', 'manual')),
    model TEXT,
    prompt_snapshot TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 分镜场景表
CREATE TABLE storyboard_scenes (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL REFERENCES projects(id),
    script_version_id TEXT REFERENCES script_versions(id),
    scene_index INTEGER NOT NULL,
    scene_text TEXT,
    visual_prompt TEXT,
    duration_ms INTEGER DEFAULT 3000,
    camera_hint TEXT
);

-- 素材资产表
CREATE TABLE assets (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL REFERENCES projects(id),
    scene_id TEXT REFERENCES storyboard_scenes(id),
    type TEXT CHECK(type IN ('image', 'video', 'audio', 'subtitle')),
    provider TEXT,
    local_path TEXT,
    meta_json TEXT,
    checksum TEXT,
    status TEXT DEFAULT 'pending'
);

-- 时间轴表
CREATE TABLE timelines (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL REFERENCES projects(id),
    version_no INTEGER NOT NULL,
    width INTEGER DEFAULT 1080,
    height INTEGER DEFAULT 1920,
    fps INTEGER DEFAULT 30,
    spec_json TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 时间轴元素表
CREATE TABLE timeline_items (
    id TEXT PRIMARY KEY,
    timeline_id TEXT NOT NULL REFERENCES timelines(id),
    track_type TEXT CHECK(track_type IN ('video', 'audio', 'subtitle')),
    asset_id TEXT REFERENCES assets(id),
    start_ms INTEGER NOT NULL,
    duration_ms INTEGER NOT NULL,
    transform_json TEXT,
    effect_json TEXT
);

-- AI 任务队列
CREATE TABLE ai_tasks (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL REFERENCES projects(id),
    task_type TEXT NOT NULL,
    provider TEXT,
    model TEXT,
    request_json TEXT,
    response_json TEXT,
    token_usage INTEGER,
    cost_estimate REAL,
    status TEXT DEFAULT 'pending',
    retry_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 渲染任务队列
CREATE TABLE render_jobs (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL REFERENCES projects(id),
    job_type TEXT NOT NULL,
    timeline_id TEXT REFERENCES timelines(id),
    ffmpeg_args_json TEXT,
    output_asset_id TEXT REFERENCES assets(id),
    progress REAL DEFAULT 0,
    status TEXT DEFAULT 'pending',
    started_at DATETIME,
    ended_at DATETIME
);

-- 导出记录表
CREATE TABLE export_records (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL REFERENCES projects(id),
    preset_id TEXT REFERENCES export_presets(id),
    output_path TEXT,
    container TEXT DEFAULT 'mp4',
    video_codec TEXT DEFAULT 'h264',
    audio_codec TEXT DEFAULT 'aac',
    status TEXT DEFAULT 'pending',
    file_size INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 导出预设表
CREATE TABLE export_presets (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    platform TEXT DEFAULT 'douyin',
    width INTEGER DEFAULT 1080,
    height INTEGER DEFAULT 1920,
    fps INTEGER DEFAULT 30,
    video_bitrate TEXT DEFAULT '8M',
    audio_bitrate TEXT DEFAULT '128k',
    subtitle_style_json TEXT
);
```

---

## 四、前端架构设计

### 4.1 目录结构

```
src/
├── app/                    # 应用入口
│   ├── layout.tsx          # 全局布局
│   ├── router.tsx          # 路由配置
│   └── provider.tsx        # Provider 组合
├── components/
│   ├── ui/                 # shadcn/ui 组件
│   └── common/             # 通用业务组件
├── features/               # 功能模块
│   ├── dashboard/          # 首页/项目列表
│   ├── editor/
│   │   ├── script/         # 剧本编辑
│   │   ├── storyboard/     # 分镜画布
│   │   ├── timeline/       # 时间轴
│   │   ├── preview/        # 实时预览
│   │   └── inspector/      # 属性面板
│   └── export/             # 导出模块
├── hooks/                  # 自定义 Hooks
├── lib/                    # 工具库
├── stores/                 # Zustand 状态管理
│   ├── projectStore.ts     # 项目数据 (支持撤销)
│   ├── uiStore.ts          # UI 状态
│   └── workerStore.ts      # Worker 通信状态
├── services/               # Tauri IPC 服务
└── types/                  # TypeScript 类型
```

### 4.2 路由规划

| 路径 | 组件 | 说明 |
|------|------|------|
| `/` | `DashboardPage` | 项目列表、新建项目 |
| `/editor/:projectId` | `EditorLayout` | 编辑器主布局 |
| `/editor/:projectId/script` | `ScriptWorkspace` | 剧本模式 |
| `/editor/:projectId/storyboard` | `StoryboardWorkspace` | 分镜模式 |
| `/editor/:projectId/video` | `VideoWorkspace` | 视频剪辑模式 |
| `/settings` | `SettingsPage` | 全局设置 |

### 4.3 状态管理架构

```typescript
// projectStore.ts - 核心数据 (支持撤销/重做)
interface ProjectState {
  meta: { id: string; name: string; createdAt: Date };
  script: ScriptContent;
  scenes: Scene[];
  tracks: Track[];
}

// uiStore.ts - UI 状态
interface UIState {
  activeMode: 'script' | 'storyboard' | 'video';
  selection: string | null;
  panelLayout: [number, number, number];
  timelineZoom: number;
  isPlaying: boolean;
}

// workerStore.ts - 任务状态
interface WorkerState {
  connectionStatus: 'connected' | 'disconnected';
  tasks: Map<string, TaskState>;
}
```

### 4.4 核心依赖

| 库 | 用途 |
|----|------|
| `dnd-kit` | 拖拽排序 |
| `react-resizable-panels` | 可调节面板布局 |
| `react-virtual` | 虚拟滚动 |
| `wavesurfer.js` | 音频波形编辑 |
| `zundo` | 撤销/重做 |

---

## 五、后端架构设计 (Rust)

### 5.1 模块结构

```
src-tauri/
├── Cargo.toml
├── binaries/               # sidecar 二进制
│   ├── dy-worker-*         # Worker 可执行文件
│   ├── ffmpeg-*            # FFmpeg
│   └── ffprobe-*           # FFprobe
└── crates/
    ├── common-ipc/         # IPC 协议定义
    │   ├── envelope.rs
    │   ├── events.rs
    │   └── errors.rs
    ├── main-orchestrator/  # 主进程核心
    │   ├── app_state.rs
    │   ├── worker_manager.rs
    │   ├── dispatcher.rs
    │   ├── scheduler.rs
    │   ├── repository/
    │   │   ├── projects_repo.rs
    │   │   ├── ai_tasks_repo.rs
    │   │   └── render_jobs_repo.rs
    │   ├── security/
    │   │   └── keychain_broker.rs
    │   └── ipc/
    │       ├── sidecar_client.rs
    │       └── protocol_codec.rs
    └── worker-runtime/     # Worker 进程
        ├── main.rs
        ├── runtime.rs
        ├── ipc/
        │   ├── stdio_server.rs
        │   └── command_router.rs
        ├── executors/
        │   ├── ai_executor.rs
        │   └── ffmpeg_executor.rs
        └── fs/
            └── workspace_guard.rs
```

### 5.2 核心接口

```rust
// 任务执行器 trait
pub trait TaskExecutor {
    fn supports(&self, task_type: TaskType) -> bool;
    async fn execute(&self, ctx: TaskContext) -> Result<TaskOutput, TaskError>;
}

// 任务类型枚举
pub enum TaskType {
    AiScript,      // 剧本生成
    AiStoryboard,  // 分镜拆解
    AiImage,       // 图像生成
    AiVideo,       // 视频生成
    Tts,           // 语音合成
    RenderCompose, // 视频合成
    RenderSubtitle,// 字幕烧录
    Export,        // 最终导出
}
```

### 5.3 Worker 管理策略

| 场景 | 策略 |
|------|------|
| 心跳间隔 | 2s |
| 丢失心跳 | 连续 3 次标记 unhealthy |
| 单次崩溃 | 立即重启 (1s) |
| 频繁崩溃 | 指数退避 (1s → 2s → 4s → 8s → 16s → 30s) |
| 熔断条件 | 10 分钟内重启 > 5 次 |

---

## 六、开发阶段规划

### Phase 1: 项目脚手架与 UI 框架 (Week 1-2)

**目标**: 搭建完整的项目骨架，实现静态 UI

**任务清单**:
1. 初始化 Tauri 2.x + React 18 + TypeScript 项目
2. 配置 shadcn/ui + Tailwind CSS（深色主题）
3. 实现全局布局组件（Sidebar + Canvas + Inspector）
4. 完成路由配置与页面骨架
5. 实现仪表盘页面（项目列表 Mock）
6. 实现编辑器三大工作区静态 UI
7. 集成 react-resizable-panels 实现面板拖拽

### Phase 2: SQLite 数据层 (Week 2-3)

**目标**: 打通数据持久化

**任务清单**:
1. 设计并创建 SQLite 迁移脚本
2. 实现 Repository 层（CRUD 操作）
3. 前端集成 TanStack Query
4. 实现项目创建/编辑/删除流程
5. 实现剧本版本化存储
6. 实现分镜数据管理

### Phase 3: Worker IPC 基础设施 (Week 3-4)

**目标**: 打通主进程与 Worker 通信

**任务清单**:
1. 定义 IPC 消息协议（NDJSON）
2. 实现 Worker 生命周期管理
3. 实现心跳检测与健康状态
4. 实现任务派发与进度收集
5. 前端集成 Worker 状态 Store
6. 实现任务队列可视化

### Phase 4: AI 能力接入 (Week 4-5)

**目标**: 接入 AI API，实现剧本与分镜生成

**任务清单**:
1. 实现 AI Provider 适配器抽象
2. 接入 LLM（剧本生成 + 分镜拆解）
3. 接入图像生成 API
4. 实现 Prompt 模板管理
5. 实现 AI 任务重试与缓存
6. 前端实现 AI 生成 UI 反馈

### Phase 5: FFmpeg 导出链路 (Week 5-6)

**目标**: 实现视频合成与导出

**任务清单**:
1. 集成 FFmpeg sidecar
2. 实现时间轴 → FFmpeg 命令转换
3. 实现素材拼接与混音
4. 实现字幕烧录
5. 实现抖音预设导出（1080x1920@30fps）
6. 实现进度解析与 UI 反馈

### Phase 6: 稳定性与优化 (Week 6+)

**目标**: 生产就绪

**任务清单**:
1. Worker 崩溃恢复机制
2. 任务断点续作
3. 中间文件清理策略
4. 虚拟滚动性能优化
5. 撤销/重做功能
6. 跨平台测试（Windows + macOS）

---

## 七、风险评估与缓解

| 风险 | 影响 | 概率 | 缓解措施 |
|------|------|------|---------|
| AI API 限流 | 高 | 中高 | 任务队列 + 自动重试 + 多 Provider 回退 |
| FFmpeg 命令失败 | 高 | 中 | 模板化构建器 + ffprobe 预检 |
| Worker 崩溃 | 中高 | 中 | 自动重启 + 熔断机制 |
| 磁盘占用膨胀 | 中 | 高 | TTL 清理 + 缓存上限 |
| API Key 泄露 | 高 | 中 | 系统密钥库 + 日志脱敏 |

---

## 八、技术栈版本锁定

| 技术 | 版本 | 说明 |
|------|------|------|
| Tauri | 2.x | 跨平台桌面框架 |
| React | 18.x | UI 框架 |
| TypeScript | 5.x | 类型系统 |
| shadcn/ui | latest | UI 组件库 |
| Zustand | 4.x | 状态管理 |
| TanStack Query | 5.x | 异步状态管理 |
| SQLite | 3.x | 本地数据库 |
| FFmpeg | 6.x+ | 视频处理 |

---

> **文档版本**: v1.0
> **最后更新**: 2026-02-09
> **规划者**: Claude (Codex + Gemini 协作)
