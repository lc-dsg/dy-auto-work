import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Zen-iOS Hybrid Button 组件
 *
 * 设计规范:
 * - 主按钮: 深空黑 (#1C1C1E)
 * - 次级按钮: 纯白带微弱投影
 * - 触觉反馈: active:scale-[0.97]
 * - iOS 连续曲率圆角
 */
const buttonVariants = cva(
  // 基础样式：触觉反馈 + iOS 圆角 + 过渡动画
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "text-sm font-semibold",
    "rounded-[12px]", // iOS 连续曲率
    "transition-all duration-150 ease-out",
    "active:scale-[0.97]", // 触觉反馈
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        // 主按钮 - 深空黑，高对比
        default: [
          "bg-[var(--primary)] text-[var(--primary-foreground)]",
          "shadow-[var(--shadow-button)]",
          "hover:bg-[#2C2C2E] hover:shadow-[0_6px_16px_-2px_rgba(0,0,0,0.12)]",
          "active:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.1)]",
        ].join(" "),

        // 次级按钮 - 纯白带投影
        secondary: [
          "bg-white text-[var(--foreground)]",
          "shadow-[var(--shadow-button)]",
          "border border-[var(--border-outer)]",
          "hover:bg-[var(--card-hover)] hover:shadow-[0_6px_16px_-2px_rgba(0,0,0,0.08)]",
          "active:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)]",
        ].join(" "),

        // 危险按钮
        destructive: [
          "bg-[var(--destructive)] text-[var(--destructive-foreground)]",
          "shadow-[var(--shadow-button)]",
          "hover:bg-[#E53935] hover:shadow-[0_6px_16px_-2px_rgba(255,59,48,0.25)]",
        ].join(" "),

        // 轮廓按钮 - 毛玻璃效果
        outline: [
          "bg-white/60 text-[var(--foreground)]",
          "backdrop-blur-sm",
          "border border-[var(--border)]",
          "shadow-sm",
          "hover:bg-white/80 hover:border-[var(--border-outer)]",
        ].join(" "),

        // 幽灵按钮 - 最小化视觉
        ghost: [
          "text-[var(--foreground)]",
          "hover:bg-black/5",
          "active:bg-black/10",
        ].join(" "),

        // 链接样式
        link: [
          "text-[var(--accent)] underline-offset-4",
          "hover:underline",
          "active:scale-100", // 链接不需要缩放反馈
        ].join(" "),

        // 强调按钮 - 使用强调色
        accent: [
          "bg-[var(--accent)] text-[var(--accent-foreground)]",
          "shadow-[0_4px_12px_-2px_rgba(0,122,255,0.3)]",
          "hover:bg-[#0066DD] hover:shadow-[0_6px_16px_-2px_rgba(0,122,255,0.4)]",
        ].join(" "),
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-4 text-xs rounded-[10px]",
        lg: "h-12 px-8 text-base rounded-[14px]",
        xl: "h-14 px-10 text-lg rounded-[16px]",
        icon: "h-10 w-10 rounded-[12px]",
        "icon-sm": "h-8 w-8 rounded-[10px]",
        "icon-lg": "h-12 w-12 rounded-[14px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
