import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Zen-iOS Hybrid Card 组件
 *
 * 设计规范:
 * - 极致毛玻璃: backdrop-blur-[40px~60px]
 * - 半透明填充: White/40 ~ White/60
 * - 双层物理描边: 内光边 + 外轮廓
 * - 悬浮阴影: shadow-[0_24px_48px_-12px_rgba(0,0,0,0.08)]
 * - 大圆角: rounded-[28px] ~ rounded-[40px]
 */

const cardVariants = cva(
  // 基础样式
  [
    "text-[var(--card-foreground)]",
    "transition-all duration-200 ease-out",
  ].join(" "),
  {
    variants: {
      variant: {
        // 默认毛玻璃卡片
        default: [
          "bg-white/60",
          "backdrop-blur-[40px]",
          "rounded-[28px]",
          "border border-white/60",
          "shadow-[0_8px_32px_-8px_rgba(0,0,0,0.06),inset_0_0_0_1px_rgba(255,255,255,0.6),0_0_0_1px_rgba(209,213,219,0.4)]",
        ].join(" "),

        // 重度毛玻璃 - 更强的模糊和阴影
        glass: [
          "bg-white/70",
          "backdrop-blur-[60px]",
          "rounded-[40px]",
          "border border-white/70",
          "shadow-[0_24px_48px_-12px_rgba(0,0,0,0.08),inset_0_0_0_1px_rgba(255,255,255,0.7),0_0_0_1px_rgba(209,213,219,0.3)]",
        ].join(" "),

        // 悬浮卡片 - 强阴影
        elevated: [
          "bg-white/80",
          "backdrop-blur-[40px]",
          "rounded-[28px]",
          "border border-white/60",
          "shadow-[0_24px_48px_-12px_rgba(0,0,0,0.1),inset_0_0_0_1px_rgba(255,255,255,0.6),0_0_0_1px_rgba(209,213,219,0.4)]",
          "hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)]",
          "hover:translate-y-[-2px]",
        ].join(" "),

        // 交互式卡片 - 带悬浮效果
        interactive: [
          "bg-white/60",
          "backdrop-blur-[40px]",
          "rounded-[28px]",
          "border border-white/60",
          "shadow-[0_8px_32px_-8px_rgba(0,0,0,0.06),inset_0_0_0_1px_rgba(255,255,255,0.6),0_0_0_1px_rgba(209,213,219,0.4)]",
          "cursor-pointer",
          "hover:bg-white/75",
          "hover:shadow-[0_16px_40px_-8px_rgba(0,0,0,0.1)]",
          "hover:border-white/70",
          "active:scale-[0.98]",
        ].join(" "),

        // 凹陷卡片 - 用于输入区域
        inset: [
          "bg-[rgba(243,244,246,0.5)]",
          "rounded-[20px]",
          "border border-[rgba(0,0,0,0.04)]",
          "shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]",
        ].join(" "),

        // 纯净卡片 - 无模糊，纯白
        solid: [
          "bg-white",
          "rounded-[28px]",
          "border border-[var(--border-outer)]",
          "shadow-[0_8px_32px_-8px_rgba(0,0,0,0.06)]",
        ].join(" "),

        // 透明卡片 - 仅边框
        ghost: [
          "bg-transparent",
          "rounded-[28px]",
          "border border-[var(--border)]",
          "border-dashed",
        ].join(" "),
      },
      size: {
        default: "",
        sm: "rounded-[20px]",
        lg: "rounded-[40px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, size, className }))}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-2 p-8", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "font-bold text-lg leading-none tracking-tight text-[var(--foreground)]",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-[var(--muted-foreground)] mt-1", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-8 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-8 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  cardVariants,
};
