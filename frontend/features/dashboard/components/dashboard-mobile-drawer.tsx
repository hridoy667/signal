"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import { clearAccessToken } from "@/lib/auth-storage";
import { resolveMediaUrl } from "@/lib/media-url";
import type { MeUser } from "@/types/dashboard";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
  user: MeUser | null;
  onNewPost: () => void;
};

const links = [
  { href: ROUTES.dashboardFeed, label: "Feed" },
  { href: ROUTES.dashboardMessages, label: "Messages" },
  { href: ROUTES.dashboardCreate, label: "New post page" },
  { href: ROUTES.dashboardProfile, label: "Profile" },
] as const;

export function DashboardMobileDrawer({
  open,
  onClose,
  user,
  onNewPost,
}: Props) {
  const pathname = usePathname();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-label="Close menu"
        onClick={onClose}
      />
      <div className="absolute left-0 top-0 flex h-full w-[min(100%,280px)] flex-col border-r border-white/[0.08] bg-[#0c0f16] p-4 shadow-2xl">
        <div className="mb-6 flex items-center gap-3 border-b border-white/[0.06] pb-4">
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-indigo-500 to-violet-700 text-sm font-semibold text-white">
            {user?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={resolveMediaUrl(user.avatarUrl) ?? ""}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              (user?.first_name?.[0] ?? user?.email?.[0] ?? "?").toUpperCase()
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">
              {[user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
                "You"}
            </p>
            <p className="truncate text-xs text-white/35">{user?.email}</p>
          </div>
        </div>
        <nav className="flex flex-col gap-1">
          {links.map(({ href, label }) => {
            const active = pathname.startsWith(href.replace(/\/$/, ""));
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  "rounded-xl px-3 py-3 text-sm font-medium transition",
                  active
                    ? "bg-indigo-500/15 text-indigo-300"
                    : "text-white/60 hover:bg-white/[0.04] hover:text-white",
                )}
              >
                {label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => {
              onNewPost();
              onClose();
            }}
            className="rounded-xl px-3 py-3 text-left text-sm font-medium text-indigo-300 hover:bg-white/[0.04]"
          >
            Create post (modal)
          </button>
        </nav>
        <div className="mt-auto space-y-2 pt-6">
          <button
            type="button"
            onClick={() => {
              clearAccessToken();
              window.location.href = ROUTES.login;
            }}
            className="w-full rounded-xl border border-white/[0.08] py-2.5 text-sm text-white/50 transition hover:border-white/15 hover:text-white/80"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
