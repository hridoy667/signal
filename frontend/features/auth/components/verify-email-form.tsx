"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { resendOtp, verifyEmail } from "@/services/auth.service";
import { ApiRequestError } from "@/lib/api";
import { ROUTES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = (searchParams.get("email") ?? "").trim();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
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

      {!email ? (
        <div
          className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100"
          role="alert"
        >
          <p className="font-medium">Missing email</p>
          <p className="mt-1 text-amber-900/90 dark:text-amber-100/85">
            Open this page from the link you get after registering, or{" "}
            <Link
              href={ROUTES.register}
              className="font-semibold text-teal-800 underline-offset-2 hover:underline dark:text-teal-300"
            >
              create an account
            </Link>{" "}
            again.
          </p>
        </div>
      ) : (
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Verifying
          </p>
          <p
            className="mt-1 break-all rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm font-medium text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            id="ve-email-display"
            aria-live="polite"
          >
            {email}
          </p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Code sent to this address. Need a different email?{" "}
            <Link
              href={ROUTES.register}
              className="font-medium text-teal-700 underline-offset-2 hover:underline dark:text-teal-400"
            >
              Register again
            </Link>
            .
          </p>
        </div>
      )}

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
          disabled={!email}
        />
      </div>
      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={loading || !email}
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
        Code is 6 digits · Check spam if you don&apos;t see the email
      </p>
    </form>
  );
}
