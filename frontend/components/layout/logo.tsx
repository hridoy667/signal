import Link from "next/link";
import { ROUTES } from "@/lib/constants";

export function Logo() {
  return (
    <Link
      href={ROUTES.home}
      className="group flex items-center gap-2.5 text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
    >
      <span
        className="relative flex size-9 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-teal-400 via-teal-600 to-violet-600 text-sm font-extrabold text-white shadow-lg shadow-teal-500/25 ring-2 ring-white/30 transition group-hover:scale-[1.03] group-hover:shadow-teal-500/40 dark:from-teal-400 dark:via-teal-500 dark:to-violet-500 dark:ring-white/10"
        aria-hidden
      >
        <span className="relative z-10">S</span>
        <span className="absolute inset-0 bg-gradient-to-tr from-white/25 to-transparent opacity-60" />
      </span>
      <span className="font-display text-base font-bold tracking-tight">
        Signal
      </span>
    </Link>
  );
}
