export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("57") && digits.length >= 12) return digits;
  if (digits.length === 10) return `57${digits}`;
  return digits;
}

export function buildWhatsAppLink(phone: string, message: string): string {
  const number = normalizePhone(phone);
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
