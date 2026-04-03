"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMyUserProfile, getUserProfileById } from "@/services/api/users";
import { getOrCreateRoom } from "@/services/api/conversation";
import { ApiRequestError } from "@/services/api/client";
import { resolveMediaUrl } from "@/lib/media-url";
import { ROUTES } from "@/lib/constants";
import type { ProfilePost, UserProfile } from "@/types/dashboard";
import { useDashboard } from "@/components/dashboard/dashboard-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

function displayName(p: UserProfile) {
  const a = p.first_name?.trim() ?? "";
  const b = p.last_name?.trim() ?? "";
  const full = [a, b].filter(Boolean).join(" ");
  return full || p.userName?.trim() || p.email || "Profile";
}

function timeAgo(iso: string) {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "";
  const s = Math.floor((Date.now() - t) / 1000);
  if (s < 60) return "now";
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}

function imageList(raw: unknown): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter((x): x is string => typeof x === "string");
  return [];
}

function n(v: unknown): number {
  if (typeof v === "number" && !Number.isNaN(v)) return v;
  if (typeof v === "string") {
    const x = parseFloat(v);
    return Number.isNaN(x) ? 0 : x;
  }
  return 0;
}

function ProfilePostCard({ post }: { post: ProfilePost }) {
  const imgs = imageList(post.imageUrl as unknown);
  const comments =
    post._count?.comments ?? n(post.comment_count);

  return (
    <article className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
      <div className="flex items-baseline justify-between gap-2 text-xs text-white/35">
        <span>{timeAgo(post.createdAt)}</span>
        {post.title ? <span className="text-white/50">{post.title}</span> : null}
      </div>
      {post.content ? (
        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-white/85">
          {post.content}
        </p>
      ) : null}
      {imgs.length > 0 ? (
        <div className="mt-3 space-y-2">
          {imgs.map((src) => {
            const url = resolveMediaUrl(src);
            if (!url) return null;
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={url}
                alt=""
                className="max-h-64 w-full rounded-xl border border-white/[0.06] object-cover"
              />
            );
          })}
        </div>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-3 border-t border-white/[0.06] pt-3 text-xs text-white/45">
        <span>
          <span className="text-emerald-400/90">▲</span> {Math.round(n(post.upvoats))}
        </span>
        <span>
          <span className="text-rose-400/90">▼</span> {Math.round(n(post.downvoats))}
        </span>
        <span>○ {Math.round(n(post.neutralvoats))}</span>
        <span className="text-white/35">Comments · {comments}</span>
      </div>
    </article>
  );
}

type Props = {
  /** When omitted, loads the signed-in user via `/users/user-profile`. */
  userId?: string;
};

export function ProfileClient({ userId }: Props) {
  const router = useRouter();
  const { user: me } = useDashboard();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messaging, setMessaging] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    const req = userId
      ? getUserProfileById(userId)
      : getMyUserProfile();
    req
      .then((res) => {
        setProfile(res.data);
        setError(null);
      })
      .catch((e) => {
        setError(e instanceof ApiRequestError ? e.message : "Could not load profile.");
      })
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  async function openMessage() {
    if (!profile || !me || profile.id === me.id || messaging) return;
    setMessaging(true);
    setError(null);
    try {
      const res = await getOrCreateRoom(profile.id);
      const roomId = res.data?.id;
      if (!roomId) throw new Error("No room id");
      router.push(`${ROUTES.dashboardMessages}/${roomId}`);
    } catch (e) {
      setError(e instanceof ApiRequestError ? e.message : "Could not start chat.");
    } finally {
      setMessaging(false);
    }
  }

  if (loading && !profile) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-sm text-white/35">Loading profile…</p>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 px-4 py-6 text-center">
        <p className="text-sm text-rose-300/90">{error}</p>
        <Button type="button" size="sm" className="mt-4" onClick={load}>
          Retry
        </Button>
      </div>
    );
  }

  if (!profile) return null;

  const name = displayName(profile);
  const isOwn = userId
    ? Boolean(me?.id && profile.id === me.id)
    : true;
  const showMessage = Boolean(
    userId && me?.id && profile.id !== me.id,
  );

  return (
    <div className="space-y-6 pb-10">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1
            className="font-serif text-[1.35rem] font-extrabold tracking-tight text-white md:text-[1.5rem]"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            {isOwn ? "Your profile" : name}
          </h1>
          <p className="mt-1 text-[13px] text-white/30">
            {isOwn ? "Synced from your account" : "User profile"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {showMessage ? (
            <Button type="button" size="sm" disabled={messaging} onClick={() => void openMessage()}>
              {messaging ? "Opening…" : "Message"}
            </Button>
          ) : null}
          <Button type="button" size="sm" variant="secondary" disabled={loading} onClick={load}>
            {loading ? "Refreshing…" : "Refresh"}
          </Button>
        </div>
      </header>

      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div
            className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 text-lg font-semibold text-white ring-2 ring-white/10"
            aria-hidden
          >
            {profile.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={resolveMediaUrl(profile.avatarUrl) ?? ""}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              name.slice(0, 2).toUpperCase()
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold text-white">{name}</h2>
              {profile.isVerified ? (
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-medium text-emerald-300/90">
                  Verified
                </span>
              ) : null}
            </div>
            {profile.userName ? (
              <p className="mt-0.5 text-sm text-indigo-300/80">@{profile.userName}</p>
            ) : null}
            {profile.email ? (
              <p className="mt-1 text-sm text-white/40">{profile.email}</p>
            ) : null}
            <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              {profile.district ? (
                <div>
                  <dt className="text-white/30">District</dt>
                  <dd className="text-white/75">{profile.district}</dd>
                </div>
              ) : null}
              {profile.upazila ? (
                <div>
                  <dt className="text-white/30">Upazila</dt>
                  <dd className="text-white/75">{profile.upazila}</dd>
                </div>
              ) : null}
              {profile.gender ? (
                <div>
                  <dt className="text-white/30">Gender</dt>
                  <dd className="capitalize text-white/75">{profile.gender}</dd>
                </div>
              ) : null}
              {profile.dateOfBirth ? (
                <div>
                  <dt className="text-white/30">Birth date</dt>
                  <dd className="text-white/75">
                    {new Date(profile.dateOfBirth).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </dd>
                </div>
              ) : null}
            </dl>
            {profile.bio ? (
              <p className="mt-4 whitespace-pre-wrap border-t border-white/[0.06] pt-4 text-sm leading-relaxed text-white/70">
                {profile.bio}
              </p>
            ) : (
              <p className="mt-4 text-sm text-white/25">No bio yet.</p>
            )}
            <p className="mt-3 text-xs text-white/25">
              Member since {new Date(profile.createdAt).toLocaleDateString()}
              {" · "}
              {profile.posts.length} post{profile.posts.length === 1 ? "" : "s"} loaded
            </p>
          </div>
        </div>
      </div>

      <section>
        <h3 className="mb-3 font-[family-name:var(--font-syne)] text-sm font-semibold tracking-tight text-white/80">
          {isOwn ? "Your posts" : "Posts"}
        </h3>
        {profile.posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.02] px-6 py-12 text-center">
            <p className="text-sm text-white/40">No posts yet.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {profile.posts.map((post) => (
              <li key={post.id}>
                <ProfilePostCard post={post} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {error ? (
        <p className={cn("text-center text-xs text-rose-400/90")}>{error}</p>
      ) : null}
    </div>
  );
}
