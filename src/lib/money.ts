/** 12500 | "12500.00" -> "₦12,500" (kobo shown only when there are any) */
export function formatNaira(value: number | string | null | undefined): string {
  const amount = Number(value);
  if (value === null || value === undefined || value === "" || Number.isNaN(amount)) return "₦0";
  const hasKobo = Math.round(amount * 100) % 100 !== 0;
  return `₦${amount.toLocaleString("en-NG", {
    minimumFractionDigits: hasKobo ? 2 : 0,
    maximumFractionDigits: 2,
  })}`;
}
