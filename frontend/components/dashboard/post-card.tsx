"use client";

import { useEffect, useRef, useState } from "react";
import { createComment, getCommentsByPost } from "@/services/api/comments";
import { votePost } from "@/services/api/voting";
import { ApiRequestError } from "@/app/lib/api";
import { resolveMediaUrl } from "@/lib/media-url";
import type { CommentItem, FeedPost, VoteType } from "@/types/dashboard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDashboard } from "@/components/dashboard/dashboard-context";
import { dashboardProfilePath } from "@/lib/constants";
import type { MeUser } from "@/types/dashboard";
import { cn } from "@/lib/cn";

function n(v: unknown): number {
  if (typeof v === "bigint") return Number(v);
  if (typeof v === "number" && !Number.isNaN(v)) return v;
  if (typeof v === "string") {
    const x = parseFloat(v);
    return Number.isNaN(x) ? 0 : x;
  }
  return 0;
}

function imageList(raw: unknown): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter((x): x is string => typeof x === "string");
  return [];
}

function optimisticVotePatch(post: FeedPost, next: VoteType): Partial<FeedPost> {
  const prev = post.userVote as VoteType | null;
  let up = n(post.upvoats);
  let down = n(post.downvoats);
  let neu = n(post.neutralvoats);
  if (prev === "UPVOTE") up -= 1;
  if (prev === "DOWNVOTE") down -= 1;
  if (prev === "NEUTRAL") neu -= 1;
  if (next === "UPVOTE") up += 1;
  if (next === "DOWNVOTE") down += 1;
  if (next === "NEUTRAL") neu += 1;
  return {
    upvoats: up,
    downvoats: down,
    neutralvoats: neu,
    userVote: next,
  };
}

function authorName(post: FeedPost) {
  const a = post.first_name?.trim() ?? "";
  const b = post.last_name?.trim() ?? "";
  const full = [a, b].filter(Boolean).join(" ");
  return full || "Someone";
}

function meDisplayName(u: MeUser | null) {
  if (!u) return "You";
  const a = u.first_name?.trim() ?? "";
  const b = u.last_name?.trim() ?? "";
  const full = [a, b].filter(Boolean).join(" ");
  return full || u.userName?.trim() || u.email || "You";
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

type Props = {
  post: FeedPost;
  onPatch: (id: string, patch: Partial<FeedPost>) => void;
};

export function PostCard({ post, onPatch }: Props) {
  const { user: me } = useDashboard();
  const votingRef = useRef(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState<CommentItem[] | null>(null);
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentErr, setCommentErr] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const up = n(post.upvoats);
  const down = n(post.downvoats);
  const neu = n(post.neutralvoats);
  const commentsCount = n(post.comment_count);
  const cur = post.userVote as VoteType | null;

  useEffect(() => {
    if (!commentsOpen || comments !== null) return;
    setCommentLoading(true);
    getCommentsByPost(post.id)
      .then((res) => setComments(res.data ?? []))
      .catch(() => setComments([]))
      .finally(() => setCommentLoading(false));
  }, [commentsOpen, comments, post.id]);

  async function applyVote(v: VoteType) {
    if (votingRef.current) return;
    votingRef.current = true;
    setCommentErr(null);
    const snap: Partial<FeedPost> = {
      upvoats: post.upvoats,
      downvoats: post.downvoats,
      neutralvoats: post.neutralvoats,
      userVote: post.userVote,
    };
    onPatch(post.id, optimisticVotePatch(post, v));
    try {
      await votePost(post.id, v);
    } catch (e) {
      onPatch(post.id, snap);
      const msg =
        e instanceof ApiRequestError ? e.message : "Could not update vote.";
      setCommentErr(msg);
    } finally {
      votingRef.current = false;
    }
  }

  async function sendComment(e: React.FormEvent) {
    e.preventDefault();
    const t = commentText.trim();
    if (!t || sending) return;
    setSending(true);
    setCommentErr(null);
    try {
      const created = await createComment({ content: t, postId: post.id });
      setComments((prev) => [...(prev ?? []), created]);
      setCommentText("");
      onPatch(post.id, { comment_count: commentsCount + 1 });
    } catch (e) {
      const msg =
        e instanceof ApiRequestError ? e.message : "Could not post comment.";
      setCommentErr(msg);
    } finally {
      setSending(false);
    }
  }

  const imgs = imageList(post.imageUrl as unknown);

  return (
    <article className="rounded-2xl border border-white/[0.07] bg-white/[0.025] shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-sm">
      <div className="flex gap-3 p-4">
        <Link
          href={dashboardProfilePath(post.authorId)}
          className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-zinc-600 to-zinc-800 text-xs font-semibold text-white ring-0 transition hover:ring-2 hover:ring-indigo-500/35"
          aria-label={`${authorName(post)} profile`}
        >
          {post.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={resolveMediaUrl(post.avatarUrl) ?? ""}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            authorName(post).slice(0, 2)
          )}
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <Link
              href={dashboardProfilePath(post.authorId)}
              className="font-medium text-white transition hover:text-indigo-300"
            >
              {authorName(post)}
            </Link>
            <span className="text-xs text-white/35">{timeAgo(post.createdAt)}</span>
          </div>
          {post.content ? (
            <p className="mt-1.5 whitespace-pre-wrap text-[0.9375rem] leading-relaxed text-white/85">
              {post.content}
            </p>
          ) : null}
        </div>
      </div>

      {imgs.length > 0 ? (
        <div className="space-y-3 px-4 pb-3">
          {imgs.map((src) => {
            const url = resolveMediaUrl(src);
            if (!url) return null;
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={url}
                alt=""
                className="max-h-80 w-full rounded-xl border border-white/[0.06] object-cover"
              />
            );
          })}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-2 border-t border-white/[0.06] px-3 py-2.5">
        <div className="flex items-center gap-1 rounded-xl bg-white/[0.04] p-1">
          <VoteIconBtn
            title="Upvote"
            active={cur === "UPVOTE"}
            onClick={() => applyVote("UPVOTE")}
            variant="up"
          />
          <span className="min-w-[2.25rem] px-1.5 text-center text-sm font-medium tabular-nums text-white/60">
            {Math.round(up)}
          </span>
          <VoteIconBtn
            title="Downvote"
            active={cur === "DOWNVOTE"}
            onClick={() => applyVote("DOWNVOTE")}
            variant="down"
          />
          <span className="min-w-[2.25rem] px-1.5 text-center text-sm font-medium tabular-nums text-white/60">
            {Math.round(down)}
          </span>
          <VoteIconBtn
            title="Neutral"
            active={cur === "NEUTRAL"}
            onClick={() => applyVote("NEUTRAL")}
            variant="neutral"
          />
          <span className="min-w-[2.25rem] px-1.5 text-center text-sm font-medium tabular-nums text-white/45">
            {Math.round(neu)}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setCommentsOpen((o) => !o)}
          className="ml-auto flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-indigo-300/90 transition hover:bg-indigo-500/10"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M4 5h16v12H9l-4 3v-3H4V5z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
          {commentsOpen ? "Hide" : "Comments"} · {commentsCount}
        </button>
      </div>

      {commentErr ? (
        <p className="border-t border-white/[0.06] px-4 py-2 text-xs text-rose-400/90">
          {commentErr}
        </p>
      ) : null}

      {commentsOpen ? (
        <div className="border-t border-white/[0.06] px-4 py-3">
          {commentLoading ? (
            <p className="text-sm text-white/35">Loading comments…</p>
          ) : (
            <ul className="space-y-3">
              {(comments ?? []).map((c) => (
                <li key={c.id} className="text-sm text-white/75">
                  <span className="mr-1.5 inline-flex max-w-full items-center rounded-full border border-white/[0.08] bg-white/[0.06] px-2.5 py-0.5 text-xs font-medium text-white/90">
                    {[c.author.first_name, c.author.last_name].filter(Boolean).join(" ") ||
                      "User"}
                  </span>
                  {c.content}
                </li>
              ))}
              {(comments ?? []).length === 0 && !commentLoading ? (
                <li className="text-sm text-white/35">No comments yet.</li>
              ) : null}
            </ul>
          )}
          <div className="mt-3 space-y-2">
            <span className="inline-flex max-w-full items-center rounded-full border border-white/[0.1] bg-white/[0.07] px-3 py-1 text-xs font-medium text-white/85">
              {meDisplayName(me)}
            </span>
            <form onSubmit={sendComment} className="flex gap-2">
              <Input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment…"
                className="flex-1 border-white/10 bg-white/[0.05] text-sm text-white placeholder:text-white/25"
              />
              <Button type="submit" size="sm" disabled={sending}>
                Send
              </Button>
            </form>
          </div>
        </div>
      ) : null}
    </article>
  );
}

function VoteIconBtn({
  title,
  active,
  onClick,
  variant,
}: {
  title: string;
  active: boolean;
  onClick: () => void;
  variant: "up" | "down" | "neutral";
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-xl transition",
        active && variant === "up" && "bg-emerald-500/25 text-emerald-300",
        active && variant === "down" && "bg-rose-500/25 text-rose-300",
        active && variant === "neutral" && "bg-white/15 text-white/80",
        !active && "text-white/35 hover:bg-white/[0.06] hover:text-white/60",
      )}
    >
      {variant === "up" ? <IconUp /> : variant === "down" ? <IconDown /> : <IconNeutral />}
    </button>
  );
}

function IconUp() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 6l6 6H6l6-6z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconDown() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 18l-6-6h12l-6 6z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconNeutral() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.6" fill="none" />
      <path d="M9 12h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
