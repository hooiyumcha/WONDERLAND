import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizePhone(phone: string): string {
  // Remove all non-digit characters except leading +
  return phone.replace(/[^\d+]/g, "");
}

export function formatPhone(phone: string): string {
  const cleaned = normalizePhone(phone);
  // Format as (XXX) XXX-XXXX for US numbers
  if (cleaned.startsWith("+1") && cleaned.length === 12) {
    return `(${cleaned.slice(2, 5)}) ${cleaned.slice(5, 8)}-${cleaned.slice(8)}`;
  }
  return cleaned;
}
