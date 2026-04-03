"use client";

import { useEffect, useId, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";

const AUTO_MS = 6500;

const slides = [
  {
    key: "feed",
    label: "Nearby feed",
    content: <FeedSlide />,
  },
  {
    key: "votes",
    label: "Votes and threads",
    content: <VotesSlide />,
  },
  {
    key: "rooms",
    label: "Live rooms",
    content: <RoomsSlide />,
  },
] as const;

export function HeroShowcase() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const baseId = useId();

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  function onTabListKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % slides.length);
    }
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a - 1 + slides.length) % slides.length);
    }
    if (e.key === "Home") {
      e.preventDefault();
      setActive(0);
    }
    if (e.key === "End") {
      e.preventDefault();
      setActive(slides.length - 1);
    }
  }

  return (
    <div
      className="noise-overlay relative h-[min(560px,68vh)] min-h-[420px] max-h-[640px] w-full overflow-hidden rounded-[2rem] border border-zinc-200/60 bg-gradient-to-br from-zinc-100 via-white to-teal-50/80 p-1 shadow-[0_24px_80px_-24px_rgba(13,148,136,0.35)] dark:border-zinc-800/60 dark:from-zinc-900 dark:via-zinc-950 dark:to-violet-950/40 dark:shadow-[0_24px_80px_-24px_rgba(0,0,0,0.6)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[1.75rem] bg-zinc-950/5 outline-none focus-within:ring-2 focus-within:ring-teal-500/40 dark:bg-zinc-950/80"
        role="region"
        aria-roledescription="carousel"
        aria-label="Product preview. Use the dots or arrow keys when the controls are focused."
        aria-live="polite"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowDown") {
            e.preventDefault();
            setActive((a) => (a + 1) % slides.length);
          }
          if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
            e.preventDefault();
            setActive((a) => (a - 1 + slides.length) % slides.length);
          }
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,transparent_35%,rgba(13,148,136,0.07)_100%)] dark:bg-[linear-gradient(145deg,transparent_25%,rgba(124,58,237,0.1)_100%)]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.4] dark:opacity-[0.12]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 0L0 12l12 12 12-12L12 0z' fill='none' stroke='%2371717a' stroke-opacity='0.15' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: "24px 24px",
          }}
          aria-hidden
        />

        <div className="relative min-h-0 flex-1">
          {slides.map((slide, i) => (
            <div
              key={slide.key}
              id={`${baseId}-panel-${i}`}
              role="tabpanel"
              aria-hidden={i !== active}
              aria-labelledby={`${baseId}-tab-${i}`}
              className={cn(
                "absolute inset-0 flex flex-col px-5 pb-14 pt-5 transition-opacity duration-500 ease-out sm:px-6 sm:pb-14 sm:pt-6",
                i === active
                  ? "z-10 opacity-100"
                  : "pointer-events-none z-0 opacity-0",
              )}
            >
              {slide.content}
            </div>
          ))}
        </div>

        <div
          className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2.5"
          role="tablist"
          aria-label="Preview slides"
          onKeyDown={onTabListKeyDown}
        >
          {slides.map((slide, i) => (
            <button
              key={slide.key}
              id={`${baseId}-tab-${i}`}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-controls={`${baseId}-panel-${i}`}
              tabIndex={i === active ? 0 : -1}
              className={cn(
                "size-2.5 rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500",
                i === active
                  ? "scale-125 bg-gradient-to-r from-teal-400 to-violet-500 shadow-[0_0_12px_rgba(45,212,191,0.5)]"
                  : "bg-zinc-300 hover:bg-zinc-400 dark:bg-zinc-600 dark:hover:bg-zinc-500",
              )}
              onClick={() => setActive(i)}
              title={slide.label}
            >
              <span className="sr-only">
                {slide.label}
                {i === active ? " (current)" : ""}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Shared shell: chrome bar + scrollable body + footer metrics — fills height */
function SlideShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <>
      <div className="mb-4 flex shrink-0 items-center justify-between gap-3 rounded-xl border border-zinc-200/60 bg-white/60 px-3 py-2.5 shadow-sm backdrop-blur-sm dark:border-zinc-700/60 dark:bg-zinc-900/70">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex gap-1">
            <span className="size-2 rounded-full bg-red-400/90" />
            <span className="size-2 rounded-full bg-amber-400/90" />
            <span className="size-2 rounded-full bg-emerald-400/90" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[11px] font-semibold text-zinc-800 dark:text-zinc-100">
              {title}
            </p>
            <p className="truncate text-[10px] text-zinc-500 dark:text-zinc-400">
              {subtitle}
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-md bg-teal-500/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
          Live
        </span>
      </div>
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-0.5 [scrollbar-width:thin]">
        {children}
      </div>
      <div className="mt-4 shrink-0">{footer}</div>
    </>
  );
}

function FeedSlide() {
  return (
    <SlideShell
      title="For you · Dhaka"
      subtitle="Sorted by nearness & recency"
      footer={
        <div className="flex items-center justify-between gap-2 rounded-xl border border-zinc-200/50 bg-gradient-to-r from-zinc-50/90 to-teal-50/40 px-3 py-2.5 dark:border-zinc-700/50 dark:from-zinc-900/80 dark:to-teal-950/30">
          <div className="flex -space-x-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="size-7 rounded-full border-2 border-white bg-gradient-to-br from-teal-400 to-violet-500 dark:border-zinc-900"
                style={{ zIndex: 4 - i }}
              />
            ))}
          </div>
          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Active now
            </p>
            <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
              128 neighbors
            </p>
          </div>
        </div>
      }
    >
      <div className="rounded-2xl border border-white/20 bg-white/90 p-4 shadow-lg backdrop-blur dark:border-zinc-700/50 dark:bg-zinc-900/90">
        <div className="flex items-center gap-3">
          <div className="size-10 shrink-0 rounded-full bg-gradient-to-br from-teal-400 to-violet-500" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Near you
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              12 new posts today · 3 trending
            </p>
          </div>
        </div>
        <div className="mt-3 space-y-2 border-t border-zinc-100 pt-3 dark:border-zinc-800">
          <div className="h-2 w-4/5 rounded bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-2 w-full rounded bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-2 w-3/5 rounded bg-zinc-100 dark:bg-zinc-800" />
        </div>
      </div>
      <div className="ml-3 rounded-2xl border border-teal-200/50 bg-teal-50/90 p-4 shadow-md dark:border-teal-900/40 dark:bg-teal-950/50">
        <div className="flex items-baseline justify-between gap-2">
          <p className="font-display text-sm font-bold text-teal-900 dark:text-teal-100">
            +42 votes
          </p>
          <span className="text-[10px] font-medium text-teal-700/80 dark:text-teal-300/80">
            this week
          </span>
        </div>
        <p className="mt-1 text-xs text-teal-800/80 dark:text-teal-300/80">
          On local topics in your districts
        </p>
        <div className="mt-3 flex gap-1.5">
          {["Parks", "Transit", "Safety"].map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-white/70 px-2 py-0.5 text-[10px] font-medium text-teal-900 shadow-sm dark:bg-teal-900/50 dark:text-teal-100"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-zinc-200/80 bg-white/95 p-4 shadow-md dark:border-zinc-700 dark:bg-zinc-900/95">
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2 flex-1 rounded-full bg-gradient-to-r from-zinc-200 to-zinc-100 dark:from-zinc-700 dark:to-zinc-800"
              style={{ opacity: 1 - i * 0.2 }}
            />
          ))}
        </div>
        <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
          Live rooms · 3 active nearby · 12 typing
        </p>
      </div>
    </SlideShell>
  );
}

function VotesSlide() {
  return (
    <SlideShell
      title="District pulse"
      subtitle="Polls & ranked threads"
      footer={
        <div className="grid grid-cols-3 gap-2 rounded-xl border border-violet-200/40 bg-violet-50/50 px-2 py-2 dark:border-violet-900/40 dark:bg-violet-950/40">
          {[
            { k: "Polls", v: "8" },
            { k: "Hot", v: "14" },
            { k: "New", v: "31" },
          ].map((x) => (
            <div key={x.k} className="text-center">
              <p className="text-[9px] font-bold uppercase tracking-wide text-violet-600 dark:text-violet-400">
                {x.k}
              </p>
              <p className="font-display text-sm font-bold text-zinc-900 dark:text-zinc-50">
                {x.v}
              </p>
            </div>
          ))}
        </div>
      }
    >
      <div className="rounded-2xl border border-violet-200/50 bg-gradient-to-br from-violet-50/95 to-white p-4 shadow-lg dark:border-violet-900/40 dark:from-violet-950/60 dark:to-zinc-900/90">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-violet-900 dark:text-violet-100">
              District poll
            </p>
            <p className="mt-1 text-xs text-violet-700/85 dark:text-violet-300/85">
              “Extend library hours?”
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-violet-500/15 px-2 py-0.5 text-[9px] font-bold text-violet-800 dark:text-violet-200">
            Ends 2d
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-lg bg-teal-500/15 px-3 py-1.5 text-xs font-semibold text-teal-800 dark:text-teal-200">
            ↑ 128
          </span>
          <span className="rounded-lg bg-zinc-500/10 px-3 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            ↓ 14
          </span>
          <span className="rounded-lg bg-zinc-500/10 px-3 py-1.5 text-xs text-zinc-600 dark:text-zinc-400">
            ○ 32
          </span>
        </div>
        <div className="mt-4 flex items-center gap-2 border-t border-violet-200/50 pt-3 dark:border-violet-800/50">
          <div className="size-6 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-500" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-medium text-zinc-800 dark:text-zinc-200">
              Moderator note
            </p>
            <p className="truncate text-[10px] text-zinc-500 dark:text-zinc-400">
              Please keep discussion civic · 1h ago
            </p>
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-zinc-200/80 bg-white/95 p-4 dark:border-zinc-700 dark:bg-zinc-900/95">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Thread · 24 replies · 6 branches
          </p>
          <span className="text-[10px] font-semibold text-teal-600 dark:text-teal-400">
            Best first
          </span>
        </div>
        <p className="mt-2 text-sm leading-snug text-zinc-800 dark:text-zinc-200">
          Nested replies stay readable — collapse side threads without losing
          context.
        </p>
        <div className="mt-3 flex gap-2">
          <div className="h-8 flex-1 rounded-lg bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-8 w-14 rounded-lg bg-teal-500/20 dark:bg-teal-500/25" />
        </div>
      </div>
      <div className="rounded-xl border border-dashed border-zinc-300/80 bg-zinc-50/50 px-3 py-2.5 dark:border-zinc-600 dark:bg-zinc-900/50">
        <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Up next
        </p>
        <p className="mt-1 text-xs text-zinc-700 dark:text-zinc-300">
          School zone speed limit — discussion opens tomorrow
        </p>
      </div>
    </SlideShell>
  );
}

function RoomsSlide() {
  return (
    <SlideShell
      title="Rooms"
      subtitle="Direct & groups · realtime"
      footer={
        <div className="flex items-center justify-between rounded-xl border border-cyan-200/40 bg-cyan-50/40 px-3 py-2 dark:border-cyan-900/40 dark:bg-cyan-950/30">
          <p className="text-[10px] font-medium text-cyan-900 dark:text-cyan-200">
            🔒 E2E-ready architecture
          </p>
          <p className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400">
            3 unread
          </p>
        </div>
      }
    >
      <div className="rounded-2xl border border-cyan-200/50 bg-cyan-50/90 p-4 shadow-md dark:border-cyan-900/40 dark:bg-cyan-950/40">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-cyan-900 dark:text-cyan-100">
            Weekend market
          </p>
          <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
            Live
          </span>
        </div>
        <div className="mt-3 max-h-[140px] space-y-2 overflow-hidden">
          {[
            ["Anyone bringing a cart?", "2m"],
            ["I can share — near gate B", "5m"],
            ["Rain check on 4pm?", "8m"],
            ["+2 more messages…", "…"],
          ].map(([a, b]) => (
            <div
              key={a}
              className="rounded-lg bg-white/85 px-3 py-2 text-xs text-zinc-700 shadow-sm dark:bg-zinc-900/85 dark:text-zinc-300"
            >
              <span className="line-clamp-2">{a}</span>
              <span className="mt-1 block text-[10px] text-zinc-400">
                {b}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-zinc-200/80 bg-white/95 p-4 dark:border-zinc-700 dark:bg-zinc-900/95">
        <div className="flex items-center justify-between">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Typing & read receipts
          </p>
          <div className="flex gap-1">
            <span className="size-2 animate-pulse rounded-full bg-teal-500" />
            <span className="size-2 animate-pulse rounded-full bg-teal-500/60 [animation-delay:150ms]" />
            <span className="size-2 animate-pulse rounded-full bg-teal-500/30 [animation-delay:300ms]" />
          </div>
        </div>
        <div className="mt-3 flex gap-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="h-1.5 flex-1 rounded-full bg-gradient-to-r from-teal-400/40 to-violet-400/40"
            />
          ))}
        </div>
      </div>
      <div className="flex gap-2 rounded-xl border border-zinc-200/60 bg-zinc-50/80 p-2 dark:border-zinc-700 dark:bg-zinc-900/60">
        <div className="h-9 flex-1 rounded-lg border border-zinc-200 bg-white text-[11px] text-zinc-400 dark:border-zinc-600 dark:bg-zinc-800">
          <span className="block px-2 py-2">Message…</span>
        </div>
        <div className="flex size-9 items-center justify-center rounded-lg bg-teal-600 text-[10px] font-bold text-white dark:bg-teal-500">
          ↑
        </div>
      </div>
    </SlideShell>
  );
}
