import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

const ITEMS = [
  {
    title: "Geo-aware feed",
    body: "Surface posts from the districts and places you actually care about — not a random global firehose.",
    icon: MapIcon,
    accent:
      "border-teal-200/60 bg-gradient-to-br from-teal-50/90 to-white dark:border-teal-900/40 dark:from-teal-950/50 dark:to-zinc-950/80",
  },
  {
    title: "Vote & threaded talk",
    body: "Up, down, or neutral with nested replies that stay readable when threads blow up.",
    icon: VoteIcon,
    accent:
      "border-violet-200/60 bg-gradient-to-br from-violet-50/80 to-white dark:border-violet-900/40 dark:from-violet-950/40 dark:to-zinc-950/80",
  },
  {
    title: "Rooms & live chat",
    body: "Direct and group messaging with real-time delivery when you need to move fast.",
    icon: ChatIcon,
    accent:
      "border-zinc-200/70 bg-gradient-to-br from-zinc-50/90 via-white to-cyan-50/50 dark:border-zinc-700/60 dark:from-zinc-900/80 dark:via-zinc-950 dark:to-cyan-950/20",
  },
] as const;

export function FeatureGrid() {
  const [first, second, third] = ITEMS;

  return (
    <section className="relative border-y border-zinc-200/60 px-4 py-20 dark:border-zinc-800/60 sm:px-6 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(124,58,237,0.06),transparent)] dark:bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(124,58,237,0.08),transparent)]" />
      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-display text-sm font-bold uppercase tracking-[0.25em] text-teal-700 dark:text-teal-400">
            Why Signal
          </p>
          <h2 className="font-display mt-3 text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl dark:text-white">
            Built for clarity at local scale
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            Opinionated UX, calm typography, and structure that scales — so
            your community stays legible as it grows.
          </p>
        </div>

        <ul className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:max-w-6xl">
          <li className="min-w-0">
            <FeatureCardBody item={first} />
          </li>
          <li className="min-w-0">
            <FeatureCardBody item={second} />
          </li>
          <li className="flex justify-center sm:col-span-2">
            <div className="w-full max-w-2xl sm:max-w-3xl">
              <FeatureCardBody item={third} />
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}

function FeatureCardBody({ item }: { item: (typeof ITEMS)[number] }) {
  const Icon = item.icon;
  return (
    <Card
      className={cn(
        "group h-full border p-7 transition duration-300 hover:-translate-y-1 hover:shadow-xl",
        item.accent,
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500/15 to-violet-500/15 ring-1 ring-inset ring-white/50 dark:ring-white/5">
        <Icon />
      </div>
      <h3 className="font-display mt-5 text-lg font-bold text-zinc-900 dark:text-zinc-50">
        {item.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {item.body}
      </p>
    </Card>
  );
}

function MapIcon() {
  return (
    <svg
      className="size-6 text-teal-700 dark:text-teal-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 20.25 4.5 18V6l4.5 2.25L15 6l4.5 2.25V18L15 20.25l-4.5-2.25L9 20.25Z"
      />
    </svg>
  );
}

function VoteIcon() {
  return (
    <svg
      className="size-6 text-violet-700 dark:text-violet-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.5 10.5 12 5l4.5 5.5M7.5 13.5 12 19l4.5-5.5"
      />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg
      className="size-6 text-cyan-700 dark:text-cyan-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.77 9.77 0 0 1-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
      />
    </svg>
  );
}
