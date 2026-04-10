import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-app text-zinc-900 antialiased dark:text-zinc-50">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
