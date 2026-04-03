import { AuthPageShell } from "@/components/layout/auth-page-shell";
import { AuthCardGlow } from "@/components/auth/auth-card-glow";
import { RegisterForm } from "@/components/auth/register-form";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <AuthPageShell>
      <AuthCardGlow>
        <Card className="relative !p-4 overflow-hidden border-zinc-200/90 bg-white/95 shadow-2xl backdrop-blur-xl sm:!p-6 dark:border-zinc-800/90 dark:bg-zinc-950/95">
          <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-teal-500 via-teal-400 to-violet-500" />
          <div className="pt-1">
            <CardTitle>Create account</CardTitle>
            <CardDescription>
              We&apos;ll email you a code to verify before your account is
              active.
            </CardDescription>
            <div className="mt-4 sm:mt-6">
              <RegisterForm />
            </div>
          </div>
        </Card>
      </AuthCardGlow>
    </AuthPageShell>
  );
}
