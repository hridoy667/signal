import { SiteHeader } from "@/components/layout/site-header";

export function AuthPageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-hidden bg-app text-zinc-900 antialiased dark:text-zinc-50">
      <AuthAmbientLayers />

      <SiteHeader variant="minimal" dense />

      {/* Form column first on mobile — no marketing block above the fold */}
      <main className="relative z-[1] grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1fr)_min(100%,480px)]">
        <aside className="relative hidden overflow-hidden border-r border-zinc-200/40 bg-gradient-to-br from-violet-950/[0.55] via-zinc-950 to-teal-950/55 dark:border-zinc-800/50 lg:flex lg:flex-col lg:justify-between lg:px-10 lg:py-14 xl:px-14">
          <AsideGlows />
          <div className="relative z-[1]">
            <p className="font-display text-2xl font-bold leading-tight text-white xl:text-3xl">
              Local signal.
              <br />
              <span className="text-teal-300/95">Global polish.</span>
            </p>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-zinc-400">
              A calmer feed for neighborhoods: posts tied to place, votes that
              read clean, and chat when coordination matters.
            </p>

            <div className="mt-10 space-y-3">
              <AsidePreviewCard
                title="Near you"
                subtitle="12 new posts · 3 trending"
                accent="from-teal-500/20 to-teal-500/5"
              />
              <AsidePreviewCard
                title="District poll"
                subtitle="“New park hours?” · 128 ↑"
                accent="from-violet-500/20 to-violet-500/5"
                offset
              />
            </div>
          </div>
          <div className="relative z-[1] mt-10 flex items-end justify-between gap-4">
            <div className="flex gap-2">
              <span className="h-1 w-12 rounded-full bg-gradient-to-r from-teal-400 to-violet-400" />
              <span className="h-1 w-6 rounded-full bg-zinc-600" />
            </div>
            <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">
              Preview
            </p>
          </div>
        </aside>

        <div className="relative flex flex-1 flex-col px-4 pb-6 pt-2 sm:px-6 lg:min-h-0 lg:justify-center lg:px-8 lg:py-14">
          <FormColumnDecor />
          <div className="relative z-[1] mx-auto w-full max-w-md lg:mx-auto">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile: brand after form — optional scroll, doesn’t block inputs */}
      <section
        className="relative z-[1] shrink-0 border-t border-zinc-200/60 bg-gradient-to-r from-teal-500/[0.06] via-zinc-50/40 to-violet-500/[0.06] px-4 py-4 dark:border-zinc-800/60 dark:from-teal-500/10 dark:via-zinc-950/40 dark:to-violet-500/10 lg:hidden"
      >
        <div className="mx-auto flex max-w-md flex-col items-center gap-2 text-center">
          <p className="font-display text-sm font-bold text-zinc-800 dark:text-zinc-100">
            <span className="bg-gradient-to-r from-teal-600 to-violet-600 bg-clip-text text-transparent dark:from-teal-400 dark:to-violet-400">
              Signal
            </span>
            <span className="text-zinc-600 dark:text-zinc-400">
              {" "}
              · local feed &amp; chat
            </span>
          </p>
          <div className="flex justify-center gap-5 text-[10px]">
            {[
              { k: "Geo", v: "Feed" },
              { k: "Vote", v: "Threads" },
              { k: "Chat", v: "Rooms" },
            ].map((item) => (
              <span key={item.k} className="text-zinc-500 dark:text-zinc-500">
                <span className="font-bold uppercase tracking-wider text-zinc-400">
                  {item.k}
                </span>{" "}
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {item.v}
                </span>
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function AuthAmbientLayers() {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(124,58,237,0.12),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(124,58,237,0.18),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_60%_40%_at_100%_100%,rgba(13,148,136,0.1),transparent)] dark:bg-[radial-gradient(ellipse_60%_40%_at_100%_100%,rgba(13,148,136,0.12),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.35] dark:opacity-[0.08]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40' fill='none' stroke='%2371717a' stroke-opacity='0.12' stroke-width='0.5'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />
    </>
  );
}

function AsideGlows() {
  return (
    <div className="pointer-events-none absolute inset-0 opacity-50" aria-hidden>
      <div className="absolute -left-16 top-10 h-80 w-80 rounded-full bg-violet-500/35 blur-[100px]" />
      <div className="absolute bottom-10 right-0 h-72 w-72 rounded-full bg-teal-500/30 blur-[100px]" />
      <div className="absolute left-1/3 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-fuchsia-500/15 blur-[80px]" />
    </div>
  );
}

function AsidePreviewCard({
  title,
  subtitle,
  accent,
  offset,
}: {
  title: string;
  subtitle: string;
  accent: string;
  offset?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border border-white/10 bg-gradient-to-br p-3.5 shadow-lg backdrop-blur-sm ${accent} ${offset ? "ml-4" : ""}`}
    >
      <div className="flex items-center gap-3">
        <div className="size-9 shrink-0 rounded-full bg-gradient-to-br from-white/20 to-white/5 ring-1 ring-white/20" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="truncate text-xs text-zinc-400">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

function FormColumnDecor() {
  return (
    <>
      <div
        className="pointer-events-none absolute -right-20 top-1/4 h-72 w-72 rounded-full bg-teal-400/15 blur-[100px] dark:bg-teal-500/10"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-16 bottom-1/4 h-64 w-64 rounded-full bg-violet-500/15 blur-[90px] dark:bg-violet-500/10"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-8 top-12 hidden h-24 w-24 rounded-2xl border border-teal-500/20 bg-teal-500/5 lg:block"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-24 left-6 hidden h-16 w-16 rounded-full border border-violet-500/25 bg-violet-500/5 lg:block"
        aria-hidden
      />
    </>
  );
}
