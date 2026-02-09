import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Zen-iOS Hybrid Input 组件
 *
 * 设计规范:
 * - 凹陷效果: shadow-inner + bg-gray-100/50
 * - 模拟喷砂工艺刻痕视觉
 * - iOS 连续曲率圆角
 */

const inputVariants = cva(
  // 基础样式
  [
    "flex w-full",
    "text-[var(--foreground)] text-sm",
    "placeholder:text-[var(--muted-foreground)]/60",
    "transition-all duration-150 ease-out",
    "focus:outline-none",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "file:border-0 file:bg-transparent file:text-sm file:font-medium",
  ].join(" "),
  {
    variants: {
      variant: {
        // 默认凹陷输入框
        default: [
          "bg-[rgba(243,244,246,0.5)]",
          "rounded-[12px]",
          "border border-[rgba(0,0,0,0.04)]",
          "shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]",
          "focus:bg-white/80",
          "focus:border-[var(--ring)]",
          "focus:shadow-[inset_0_1px_2px_rgba(0,0,0,0.04),0_0_0_3px_rgba(0,122,255,0.1)]",
        ].join(" "),

        // 毛玻璃输入框
        glass: [
          "bg-white/40",
          "backdrop-blur-sm",
          "rounded-[12px]",
          "border border-white/60",
          "shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]",
          "focus:bg-white/60",
          "focus:border-[var(--ring)]",
          "focus:shadow-[0_0_0_3px_rgba(0,122,255,0.1)]",
        ].join(" "),

        // 透明输入框 - 最小化边框
        ghost: [
          "bg-transparent",
          "rounded-[8px]",
          "border-0",
          "focus:bg-black/5",
        ].join(" "),

        // 搜索框样式
        search: [
          "bg-[rgba(0,0,0,0.04)]",
          "rounded-[14px]",
          "border-0",
          "shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]",
          "focus:bg-white",
          "focus:shadow-[0_0_0_3px_rgba(0,122,255,0.1),0_4px_12px_-2px_rgba(0,0,0,0.08)]",
        ].join(" "),
      },
      inputSize: {
        default: "h-11 px-4 py-2",
        sm: "h-9 px-3 py-1 text-xs rounded-[10px]",
        lg: "h-13 px-5 py-3 text-base rounded-[14px]",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, inputSize, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, inputSize, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

/**
 * Textarea 组件 - 多行输入
 */
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof inputVariants> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, inputSize, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          inputVariants({ variant, inputSize }),
          "min-h-[100px] resize-none py-3",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

/**
 * Label 组件
 */
const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium text-[var(--foreground)] leading-none",
      "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
));
Label.displayName = "Label";

/**
 * 工业风格标签
 */
const LabelIndustrial = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--muted-foreground)]",
      className
    )}
    {...props}
  />
));
LabelIndustrial.displayName = "LabelIndustrial";

export { Input, Textarea, Label, LabelIndustrial, inputVariants };
