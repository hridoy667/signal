import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "noise-overlay rounded-2xl border border-zinc-200/70 bg-white/75 p-6 shadow-[0_8px_40px_-16px_rgba(0,0,0,0.08)] backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-950/70 dark:shadow-[0_12px_48px_-20px_rgba(0,0,0,0.5)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h2
      className={cn(
        "font-display text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50",
        className,
      )}
    >
      {children}
    </h2>
  );
}

export function CardDescription({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p
      className={cn(
        "mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400",
        className,
      )}
    >
      {children}
    </p>
  );
}
