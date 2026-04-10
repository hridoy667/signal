import { DashboardProvider } from "@/features/dashboard/components/dashboard-context";
import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";
import { RequireAuth } from "@/features/dashboard/components/require-auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth>
      <DashboardProvider>
        <DashboardShell>{children}</DashboardShell>
      </DashboardProvider>
    </RequireAuth>
  );
}
