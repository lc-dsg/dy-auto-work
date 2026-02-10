import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ScrollArea,
  Input,
  LabelIndustrial,
  Button,
} from "@/components/ui";
import { Key, Folder, Trash2 } from "lucide-react";

/**
 * 设置页面 - Zen-iOS Hybrid 风格
 *
 * 设计规范:
 * - 毛玻璃卡片
 * - 凹陷输入框
 * - 大圆角和呼吸感间距
 * - 工业风格标签
 */
export function SettingsPage() {
  return (
    <div className="h-full flex flex-col min-h-0 overflow-hidden">
      {/* 顶部标题栏 */}
      <header className="h-14 flex items-center px-8 shrink-0 border-b border-[var(--border)]">
        <div>
          <h1 className="text-lg font-bold tracking-tight">设置</h1>
        </div>
      </header>

      {/* 设置内容 */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="max-w-2xl mx-auto p-10 space-y-8">
          {/* API 配置 */}
          <section>
            <div className="mb-4">
              <LabelIndustrial>服务配置</LabelIndustrial>
              <h2 className="text-xl font-bold tracking-tight mt-2">API 密钥</h2>
            </div>

            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-[18px] bg-white border border-black/5 shadow-sm flex items-center justify-center">
                    <Key className="w-7 h-7 text-[var(--accent)]" strokeWidth={2} />
                  </div>
                  <div>
                    <CardTitle>AI 服务配置</CardTitle>
                    <CardDescription>配置 AI 服务的 API 密钥以启用智能功能</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <LabelIndustrial>OpenAI API Key</LabelIndustrial>
                  <Input
                    type="password"
                    placeholder="sk-..."
                  />
                </div>
                <div className="space-y-2">
                  <LabelIndustrial>Stable Diffusion API</LabelIndustrial>
                  <Input
                    type="password"
                    placeholder="输入 API 密钥..."
                  />
                </div>
                <Button size="sm">保存配置</Button>
              </CardContent>
            </Card>
          </section>

          {/* 存储路径 */}
          <section>
            <div className="mb-4">
              <LabelIndustrial>本地存储</LabelIndustrial>
              <h2 className="text-xl font-bold tracking-tight mt-2">存储设置</h2>
            </div>

            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-[18px] bg-white border border-black/5 shadow-sm flex items-center justify-center">
                    <Folder className="w-7 h-7 text-[var(--success)]" strokeWidth={2} />
                  </div>
                  <div>
                    <CardTitle>存储路径</CardTitle>
                    <CardDescription>配置项目和缓存的存储位置</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <LabelIndustrial>项目存储路径</LabelIndustrial>
                  <div className="flex gap-3">
                    <Input
                      type="text"
                      readOnly
                      value="C:/Users/Administrator/Documents/DY-AutoWork"
                      className="flex-1"
                    />
                    <Button variant="outline" size="sm">
                      浏览
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <LabelIndustrial>缓存路径</LabelIndustrial>
                  <div className="flex gap-3">
                    <Input
                      type="text"
                      readOnly
                      value="C:/Users/Administrator/AppData/Local/DY-AutoWork/cache"
                      className="flex-1"
                    />
                    <Button variant="outline" size="sm">
                      浏览
                    </Button>
                  </div>
                </div>

                <Card variant="inset" className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Trash2 className="w-4 h-4 text-[var(--muted-foreground)]" strokeWidth={2} />
                      <div>
                        <span className="text-sm font-medium">缓存大小</span>
                        <p className="text-xs text-[var(--muted-foreground)]">清理后将重新生成</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold">256 MB</span>
                      <Button variant="destructive" size="sm">
                        清理
                      </Button>
                    </div>
                  </div>
                </Card>
              </CardContent>
            </Card>
          </section>

        </div>
      </ScrollArea>
    </div>
  );
}
