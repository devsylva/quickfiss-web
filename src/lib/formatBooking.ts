/** "2026-08-30" + "13:00:00" -> "Aug 30, 2026 | 01:00 PM" */
export function formatBookingWhen(date: string, time: string) {
  const when = new Date(`${date}T${time}`);
  if (Number.isNaN(when.getTime())) return `${date} ${time}`;
  const day = when.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const hour = when.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  return `${day} | ${hour}`;
}
