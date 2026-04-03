export function AuthCardGlow({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute -inset-3 rounded-[2.25rem] bg-gradient-to-br from-teal-500/25 via-fuchsia-500/15 to-violet-500/25 opacity-70 blur-2xl dark:opacity-50"
        aria-hidden
      />
      <div className="relative">{children}</div>
    </div>
  );
}
