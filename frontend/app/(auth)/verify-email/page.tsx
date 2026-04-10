import { Suspense } from "react";
import { AuthPageShell } from "@/components/layout/auth-page-shell";
import { AuthCardGlow } from "@/features/auth/components/auth-card-glow";
import { VerifyEmailForm } from "@/features/auth/components/verify-email-form";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

function VerifyFallback() {
  return (
    <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading form…</p>
  );
}

export default function VerifyEmailPage() {
  return (
    <AuthPageShell>
      <AuthCardGlow>
        <Card className="relative !p-4 overflow-hidden border-zinc-200/90 bg-white/95 shadow-2xl backdrop-blur-xl sm:!p-6 dark:border-zinc-800/90 dark:bg-zinc-950/95">
          <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-teal-500 via-teal-400 to-violet-500" />
          <div className="pt-1">
            <CardTitle>Verify email</CardTitle>
            <CardDescription>
              Enter the code we sent to your inbox. It expires after a few
              minutes.
            </CardDescription>
            <div className="mt-4 sm:mt-6">
              <Suspense fallback={<VerifyFallback />}>
                <VerifyEmailForm />
              </Suspense>
            </div>
          </div>
        </Card>
      </AuthCardGlow>
    </AuthPageShell>
  );
}
