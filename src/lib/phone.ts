/** Keeps digits and a leading +, so "(555) 123-4567" becomes "5551234567". */
export function cleanPhone(raw: string) {
  const trimmed = raw.trim();
  const digits = trimmed.replace(/[^\d]/g, "");
  return trimmed.startsWith("+") ? `+${digits}` : digits;
}

export function isUsablePhone(raw: string) {
  const d = cleanPhone(raw).replace("+", "");
  return d.length >= 3 && d.length <= 15;
}

/** Opens the phone's dialer; the person still has to press call. */
export const telHref = (raw: string) => `tel:${cleanPhone(raw)}`;

/** Opens the messaging app with the number filled in; nothing is sent automatically. */
export const smsHref = (raw: string) => `sms:${cleanPhone(raw)}`;
