/** "2026-10-03T20:45:45Z" -> "5 minutes ago" */
export function timeAgo(iso: string): string {
  const seconds = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  for (const [size, label] of [[86400, "day"], [3600, "hour"], [60, "minute"]] as const) {
    if (seconds >= size) {
      const n = Math.floor(seconds / size);
      return `${n} ${label}${n === 1 ? "" : "s"} ago`;
    }
  }
  return "Just now";
}
