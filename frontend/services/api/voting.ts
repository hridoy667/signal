import type { VoteType } from "@/types/dashboard";
import { apiFetchAuth } from "./client-auth";

export async function votePost(postId: string, vote: VoteType) {
  return apiFetchAuth<{ success: boolean }>("/voting", {
    method: "POST",
    body: { postId, vote },
  });
}
