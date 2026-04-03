"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import { resolveMediaUrl } from "@/lib/media-url";
import { Spinner } from "@/components/ui/spinner";
import { DashboardNavbar } from "@/components/layout/dashboard-navbar";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardMobileDrawer } from "@/components/layout/dashboard-mobile-drawer";
import { MobileBottomNav } from "@/components/dashboard/mobile-bottom-nav";
import { CreatePostModal } from "@/components/dashboard/create-post-modal";
import { useDashboard } from "@/components/dashboard/dashboard-context";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/lib/cn";

function initials(email: string | undefined, first?: string | null, last?: string | null) {
  const a = first?.[0] ?? "";
  const b = last?.[0] ?? "";
  return (a + b || email?.[0] || "?").toUpperCase();
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const {
    user,
    userLoading,
    openCreate,
    closeCreate,
    createOpen,
    bumpFeed,
  } = useDashboard();

  const inChatRoom = /^\/dashboard\/messages\/[^/]+$/.test(pathname);

  if (userLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#080a0f]">
        <Spinner className="h-10 w-10 border-t-indigo-400" />
        <span className="text-sm text-white/30">Loading Signal…</span>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#080a0f] text-white">
      <div
        className="pointer-events-none fixed left-[20%] top-[-5%] z-0 h-[40vh] w-[40vw] rounded-full opacity-100"
        style={{
          background: "radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {inChatRoom ? (
        <ChatRoomHeader />
      ) : (
        <DashboardNavbar
          user={user}
          isMobile={isMobile}
          onMenuOpen={() => setDrawerOpen(true)}
          onNewPost={openCreate}
        />
      )}

      <DashboardMobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        user={user}
        onNewPost={openCreate}
      />

      <div
        className={cn(
          "relative z-10 mx-auto flex max-w-[1100px] gap-7 px-3 pb-28 pt-4 sm:px-6 md:pb-10 md:pt-6",
          inChatRoom && "max-w-[1100px]",
        )}
      >
        {!inChatRoom && !isMobile ? (
          <DashboardSidebar onNewPost={openCreate} />
        ) : null}
        <main className="min-w-0 flex-1">{children}</main>
      </div>

      {!inChatRoom && isMobile ? (
        <MobileBottomNav
          onMenuOpen={() => setDrawerOpen(true)}
          onCreateOpen={openCreate}
        />
      ) : null}

      <CreatePostModal
        open={createOpen}
        onClose={closeCreate}
        onSuccess={() => {
          bumpFeed();
          closeCreate();
        }}
      />
    </div>
  );
}

function ChatRoomHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#080a0f]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1100px] items-center gap-2 px-3 py-3 sm:px-6">
        <Link
          href={ROUTES.dashboardMessages}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white/70 transition hover:bg-white/[0.06]"
          aria-label="Back to messages"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M15 6l-6 6 6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
        <span className="font-[family-name:var(--font-syne)] text-lg font-semibold text-white">
          Chat
        </span>
        <DashboardShellUserChip />
      </div>
    </header>
  );
}

function DashboardShellUserChip() {
  const { user } = useDashboard();
  return (
    <span className="ml-auto flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-indigo-600 to-violet-700 text-xs font-semibold text-white ring-2 ring-white/10">
      {user?.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resolveMediaUrl(user.avatarUrl) ?? ""}
          alt=""
          className="h-full w-full object-cover"
        />
      ) : (
        initials(user?.email, user?.first_name, user?.last_name)
      )}
    </span>
  );
}
