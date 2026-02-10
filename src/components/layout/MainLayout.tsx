import { Outlet } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { usePlatform, useTitlebarHeight } from "@/hooks/use-platform";

/**
 * 主布局组件 - 悬浮岛式布局
 *
 * 设计规范:
 * - 使用 shadcn/ui Sidebar 组件
 * - 侧边栏和内容区作为独立的悬浮卡片
 * - 毛玻璃材质
 * - macOS 沉浸式标题栏（Windows 使用系统原生标题栏，无需安全高度）
 * - 折叠按钮集成在侧边栏 Footer 内部（避免与内容区 Card 重叠）
 *
 * 平台适配:
 * - 通过 useTitlebarHeight() 设置 CSS 变量 --titlebar-height
 * - macOS: 52px 安全高度 + 拖拽区域
 * - Windows: 0px，使用系统原生标题栏
 */
export function MainLayout() {
  const platform = usePlatform();
  // 初始化 CSS 变量 --titlebar-height，供全局使用
  useTitlebarHeight();

  return (
    <SidebarProvider>
      {/* macOS Drag Region - 仅 macOS 下显示沉浸式拖拽区域 */}
      {platform === "macos" && (
        <div
          className="fixed top-0 left-0 right-0 z-50 h-[var(--titlebar-height)]"
          data-tauri-drag-region
        />
      )}
      <AppSidebar />
      <SidebarInset className="h-svh min-h-0 bg-transparent">
        <div className="flex flex-1 flex-col h-full p-2 pt-[calc(var(--titlebar-height)+0.5rem)] transition-[padding] duration-200 ease-linear">
          <Card variant="glass" className="flex-1 flex flex-col overflow-hidden rounded-[24px] border-white/20 shadow-sm">
            <Outlet />
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
