// Booking link helper. Set BOOKING_URL (Calendly, Cal.com, etc.) as an
// SST secret in production and the site exposes a /book route with the
// embedded calendar, plus a "Schedule a call" CTA on contact success.
//
// When unset, callers fall back to /contact (the form route) so visitors
// never hit a dead end.
//
//   sst secret set BOOKING_URL "https://cal.com/publicpulse/intro" --stage production

export const DEFAULT_BOOKING_URL = "https://cal.com/publicpulse/15min";

/** Embed URL with Cal.com's dark theme so the calendar matches the site. */
export function bookingEmbedUrl(): string | null {
  const u = bookingUrl();
  if (!u) return null;
  return u + (u.includes("?") ? "&" : "?") + "theme=dark";
}

export function bookingUrl(): string | null {
  // NEXT_PUBLIC_ prefix on the env var lets the booking link render on the
  // client (e.g. inside ContactForm success state) without an extra round-trip.
  const fromPublic = process.env.NEXT_PUBLIC_BOOKING_URL;
  if (fromPublic && fromPublic.startsWith("https://")) return fromPublic;
  const fromServer = process.env.BOOKING_URL;
  if (fromServer && fromServer.startsWith("https://")) return fromServer;
  // Default: the live Cal.com 15-minute event for Public Pulse.
  return DEFAULT_BOOKING_URL;
}

export function hasBooking(): boolean {
  return bookingUrl() !== null;
}
