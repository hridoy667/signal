"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/services/api/auth";
import { ApiRequestError } from "@/services/api/client";
import { setAccessToken } from "@/lib/auth-storage";
import { ROUTES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await login({ email, password });
      const token = res.data?.accessToken;
      if (token) setAccessToken(token);
      router.push(ROUTES.dashboardFeed);
      router.refresh();
    } catch (err) {
      const msg =
        err instanceof ApiRequestError
          ? err.message
          : "Something went wrong. Try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4">
      {error ? (
        <p
          className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200"
          role="alert"
        >
          {error}
        </p>
      ) : null}
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <Label htmlFor="password" className="mb-0">
            Password
          </Label>
          <Link
            href="#"
            className="text-xs font-medium text-teal-700 underline-offset-2 hover:underline dark:text-teal-400"
            onClick={(e) => e.preventDefault()}
          >
            Forgot password?
          </Link>
        </div>
        <PasswordInput
          id="password"
          name="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={loading}
      >
        {loading ? "Signing in…" : "Sign in"}
      </Button>
      <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
        No account?{" "}
        <Link
          href={ROUTES.register}
          className="font-medium text-teal-700 underline-offset-4 hover:underline dark:text-teal-400"
        >
          Create one
        </Link>
      </p>
      <p className="border-t border-zinc-200/80 pt-4 text-center text-[11px] leading-relaxed text-zinc-500 dark:border-zinc-800/80 dark:text-zinc-500">
        Secured session · JWT auth · We never sell your email
      </p>
    </form>
  );
}
