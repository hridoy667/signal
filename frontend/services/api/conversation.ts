import type { ChatMessage, RoomListItem } from "@/types/dashboard";
import { apiFetchAuth } from "./client-auth";

type RoomsRes = { success: boolean; data: RoomListItem[] };

export async function getRooms() {
  return apiFetchAuth<RoomsRes>("/conversation/rooms");
}

export async function getRoomMessages(roomId: string) {
  return apiFetchAuth<{
    success: boolean;
    data: ChatMessage[];
    nextCursor: string | null;
  }>(`/conversation/rooms/${roomId}/messages`);
}

export async function getOrCreateRoom(otherUserId: string) {
  return apiFetchAuth<{ success: boolean; data: { id: string } }>(
    `/conversation/rooms/${otherUserId}`,
    { method: "POST" },
  );
}

export async function getRoom(roomId: string) {
  return apiFetchAuth<{
    success: boolean;
    data: {
      id: string;
      members: RoomListItem["members"];
    };
  }>(`/conversation/rooms/${roomId}`);
}
