"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Socket } from "socket.io-client";
import { getRoomMessages, getRoom } from "@/services/conversation.service";
import { ApiRequestError } from "@/lib/api";
import type { ChatMessage } from "@/types/dashboard";
import { getAccessToken } from "@/lib/auth-storage";
import { createChatSocket } from "@/lib/chat-socket";
import { resolveMediaUrl } from "@/lib/media-url";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDashboard } from "@/features/dashboard/components/dashboard-context";
import { cn } from "@/lib/utils";

type Props = {
  roomId: string;
};

export function ChatRoomClient({ roomId }: Props) {
  const { refreshUnreadMessages } = useDashboard();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [peerId, setPeerId] = useState<string | null>(null);
  const [peerLabel, setPeerLabel] = useState("Chat");
  const bottomRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  const myId = useMemo(() => {
    try {
      const t = getAccessToken();
      if (!t) return null;
      const mid = JSON.parse(atob(t.split(".")[1] ?? "")) as { sub?: string };
      return mid.sub ?? null;
    } catch {
      return null;
    }
  }, []);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setError(null);
      setLoading(true);
      try {
        const [roomRes, msgRes] = await Promise.all([
          getRoom(roomId),
          getRoomMessages(roomId),
        ]);
        if (cancelled) return;
        const other = roomRes.data.members[0];
        if (other) {
          setPeerId(other.id);
          setPeerLabel(
            [other.first_name, other.last_name].filter(Boolean).join(" ") ||
              "Someone",
          );
        }
        setMessages(msgRes.data ?? []);
      } catch (e) {
        if (!cancelled) {
          const msg =
            e instanceof ApiRequestError ? e.message : "Could not load chat.";
          setError(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    return () => {
      refreshUnreadMessages();
    };
  }, [roomId, refreshUnreadMessages]);

  useEffect(() => {
    let socket: Socket;
    try {
      socket = createChatSocket();
    } catch {
      return;
    }
    socketRef.current = socket;

    function onConnect() {
      socket.emit("join_room", { roomId });
      socket.emit("mark_read", { roomId });
      refreshUnreadMessages();
    }

    function onNewMessage(
      msg: ChatMessage & { id: string; roomId?: string },
    ) {
      if (msg.roomId && msg.roomId !== roomId) return;
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg as ChatMessage];
      });
      socket.emit("mark_read", { roomId });
      refreshUnreadMessages();
    }

    socket.on("connect", onConnect);
    socket.on("new_message", onNewMessage);

    if (socket.connected) onConnect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("new_message", onNewMessage);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [roomId, refreshUnreadMessages]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const content = text.trim();
    if (!content || sending) return;
    const sock = socketRef.current;
    if (!sock?.connected) {
      setError("Not connected. Check your network.");
      return;
    }
    setSending(true);
    setError(null);
    setText("");
    sock.emit("send_message", {
      roomId,
      content,
      receiverId: peerId ?? undefined,
    });
    setSending(false);
    scrollToBottom();
  }

  if (loading && messages.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-white/35">Loading messages…</p>
    );
  }

  if (error && messages.length === 0) {
    return (
      <p className="rounded-xl border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
        {error}
      </p>
    );
  }

  return (
    <div className="flex min-h-[60vh] flex-col">
      <div className="mb-3 -mt-1">
        <h2
          className="font-serif text-xl font-semibold text-white"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          {peerLabel}
        </h2>
        <p className="text-xs text-white/35">Direct message</p>
      </div>

      <div className="flex flex-1 flex-col gap-2 overflow-y-auto pb-4">
        {messages.map((m) => {
          const mine = myId && m.senderId === myId;
          return (
            <div
              key={m.id}
              className={cn("flex gap-2", mine ? "justify-end" : "justify-start")}
            >
              {!mine ? (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/10 text-white/80">
                  {m.sender.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={resolveMediaUrl(m.sender.avatarUrl) ?? ""}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    (m.sender.first_name?.[0] ?? "?").toUpperCase()
                  )}
                </div>
              ) : null}
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-sm",
                  mine
                    ? "rounded-br-md bg-gradient-to-br from-indigo-500 to-indigo-600 text-white"
                    : "rounded-bl-md border border-white/[0.06] bg-white/[0.06] text-white/90",
                )}
              >
                {m.content}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {error ? (
        <p className="mb-2 text-xs text-rose-400/90">{error}</p>
      ) : null}

      <form
        onSubmit={send}
        className="sticky bottom-0 mt-auto flex gap-2 border-t border-white/[0.06] bg-[#080a0f] pb-[env(safe-area-inset-bottom)] pt-3"
      >
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message…"
          className="flex-1 border-white/10 bg-white/[0.06] text-white placeholder:text-white/25"
        />
        <Button type="submit" disabled={sending}>
          Send
        </Button>
      </form>
    </div>
  );
}
