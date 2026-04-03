import Link from "next/link";
import { ROUTES } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="relative border-t border-zinc-200/60 bg-gradient-to-b from-zinc-100/90 to-zinc-200/40 px-4 py-14 dark:border-zinc-800/60 dark:from-zinc-950 dark:to-zinc-900/80 sm:px-6">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/40 to-transparent dark:via-teal-500/30"
        aria-hidden
      />
      <div className="mx-auto flex max-w-6xl flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm">
          <p className="font-display text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Signal
          </p>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Local feed, votes, and chat — built for neighborhoods, not noise.
          </p>
        </div>
        <div className="flex flex-col gap-6 sm:flex-row sm:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
              Product
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link
                  href={ROUTES.about}
                  className="text-zinc-700 transition hover:text-teal-700 dark:text-zinc-300 dark:hover:text-teal-400"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.register}
                  className="text-zinc-700 transition hover:text-teal-700 dark:text-zinc-300 dark:hover:text-teal-400"
                >
                  Get started
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
              Account
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link
                  href={ROUTES.login}
                  className="text-zinc-700 transition hover:text-teal-700 dark:text-zinc-300 dark:hover:text-teal-400"
                >
                  Sign in
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.register}
                  className="text-zinc-700 transition hover:text-teal-700 dark:text-zinc-300 dark:hover:text-teal-400"
                >
                  Register
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-6xl border-t border-zinc-200/60 pt-8 text-center text-xs text-zinc-500 dark:border-zinc-800/60 dark:text-zinc-500">
        © {new Date().getFullYear()} Signal. All rights reserved.
      </p>
    </footer>
  );
}
