import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { LandingCta } from "@/components/marketing/landing-cta";
import { LandingHero } from "@/components/marketing/landing-hero";

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col bg-app text-zinc-900 antialiased dark:text-zinc-50">
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <LandingHero />
        <FeatureGrid />
        <LandingCta />
      </main>
      <SiteFooter />
    </div>
  );
}
