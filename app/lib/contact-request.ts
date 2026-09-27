import { isBookableSlot, isGuestCountValid } from "./booking-rules";
import { toE164 } from "./phone";
import { collapseWhatsAppText, submittedAtBelgrade, templateName } from "./whatsapp-text";

const MESSAGE_MAX = 500;

export type InquiryPayload = {
  type: "inquiry";
  locale: "sr" | "en";
  submittedAt: string;
  name: string;
  phone: string;
  message: string;
};

export type ReservationPayload = {
  type: "reservation";
  locale: "sr" | "en";
  submittedAt: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  celebration: string;
};

export type ContactPayload = InquiryPayload | ReservationPayload;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function calendarDate(isoDate: string) {
  const match = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

export function parseContactRequest(body: unknown, now = new Date()): ContactPayload | null {
  if (!isRecord(body)) return null;
  if (body.locale !== "sr" && body.locale !== "en") return null;
  if (typeof body.name !== "string" || typeof body.phone !== "string") return null;

  const name = templateName(body.name);
  if (!name) return null;

  const phone = toE164(body.phone);
  if (!phone) return null;

  const submittedAt = submittedAtBelgrade(now);

  if (body.type === "inquiry") {
    if (typeof body.message !== "string") return null;
    const message = collapseWhatsAppText(body.message);
    if (!message || message.length > MESSAGE_MAX) return null;
    return {
      type: "inquiry",
      locale: body.locale,
      submittedAt,
      name,
      phone,
      message,
    };
  }

  if (body.type !== "reservation") return null;
  if (typeof body.date !== "string" || typeof body.time !== "string") return null;
  if (typeof body.celebration !== "string" || typeof body.guests !== "number") return null;

  const date = calendarDate(body.date);
  const hour = Number(body.time.slice(0, 2));
  if (!date || !/^\d{2}:00$/.test(body.time) || !isBookableSlot(date, hour, now)) {
    return null;
  }
  if (!isGuestCountValid(body.guests)) return null;

  const celebration = collapseWhatsAppText(body.celebration);
  if (!celebration || celebration.length > MESSAGE_MAX) return null;

  return {
    type: "reservation",
    locale: body.locale,
    submittedAt,
    name,
    phone,
    date: body.date,
    time: body.time,
    guests: body.guests,
    celebration,
  };
}
