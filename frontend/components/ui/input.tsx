import { cn } from "@/lib/cn";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, type = "text", ...props }: InputProps) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-xl border border-zinc-200/90 bg-white/90 px-4 text-sm text-zinc-900 shadow-sm transition placeholder:text-zinc-400 focus-visible:border-teal-400/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-teal-500/35 dark:border-zinc-700/90 dark:bg-zinc-900/90 dark:text-zinc-50 dark:placeholder:text-zinc-500",
        className,
      )}
      {...props}
    />
  );
}
