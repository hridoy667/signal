"use client";

import { io, type Socket } from "socket.io-client";
import { getAccessToken } from "@/lib/auth-storage";
import { getApiBaseUrl } from "@/app/lib/api";

export function getSocketBaseUrl(): string {
  return getApiBaseUrl().replace(/\/api$/, "") || "http://localhost:8000";
}

export function createChatSocket(): Socket {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Not authenticated");
  }
  return io(`${getSocketBaseUrl()}/chat`, {
    auth: { token },
    transports: ["websocket", "polling"],
    autoConnect: true,
  });
}
