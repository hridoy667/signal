const TOKEN_KEY = "signal_access_token";

/** Client-only — call from event handlers or useEffect. */
export function setAccessToken(token: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function clearAccessToken(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
}
