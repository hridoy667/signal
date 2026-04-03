import type { FeedPost } from "@/types/dashboard";
import { apiFetchAuth } from "@/app/lib/api";

type FeedResponse = {
  success: boolean;
  message?: string;
  data: FeedPost[];
};

export async function getFeed(lat?: number, lng?: number) {
  const q = new URLSearchParams();
  if (lat != null) q.set("lat", String(lat));
  if (lng != null) q.set("lng", String(lng));
  const qs = q.toString();
  return apiFetchAuth<FeedResponse>(`/posts/feed${qs ? `?${qs}` : ""}`);
}

export async function createPost(params: { content?: string; image?: File | null }) {
  const form = new FormData();
  if (params.content?.trim()) form.append("content", params.content.trim());
  if (params.image) form.append("image", params.image);
  return apiFetchAuth<{
    success: boolean;
    data: { id: string };
  }>("/posts/create", {
    method: "POST",
    body: form,
  });
}
