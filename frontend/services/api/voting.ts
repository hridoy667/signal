import type { VoteType } from "@/types/dashboard";
import { apiFetchAuth } from "@/app/lib/api";

export async function votePost(postId: string, vote: VoteType) {
  return apiFetchAuth<{ success: boolean }>("/voting", {
    method: "POST",
    body: { postId, vote },
  });
}
