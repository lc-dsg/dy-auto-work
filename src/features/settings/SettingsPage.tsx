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
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
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
 * - Tab 标签页切换 API 配置与存储设置
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
        <div className="max-w-2xl mx-auto p-10">
          <div className="mb-4">
            <LabelIndustrial>偏好设置</LabelIndustrial>
            <h2 className="text-xl font-bold tracking-tight mt-2">
              配置与存储
            </h2>
          </div>

          <Card>
            <Tabs defaultValue="api" className="w-full">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <TabsList>
                    <TabsTrigger
                      value="api"
                      className="gap-1.5 cursor-pointer"
                    >
                      <Key className="w-4 h-4" strokeWidth={2} />
                      AI 服务配置
                    </TabsTrigger>
                    <TabsTrigger
                      value="storage"
                      className="gap-1.5 cursor-pointer"
                    >
                      <Folder className="w-4 h-4" strokeWidth={2} />
                      存储路径
                    </TabsTrigger>
                  </TabsList>
                </div>
              </CardHeader>

              {/* API 配置面板 */}
              <TabsContent value="api">
                <CardContent className="space-y-5 pt-0">
                  <div className="space-y-1">
                    <CardTitle>API 密钥</CardTitle>
                    <CardDescription>
                      配置 AI 服务的 API 密钥以启用智能功能
                    </CardDescription>
                  </div>
                  <div className="space-y-2">
                    <LabelIndustrial>OpenAI API Key</LabelIndustrial>
                    <Input type="password" placeholder="sk-..." />
                  </div>
                  <div className="space-y-2">
                    <LabelIndustrial>Stable Diffusion API</LabelIndustrial>
                    <Input type="password" placeholder="输入 API 密钥..." />
                  </div>
                  <Button size="sm">保存配置</Button>
                </CardContent>
              </TabsContent>

              {/* 存储设置面板 */}
              <TabsContent value="storage">
                <CardContent className="space-y-5 pt-0">
                  <div className="space-y-1">
                    <CardTitle>存储设置</CardTitle>
                    <CardDescription>
                      配置项目和缓存的存储位置
                    </CardDescription>
                  </div>
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
                        <Trash2
                          className="w-4 h-4 text-[var(--muted-foreground)]"
                          strokeWidth={2}
                        />
                        <div>
                          <span className="text-sm font-medium">缓存大小</span>
                          <p className="text-xs text-[var(--muted-foreground)]">
                            清理后将重新生成
                          </p>
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
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
