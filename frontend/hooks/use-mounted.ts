"use client";

import { useEffect, useState } from "react";

/** Avoid hydration mismatches for client-only UI (e.g. theme toggle label). */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}
