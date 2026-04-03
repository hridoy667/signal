"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import { clearAccessToken } from "@/lib/auth-storage";
import { cn } from "@/lib/cn";

const links = [
  {
    href: ROUTES.dashboardFeed,
    label: "Feed",
    match: (p: string) => p === "/dashboard" || p.startsWith("/dashboard/feed"),
    icon: FeedIcon,
  },
  {
    href: ROUTES.dashboardMessages,
    label: "Messages",
    match: (p: string) => p.startsWith("/dashboard/messages"),
    icon: ChatIcon,
  },
  {
    href: ROUTES.dashboardCreate,
    label: "Compose",
    match: (p: string) => p.startsWith("/dashboard/create"),
    icon: PenIcon,
  },
] as const;

type Props = {
  onNewPost: () => void;
};

export function DashboardSidebar({ onNewPost }: Props) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-[57px] hidden w-[220px] shrink-0 flex-col gap-2 md:flex">
      <nav className="flex flex-col gap-1">
        {links.map(({ href, label, match, icon: Icon }) => {
          const active = match(pathname);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-indigo-500/15 text-indigo-300"
                  : "text-white/45 hover:bg-white/[0.04] hover:text-white/80",
              )}
            >
              <Icon active={active} />
              {label}
            </Link>
          );
        })}
      </nav>
      <button
        type="button"
        onClick={onNewPost}
        className="mt-2 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-400 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:brightness-110"
      >
        Quick post
      </button>
      <button
        type="button"
        onClick={() => {
          clearAccessToken();
          window.location.href = ROUTES.login;
        }}
        className="mt-auto rounded-xl px-3 py-2 text-left text-sm text-white/35 transition hover:bg-white/[0.04] hover:text-white/60"
      >
        Log out
      </button>
    </aside>
  );
}

function FeedIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      className={cn(active ? "text-indigo-400" : "text-white/35")}
      aria-hidden
    >
      <path
        d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h10v2H4v-2z"
        fill="currentColor"
      />
    </svg>
  );
}

function ChatIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      className={cn(active ? "text-indigo-400" : "text-white/35")}
      aria-hidden
    >
      <path
        d="M4 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H9l-4 3v-3H6a2 2 0 01-2-2V5z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function PenIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      className={cn(active ? "text-indigo-400" : "text-white/35")}
      aria-hidden
    >
      <path
        d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
