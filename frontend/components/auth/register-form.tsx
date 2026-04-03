"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerMultipart } from "@/services/api/auth";
import { ApiRequestError } from "@/services/api/client";
import { ROUTES } from "@/lib/constants";
import type { RegisterPayload } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/cn";

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterPayload>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    district: "",
    gender: "male",
  });
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof RegisterPayload>(key: K, value: RegisterPayload[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await registerMultipart(form, image);
      const q = new URLSearchParams({ email: form.email });
      router.push(`${ROUTES.verifyEmail}?${q.toString()}`);
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
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        <div>
          <Label htmlFor="first_name">First name</Label>
          <Input
            id="first_name"
            required
            value={form.first_name}
            onChange={(e) => update("first_name", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="last_name">Last name</Label>
          <Input
            id="last_name"
            value={form.last_name ?? ""}
            onChange={(e) => update("last_name", e.target.value)}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <PasswordInput
          id="password"
          name="password"
          required
          autoComplete="new-password"
          value={form.password}
          onChange={(e) => update("password", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="district">District</Label>
        <Input
          id="district"
          required
          value={form.district}
          onChange={(e) => update("district", e.target.value)}
          placeholder="e.g. Dhaka"
        />
      </div>
      <div>
        <Label htmlFor="gender">Gender</Label>
        <select
          id="gender"
          value={form.gender}
          onChange={(e) =>
            update("gender", e.target.value as RegisterPayload["gender"])
          }
          className={cn(
            "flex h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 shadow-sm focus-visible:border-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-500/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50",
          )}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      <div>
        <Label htmlFor="image">Profile photo (optional)</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          className="cursor-pointer py-2 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-100 file:px-3 file:text-sm file:font-medium dark:file:bg-zinc-800"
          onChange={(e) => setImage(e.target.files?.[0] ?? null)}
        />
      </div>
      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={loading}
      >
        {loading ? "Sending code…" : "Continue"}
      </Button>
      <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
        Already have an account?{" "}
        <Link
          href={ROUTES.login}
          className="font-medium text-teal-700 underline-offset-4 hover:underline dark:text-teal-400"
        >
          Sign in
        </Link>
      </p>
      <p className="border-t border-zinc-200/80 pt-4 text-center text-[11px] leading-relaxed text-zinc-500 dark:border-zinc-800/80 dark:text-zinc-500">
        OTP expires in minutes · Check spam if you don&apos;t see the email
      </p>
    </form>
  );
}
