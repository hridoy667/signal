import { AuthPageShell } from "@/components/layout/auth-page-shell";
import { AuthCardGlow, LoginForm } from "@/features/auth";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ verified?: string }>;
}) {
  const { verified } = await searchParams;
  const showVerified = verified === "1";

  return (
    <AuthPageShell>
      <AuthCardGlow>
        <Card className="relative !p-4 overflow-hidden border-zinc-200/90 bg-white/95 shadow-2xl backdrop-blur-xl sm:!p-6 dark:border-zinc-800/90 dark:bg-zinc-950/95">
          <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-teal-500 via-teal-400 to-violet-500" />
          <div className="pt-1">
            <CardTitle>Sign in</CardTitle>
            <CardDescription>
              Welcome back — use the email and password for your account.
            </CardDescription>
            {showVerified ? (
              <p
                className="mt-4 rounded-xl border border-teal-200/80 bg-teal-50/90 px-4 py-3 text-sm text-teal-900 dark:border-teal-800/60 dark:bg-teal-950/50 dark:text-teal-100"
                role="status"
              >
                Email verified — you can sign in now.
              </p>
            ) : null}
            <div className="mt-4 sm:mt-6">
              <LoginForm />
            </div>
          </div>
        </Card>
      </AuthCardGlow>
    </AuthPageShell>
  );
}
