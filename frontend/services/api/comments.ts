import type { CommentItem } from "@/types/dashboard";
import { apiFetchAuth } from "@/app/lib/api";

type CommentsRes = { success: boolean; data: CommentItem[] };

export async function getCommentsByPost(postId: string) {
  return apiFetchAuth<CommentsRes>(`/comments/post/${postId}`);
}

export async function createComment(payload: {
  content: string;
  postId: string;
  parentId?: string;
}) {
  return apiFetchAuth<CommentItem>("/comments", {
    method: "POST",
    body: payload,
  });
}
