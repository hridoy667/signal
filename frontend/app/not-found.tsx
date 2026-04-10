import Link from "next/link";
import { ROUTES } from "@/lib/constants";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-app px-4 text-center">
      <h1 className="font-display text-2xl font-bold text-zinc-900 dark:text-white">
        Page not found
      </h1>
      <p className="max-w-sm text-sm text-zinc-600 dark:text-zinc-400">
        The link may be broken or the page was removed.
      </p>
      <Link
        href={ROUTES.home}
        className="text-sm font-medium text-teal-700 underline-offset-4 hover:underline dark:text-teal-400"
      >
        Back to home
      </Link>
    </div>
  );
}
