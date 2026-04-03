"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { ROUTES } from "@/lib/constants";

type Props = {
  onMenuOpen: () => void;
  onCreateOpen: () => void;
};

export function MobileBottomNav({ onMenuOpen, onCreateOpen }: Props) {
  const pathname = usePathname();

  const feedActive =
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/feed");
  const msgActive = pathname.startsWith("/dashboard/messages");

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/[0.06] bg-[#080a0f]/95 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur-xl md:hidden"
      aria-label="Main"
    >
      <div className="mx-auto flex max-w-[1100px] items-center justify-around px-2">
        <NavIcon
          href={ROUTES.dashboardFeed}
          label="Feed"
          active={feedActive}
          icon={<FeedGlyph active={feedActive} />}
        />
        <NavIcon
          href={ROUTES.dashboardMessages}
          label="Chats"
          active={msgActive}
          icon={<ChatGlyph active={msgActive} />}
        />
        <button
          type="button"
          onClick={onCreateOpen}
          className="flex min-w-[4rem] flex-col items-center gap-1 py-1"
          aria-label="New post"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-indigo-400 text-white shadow-lg shadow-indigo-500/30">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className="text-[0.65rem] font-medium text-white/35">Post</span>
        </button>
        <button
          type="button"
          onClick={onMenuOpen}
          className="flex min-w-[4rem] flex-col items-center gap-1 py-2 text-[0.65rem] font-medium text-white/35"
          aria-label="More"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white/45" aria-hidden>
            <circle cx="5" cy="12" r="1.5" fill="currentColor" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            <circle cx="19" cy="12" r="1.5" fill="currentColor" />
          </svg>
          More
        </button>
      </div>
    </nav>
  );
}

function NavIcon({
  href,
  label,
  active,
  icon,
}: {
  href: string;
  label: string;
  active: boolean;
  icon: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex min-w-[4rem] flex-col items-center gap-1 rounded-xl py-2 text-[0.65rem] font-medium transition-colors",
        active ? "text-indigo-400" : "text-white/35 hover:text-white/55",
      )}
    >
      {icon}
      {label}
    </Link>
  );
}

function FeedGlyph({ active }: { active: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={cn(active ? "text-indigo-400" : "text-white/45")}
      aria-hidden
    >
      <path
        d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h10v2H4v-2z"
        fill="currentColor"
      />
    </svg>
  );
}

function ChatGlyph({ active }: { active: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={cn(active ? "text-indigo-400" : "text-white/45")}
      aria-hidden
    >
      <path
        d="M4 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H9l-4 3v-3H6a2 2 0 01-2-2V5z"
        stroke="currentColor"
        strokeWidth="1.75"
        fill="none"
      />
    </svg>
  );
}
