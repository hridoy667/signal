import { cn } from "@/lib/cn";

type Props = {
  count: number;
  className?: string;
};

/** Small pill for nav icons (navbar, mobile tab, sidebar). */
export function MessagesUnreadBadge({ count, className }: Props) {
  if (count < 1) return null;
  const text = count > 99 ? "99+" : String(count);
  return (
    <span
      className={cn(
        "pointer-events-none absolute right-0 top-0 flex h-[1.125rem] min-w-[1.125rem] translate-x-1/4 -translate-y-1/4 items-center justify-center rounded-full bg-rose-500 px-1 text-[0.625rem] font-bold tabular-nums leading-none text-white ring-2 ring-[#080a0f]",
        className,
      )}
      aria-hidden
    >
      {text}
    </span>
  );
}
