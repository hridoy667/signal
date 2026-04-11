import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { FeatureGrid, LandingCta, LandingHero } from "@/features/marketing";

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col bg-app text-zinc-900 antialiased dark:text-zinc-50">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <LandingHero />
        <FeatureGrid />
        <LandingCta />
      </main>
      <Footer />
    </div>
  );
}
