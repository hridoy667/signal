"use client";

import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { resolveMediaUrl } from "@/lib/media-url";
import type { MeUser } from "@/types/dashboard";
import { useDashboard } from "@/components/dashboard/dashboard-context";
import { MessagesUnreadBadge } from "@/components/dashboard/messages-unread-badge";
import { cn } from "@/lib/cn";

function initials(u: MeUser | null) {
  if (!u) return "?";
  const a = u.first_name?.[0] ?? "";
  const b = u.last_name?.[0] ?? "";
  return (a + b || u.email?.[0] || "?").toUpperCase();
}

type Props = {
  user: MeUser | null;
  isMobile: boolean;
  onMenuOpen: () => void;
  onNewPost: () => void;
};

export function DashboardNavbar({ user, isMobile, onMenuOpen, onNewPost }: Props) {
  const { unreadMessagesCount } = useDashboard();

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#080a0f]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-3 px-3 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          {isMobile ? (
            <button
              type="button"
              onClick={onMenuOpen}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-white/70 transition hover:bg-white/[0.06] hover:text-white"
              aria-label="Open menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          ) : null}
          <Link
            href={ROUTES.dashboardFeed}
            className="font-[family-name:var(--font-syne)] text-lg font-semibold tracking-tight text-white"
          >
            Signal
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {!isMobile ? (
            <button
              type="button"
              onClick={onNewPost}
              className="rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 transition hover:brightness-110"
            >
              New post
            </button>
          ) : (
            <button
              type="button"
              onClick={onNewPost}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-indigo-400 text-white shadow-md shadow-indigo-500/25"
              aria-label="New post"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M12 5v14M5 12h14"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
          <Link
            href={ROUTES.dashboardMessages}
            className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white/55 transition hover:bg-white/[0.06] hover:text-white sm:h-10 sm:w-10"
            aria-label={
              unreadMessagesCount > 0
                ? `Messages, ${unreadMessagesCount} unread`
                : "Messages"
            }
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M4 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H9l-4 3v-3H6a2 2 0 01-2-2V5z"
                stroke="currentColor"
                strokeWidth="1.6"
              />
            </svg>
            <MessagesUnreadBadge count={unreadMessagesCount} />
          </Link>
          <Link
            href={ROUTES.dashboardProfile}
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-indigo-600 to-violet-700 text-xs font-semibold text-white ring-2 ring-white/10 transition hover:ring-indigo-400/40",
            )}
            title={user?.email ? `${user.email} — Profile` : "Profile"}
            aria-label="Your profile"
          >
            {user?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={resolveMediaUrl(user.avatarUrl) ?? ""}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              initials(user)
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
