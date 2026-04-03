"use client";

import { useCallback, useEffect, useState } from "react";
import { getFeed } from "@/services/api/posts";
import { ApiRequestError } from "@/services/api/client";
import type { FeedPost } from "@/types/dashboard";
import { PostCard } from "@/components/dashboard/post-card";
import { useDashboard } from "@/components/dashboard/dashboard-context";

export function FeedClient() {
  const { feedKey, openCreate } = useDashboard();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loc, setLoc] = useState<{ lat: number; lng: number } | null>(null);

  const patchPost = useCallback((id: string, patch: Partial<FeedPost>) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    );
  }, []);

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await getFeed(loc?.lat, loc?.lng);
      setPosts((res.data as FeedPost[]) ?? []);
    } catch (e) {
      const msg =
        e instanceof ApiRequestError ? e.message : "Could not load feed.";
      setError(msg);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [loc?.lat, loc?.lng]);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLoc({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {
        /* server defaults */
      },
      { enableHighAccuracy: false, maximumAge: 60_000, timeout: 10_000 },
    );
  }, []);

  useEffect(() => {
    void load();
  }, [load, feedKey]);

  if (loading && posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-sm text-white/35">Fetching your feed…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 px-4 py-6 text-center">
        <p className="text-sm text-rose-300/90">{error}</p>
        <button
          type="button"
          onClick={() => void load()}
          className="mt-3 text-sm font-medium text-indigo-400 underline-offset-2 hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <header className="mb-2">
        <h1
          className="font-serif text-[1.35rem] font-extrabold tracking-tight text-white md:text-[1.5rem]"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          Your feed
        </h1>
        <p className="mt-1 text-[13px] text-white/30">
          {loading
            ? "Fetching posts…"
            : `${posts.length} posts · ranked by signal score`}
          {loc ? " · using your area" : ""}
        </p>
      </header>

      <button
        type="button"
        onClick={openCreate}
        className="group flex w-full items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] px-4 py-3.5 text-left transition hover:border-indigo-500/30 hover:bg-indigo-500/[0.06] md:px-5 md:py-4"
      >
        <span className="flex-1 text-sm text-white/30">
          What&apos;s your signal today?
        </span>
        <span className="shrink-0 rounded-full border border-indigo-500/25 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300/80">
          Post ✦
        </span>
      </button>

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.02] px-6 py-14 text-center">
          <p className="text-sm text-white/40">
            No posts in the last 7 days. Be the first to share something nearby.
          </p>
        </div>
      ) : (
        <div className="space-y-4 pb-4">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} onPatch={patchPost} />
          ))}
        </div>
      )}

    </div>
  );
}
