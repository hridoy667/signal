import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";

type NavbarProps = {
  variant?: "marketing" | "minimal";
  /** Tighter bar for auth flows (more room for form on small screens). */
  dense?: boolean;
};

export function Navbar({ variant = "marketing", dense = false }: NavbarProps) {
  if (variant === "minimal") {
    return (
      <header className="sticky top-0 z-30 border-b border-zinc-200/60 bg-zinc-50/75 backdrop-blur-2xl dark:border-zinc-800/60 dark:bg-zinc-950/75">
        <div
          className={`mx-auto flex max-w-5xl items-center justify-between px-4 sm:px-6 ${dense ? "h-12" : "h-16"}`}
        >
          <Logo />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href={ROUTES.home}
              className="rounded-xl px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-200/80 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/90 dark:hover:text-zinc-50"
            >
              Home
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/50 bg-zinc-50/70 backdrop-blur-2xl dark:border-zinc-800/50 dark:bg-zinc-950/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href={ROUTES.about}
            className="hidden rounded-xl px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-200/70 hover:text-zinc-900 sm:inline-flex dark:text-zinc-400 dark:hover:bg-zinc-800/80 dark:hover:text-zinc-50"
          >
            About
          </Link>
          <Link
            href={ROUTES.pricing}
            className="hidden rounded-xl px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-200/70 hover:text-zinc-900 sm:inline-flex dark:text-zinc-400 dark:hover:bg-zinc-800/80 dark:hover:text-zinc-50"
          >
            Pricing
          </Link>
          <div className="mr-1 flex items-center rounded-full border border-zinc-200/80 bg-white/50 p-0.5 dark:border-zinc-700/80 dark:bg-zinc-900/50">
            <ThemeToggle className="border-0 bg-transparent shadow-none dark:bg-transparent" />
          </div>
          <Link
            href={ROUTES.login}
            className="rounded-xl px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-200/70 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/80 dark:hover:text-zinc-50"
          >
            Sign in
          </Link>
          <ButtonLink href={ROUTES.register} size="sm">
            Join
          </ButtonLink>
        </nav>
      </div>
    </header>
  );
}
