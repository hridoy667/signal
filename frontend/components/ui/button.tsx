import Link from "next/link";
import { cn } from "@/lib/utils";

const variantClass = {
  primary:
    "bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 text-white shadow-[0_4px_24px_-4px_rgba(13,148,136,0.45)] hover:shadow-[0_8px_32px_-6px_rgba(13,148,136,0.55)] hover:brightness-[1.03] active:scale-[0.98] dark:from-teal-400 dark:via-teal-500 dark:to-teal-700 dark:shadow-[0_4px_28px_-6px_rgba(45,212,191,0.25)]",
  secondary:
    "border border-zinc-200/90 bg-white/90 text-zinc-900 shadow-sm backdrop-blur-sm hover:border-teal-200 hover:bg-white hover:shadow-md dark:border-zinc-700/90 dark:bg-zinc-900/80 dark:text-zinc-50 dark:hover:border-teal-800/80 dark:hover:bg-zinc-900",
  ghost:
    "text-zinc-600 hover:bg-zinc-200/70 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/80 dark:hover:text-zinc-50",
  outline:
    "border border-zinc-300/90 bg-transparent hover:border-teal-300 hover:bg-teal-50/50 dark:border-zinc-600 dark:hover:border-teal-700 dark:hover:bg-teal-950/40",
} as const;

const sizeClass = {
  sm: "h-9 rounded-lg px-3.5 text-sm",
  md: "h-11 rounded-xl px-5 text-sm",
  lg: "h-[3.25rem] rounded-full px-9 text-[0.9375rem] font-semibold tracking-wide",
} as const;

export type ButtonVariant = keyof typeof variantClass;
export type ButtonSize = keyof typeof sizeClass;

const baseClass =
  "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500/60 disabled:pointer-events-none disabled:opacity-50";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(baseClass, variantClass[variant], sizeClass[size], className)}
      {...props}
    />
  );
}

export type ButtonLinkProps = Omit<
  React.ComponentProps<typeof Link>,
  "className"
> & {
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function ButtonLink({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(baseClass, variantClass[variant], sizeClass[size], className)}
      {...props}
    />
  );
}
