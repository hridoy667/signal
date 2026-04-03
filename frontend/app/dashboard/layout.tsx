import { DashboardProvider } from "@/components/dashboard/dashboard-context";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { RequireAuth } from "@/components/dashboard/require-auth";

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
