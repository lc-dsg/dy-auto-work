import { Outlet } from "react-router-dom";

/**
 * 根布局组件
 * 包含全局样式和基础结构
 */
export function RootLayout() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Outlet />
    </div>
  );
}
