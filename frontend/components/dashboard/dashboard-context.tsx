"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getMe } from "@/services/api/auth";
import type { MeUser } from "@/types/dashboard";

type DashboardContextValue = {
  user: MeUser | null;
  userLoading: boolean;
  createOpen: boolean;
  openCreate: () => void;
  closeCreate: () => void;
  bumpFeed: () => void;
  feedKey: number;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MeUser | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [feedKey, setFeedKey] = useState(0);

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
    }),
    [user, userLoading, createOpen, openCreate, closeCreate, bumpFeed, feedKey],
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
