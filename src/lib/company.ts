// Single source of truth for public company details (from the client's Oct 2026 responses).
export const COMPANY = {
  name: "Quickfiss",
  tagline: "neighbourhood professionals",
  supportEmail: "support@quickfiss.com",
  privacyEmail: "support@quickfiss.com",
  privacySubject: "Privacy / Data Request",
  // Supplied as written (10 digits) - client still has to confirm the full number
  // and WhatsApp registration, so it is shown as text and never linked.
  phone: "0816049262",
  address: "163 Oboro Road, Rumudara, Port Harcourt, Rivers State, Nigeria",
  instagramHandle: "@quickfiss",
  effectiveDate: "6 November 2026",
} as const;
