import type { UserProfile } from "@/types/dashboard";
import { apiFetchAuth } from "@/lib/api";

export async function getMyUserProfile() {
  return apiFetchAuth<{ success: boolean; data: UserProfile }>("/users/user-profile");
}

export async function getUserProfileById(userId: string) {
  return apiFetchAuth<{ success: boolean; data: UserProfile }>(
    `/users/profile/${encodeURIComponent(userId)}`,
  );
}
