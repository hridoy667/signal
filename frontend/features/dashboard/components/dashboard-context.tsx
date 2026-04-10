"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Socket } from "socket.io-client";
import { getMe } from "@/services/auth.service";
import { getConversationUnreadCount } from "@/services/conversation.service";
import { createChatSocket } from "@/lib/chat-socket";
import type { MeUser } from "@/types/dashboard";

type DashboardContextValue = {
  user: MeUser | null;
  userLoading: boolean;
  createOpen: boolean;
  openCreate: () => void;
  closeCreate: () => void;
  bumpFeed: () => void;
  feedKey: number;
  unreadMessagesCount: number;
  refreshUnreadMessages: () => void;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MeUser | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [feedKey, setFeedKey] = useState(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  const refreshUnreadMessages = useCallback(() => {
    getConversationUnreadCount()
      .then((res) => setUnreadMessagesCount(res.data?.count ?? 0))
      .catch(() => setUnreadMessagesCount(0));
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getMe();
        if (!cancelled && res.data) setUser(res.data);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setUserLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (userLoading || !user) return;
    refreshUnreadMessages();
    const t = window.setInterval(refreshUnreadMessages, 45_000);
    const onVis = () => {
      if (document.visibilityState === "visible") refreshUnreadMessages();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearInterval(t);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [userLoading, user, refreshUnreadMessages]);

  /** Live unread badge + list previews while not inside a chat tab. */
  useEffect(() => {
    if (userLoading || !user) return;
    let socket: Socket | null = null;
    try {
      socket = createChatSocket();
    } catch {
      return;
    }

    const onNewMessage = () => refreshUnreadMessages();
    const onNotification = (payload: { type?: string }) => {
      if (payload?.type === "new_message") onNewMessage();
    };
    const onMessagesRead = () => refreshUnreadMessages();

    socket.on("new_message", onNewMessage);
    socket.on("notification", onNotification);
    socket.on("messages_read", onMessagesRead);

    return () => {
      socket?.off("new_message", onNewMessage);
      socket?.off("notification", onNotification);
      socket?.off("messages_read", onMessagesRead);
      socket?.disconnect();
    };
  }, [userLoading, user, refreshUnreadMessages]);

  const openCreate = useCallback(() => setCreateOpen(true), []);
  const closeCreate = useCallback(() => setCreateOpen(false), []);
  const bumpFeed = useCallback(() => setFeedKey((k) => k + 1), []);

  const value = useMemo(
    () => ({
      user,
      userLoading,
      createOpen,
      openCreate,
      closeCreate,
      bumpFeed,
      feedKey,
      unreadMessagesCount,
      refreshUnreadMessages,
    }),
    [
      user,
      userLoading,
      createOpen,
      openCreate,
      closeCreate,
      bumpFeed,
      feedKey,
      unreadMessagesCount,
      refreshUnreadMessages,
    ],
  );

  return (
    <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }
  return ctx;
}
