import { ButtonLink } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";

export const metadata = {
  title: "Pricing",
};

export default function PricingPage() {
  return (
    <main className="flex flex-1 flex-col px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white sm:text-5xl">
          Simple and fair
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Signal is in beta — core features are free while we learn with early
          communities. Paid tiers may arrive later; nothing changes for existing
          users without notice.
        </p>
        <div className="mt-10">
          <ButtonLink href={ROUTES.register} size="lg">
            Get started
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
