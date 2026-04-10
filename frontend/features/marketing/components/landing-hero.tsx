import { ButtonLink } from "@/components/ui/button";
import { HeroShowcase } from "@/features/marketing/components/hero-showcase";
import { ROUTES } from "@/lib/constants";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden px-4 pb-24 pt-12 sm:px-6 sm:pb-32 sm:pt-16">
      {/* Aurora blobs */}
      <div
        className="pointer-events-none absolute -left-1/4 top-0 h-[520px] w-[520px] rounded-full bg-gradient-to-br from-violet-500/25 via-fuchsia-500/10 to-transparent blur-3xl dark:from-violet-600/20 dark:via-fuchsia-600/10"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-1/4 bottom-0 h-[480px] w-[480px] rounded-full bg-gradient-to-tl from-teal-400/30 via-cyan-500/10 to-transparent blur-3xl dark:from-teal-500/15 dark:via-cyan-600/10"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-teal-400/10 blur-[100px] dark:bg-teal-500/10"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 xl:gap-16">
        <div className="animate-fade-up">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-600 shadow-sm backdrop-blur-md dark:border-zinc-700/80 dark:bg-zinc-900/70 dark:text-zinc-400">
            <span className="size-1.5 rounded-full bg-gradient-to-r from-teal-500 to-violet-500" />
            Community · Location · Chat
          </p>
          <h1 className="font-display text-[2.35rem] font-extrabold leading-[1.08] tracking-tight text-zinc-950 sm:text-5xl sm:leading-[1.05] lg:text-[3.25rem] xl:text-[3.5rem] dark:text-white">
            Your neighborhood{" "}
            <span className="text-gradient">feed &amp; signal</span>
            <br className="hidden sm:block" />
            <span className="text-zinc-800 dark:text-zinc-100">
              {" "}
              in real time.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            Share what matters nearby, vote with clarity, and drop into rooms
            when you need to coordinate — without drowning in noise.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href={ROUTES.register} size="lg">
              Start free
            </ButtonLink>
            <ButtonLink href={ROUTES.login} variant="secondary" size="lg">
              I already have an account
            </ButtonLink>
          </div>
          <dl className="mt-14 grid grid-cols-3 gap-4 border-t border-zinc-200/80 pt-10 dark:border-zinc-800/80 sm:max-w-lg">
            {[
              { k: "Geo", v: "Posts" },
              { k: "Vote", v: "Threads" },
              { k: "Chat", v: "Rooms" },
            ].map((item) => (
              <div key={item.k}>
                <dt className="text-[0.65rem] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-500">
                  {item.k}
                </dt>
                <dd className="mt-1 font-display text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {item.v}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Interactive preview carousel */}
        <div className="relative mt-16 hidden lg:mt-0 lg:block">
          <HeroShowcase />
        </div>
      </div>
    </section>
  );
}
