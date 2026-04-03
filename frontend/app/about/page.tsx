import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ButtonLink } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";

export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-app text-zinc-900 antialiased dark:text-zinc-50">
      <SiteHeader />
      <main className="relative flex-1 overflow-hidden px-4 py-16 sm:px-6 sm:py-24">
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-96 w-[120%] -translate-x-1/2 bg-gradient-to-b from-violet-500/10 via-transparent to-transparent blur-3xl dark:from-violet-600/15"
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl">
          <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-teal-700 dark:text-teal-400">
            About Signal
          </p>
          <h1 className="font-display mt-4 text-4xl font-extrabold tracking-tight text-zinc-950 sm:text-5xl dark:text-white">
            Local voices,{" "}
            <span className="text-gradient">clear signal</span>
          </h1>
          <div className="mt-10 space-y-6 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            <p>
              Signal combines a location-aware community feed with real-time
              chat so neighbors can share updates, weigh in with votes, and
              coordinate when it counts — without the noise of a generic global
              timeline.
            </p>
            <p>
              The stack is built for maintainability: typed API clients,
              reusable UI primitives, and theme-aware layouts so you can ship
              features without rewriting the shell.
            </p>
          </div>
          <div className="mt-12 flex flex-wrap gap-4">
            <ButtonLink href={ROUTES.register} size="lg">
              Join the beta
            </ButtonLink>
            <ButtonLink href={ROUTES.home} variant="secondary" size="lg">
              Back home
            </ButtonLink>
          </div>
          <p className="mt-12 text-sm text-zinc-500 dark:text-zinc-500">
            <Link
              href={ROUTES.login}
              className="font-semibold text-teal-700 underline-offset-4 transition hover:underline dark:text-teal-400"
            >
              Sign in
            </Link>{" "}
            if you already have access.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
