import { ButtonLink } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";

export function LandingCta() {
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-24">
      <div className="noise-overlay relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-zinc-200/60 bg-gradient-to-br from-teal-600 via-teal-700 to-violet-800 p-10 shadow-2xl shadow-teal-900/20 sm:p-14 dark:border-teal-900/30 dark:from-teal-900 dark:via-violet-950 dark:to-zinc-950 dark:shadow-black/40">
        <div
          className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-white/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-16 size-56 rounded-full bg-violet-500/20 blur-3xl"
          aria-hidden
        />
        <div className="relative max-w-2xl">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Ready to tune in?
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-teal-50/95">
            Create an account in minutes. Verify your email, pick your area, and
            start posting with people near you.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink
              href={ROUTES.register}
              size="lg"
              className="border-0 bg-white text-teal-800 shadow-lg hover:bg-zinc-100 dark:bg-white dark:text-teal-900"
            >
              Create account
            </ButtonLink>
            <ButtonLink
              href={ROUTES.login}
              variant="outline"
              size="lg"
              className="border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20 dark:border-white/30"
            >
              Sign in
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
