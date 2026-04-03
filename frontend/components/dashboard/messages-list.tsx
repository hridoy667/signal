"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getRooms } from "@/services/api/conversation";
import { ApiRequestError } from "@/app/lib/api";
import type { RoomListItem } from "@/types/dashboard";
import { resolveMediaUrl } from "@/lib/media-url";
import { ROUTES } from "@/lib/constants";

function peerName(room: RoomListItem) {
  const m = room.members[0];
  if (!m) return "Chat";
  const full = [m.first_name, m.last_name].filter(Boolean).join(" ");
  return full || "Someone";
}

function preview(room: RoomListItem) {
  const last = room.messages[0];
  if (!last) return "No messages yet";
  return last.content.slice(0, 80) + (last.content.length > 80 ? "…" : "");
}

export function MessagesList() {
  const [rooms, setRooms] = useState<RoomListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setError(null);
      try {
        const res = await getRooms();
        if (!cancelled) setRooms(res.data ?? []);
      } catch (e) {
        if (!cancelled) {
          const msg =
            e instanceof ApiRequestError ? e.message : "Could not load chats.";
          setError(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <p className="py-12 text-center text-sm text-white/35">Loading chats…</p>
    );
  }

  if (error) {
    return (
      <p className="rounded-xl border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
        {error}
      </p>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.02] px-6 py-12 text-center">
        <p className="text-sm text-white/40">
          No conversations yet. Rooms appear when you start a direct message with
          another user.
        </p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-white/[0.06] overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025]">
      {rooms.map((room) => {
        const m = room.members[0];
        const avatar = m?.avatarUrl;
        return (
          <li key={room.id}>
            <Link
              href={`${ROUTES.dashboardMessages}/${room.id}`}
              className="flex gap-3 p-4 transition-colors hover:bg-white/[0.04]"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-indigo-500 to-violet-700 text-sm font-semibold text-white">
                {avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={resolveMediaUrl(avatar) ?? ""}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  peerName(room).slice(0, 2)
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-medium text-white">
                    {peerName(room)}
                  </span>
                </div>
                <p className="truncate text-sm text-white/40">{preview(room)}</p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
