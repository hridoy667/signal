export function cn(
  ...inputs: (string | undefined | null | false | Record<string, boolean>)[]
): string {
  const parts: string[] = [];
  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === "string") {
      parts.push(input);
      continue;
    }
    for (const [key, val] of Object.entries(input)) {
      if (val) parts.push(key);
    }
  }
  return parts.join(" ");
}
