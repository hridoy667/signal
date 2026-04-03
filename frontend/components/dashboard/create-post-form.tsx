"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createPost } from "@/services/api/posts";
import { ApiRequestError } from "@/app/lib/api";
import { ROUTES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/cn";

type Props = {
  variant?: "page" | "modal";
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function CreatePostForm({
  variant = "page",
  onSuccess,
  onCancel,
}: Props) {
  const router = useRouter();
  const dark = variant === "modal";
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = content.trim();
    if (!text && !file) {
      setError("Add text or an image.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await createPost({ content: text || undefined, image: file });
      onSuccess?.();
      if (!onSuccess) {
        router.push(ROUTES.dashboardFeed);
        router.refresh();
      }
    } catch (err) {
      const msg =
        err instanceof ApiRequestError
          ? err.message
          : "Could not create post.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {error ? (
        <p
          className={cn(
            "rounded-xl border px-3 py-2 text-sm",
            dark
              ? "border-rose-500/30 bg-rose-500/10 text-rose-200"
              : "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200",
          )}
          role="alert"
        >
          {error}
        </p>
      ) : null}
      <div>
        <Label
          htmlFor="post-content"
          className={cn(dark && "text-white/55")}
        >
          What&apos;s on your mind?
        </Label>
        <textarea
          id="post-content"
          name="content"
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share something with people nearby…"
          className={cn(
            "mt-1.5 w-full min-h-[120px] resize-y rounded-xl border px-3 py-2.5 text-sm shadow-sm outline-none transition",
            dark
              ? "border-white/10 bg-white/[0.04] text-white placeholder:text-white/25 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
              : "border-zinc-200 bg-white/90 text-zinc-900 placeholder:text-zinc-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-50",
          )}
        />
      </div>
      <div>
        <Label htmlFor="post-image" className={cn(dark && "text-white/55")}>
          Photo (optional)
        </Label>
        <Input
          id="post-image"
          name="image"
          type="file"
          accept="image/*"
          className={cn(
            "mt-1.5 cursor-pointer",
            dark && "border-white/10 bg-white/[0.04] text-white/80 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-500/20 file:px-3 file:py-1.5 file:text-sm file:text-indigo-200",
          )}
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </div>
      {preview ? (
        <div
          className={cn(
            "overflow-hidden rounded-xl border",
            dark ? "border-white/10" : "border-zinc-200 dark:border-zinc-700",
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="" className="max-h-64 w-full object-cover" />
        </div>
      ) : null}
      <div className="flex gap-3">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? "Posting…" : "Post"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => (onCancel ? onCancel() : router.push(ROUTES.dashboardFeed))}
          className={cn(
            dark &&
              "border-white/10 bg-white/[0.06] text-white/80 hover:bg-white/[0.1]",
          )}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
