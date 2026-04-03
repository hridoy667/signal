"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { resendOtp, verifyEmail } from "@/services/api/auth";
import { ApiRequestError } from "@/services/api/client";
import { ROUTES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") ?? "";

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      await verifyEmail({ email, otp });
      router.push(`${ROUTES.login}?verified=1`);
      router.refresh();
    } catch (err) {
      const msg =
        err instanceof ApiRequestError
          ? err.message
          : "Invalid or expired code.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function onResend() {
    if (!email) return;
    setError(null);
    setInfo(null);
    setResending(true);
    try {
      await resendOtp(email);
      setInfo("A new code was sent to your email.");
    } catch (err) {
      const msg =
        err instanceof ApiRequestError ? err.message : "Could not resend.";
      setError(msg);
    } finally {
      setResending(false);
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
      {info ? (
        <p
          className="rounded-xl border border-teal-200 bg-teal-50 px-3 py-2 text-sm text-teal-900 dark:border-teal-900 dark:bg-teal-950/50 dark:text-teal-100"
          role="status"
        >
          {info}
        </p>
      ) : null}
      <div>
        <Label htmlFor="ve-email">Email</Label>
        <Input
          id="ve-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="otp">6-digit code</Label>
        <Input
          id="otp"
          inputMode="numeric"
          autoComplete="one-time-code"
          required
          maxLength={12}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\s/g, ""))}
          placeholder="••••••"
        />
      </div>
      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={loading}
      >
        {loading ? "Verifying…" : "Verify & sign in"}
      </Button>
      <div className="flex flex-col gap-2 text-center sm:flex-row sm:justify-between sm:gap-4">
        <button
          type="button"
          onClick={onResend}
          disabled={resending || !email}
          className="text-sm font-medium text-teal-700 underline-offset-4 hover:underline disabled:opacity-50 dark:text-teal-400"
        >
          {resending ? "Sending…" : "Resend code"}
        </button>
        <Link
          href={ROUTES.login}
          className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          Back to sign in
        </Link>
      </div>
      <p className="border-t border-zinc-200/80 pt-4 text-center text-[11px] leading-relaxed text-zinc-500 dark:border-zinc-800/80 dark:text-zinc-500">
        Code is 6 digits · Wrong inbox? Update email above and resend
      </p>
    </form>
  );
}
