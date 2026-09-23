export const BOOKING_TIMEZONE = "Europe/Belgrade";
export const BOOKING_SLOT_HOURS = Array.from({ length: 14 }, (_, index) => 8 + index);
export const MIN_GUESTS = 1;
export const MAX_GUESTS = 50;
export const MIN_LEAD_MS = 24 * 60 * 60 * 1000;

type ZonedParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
};

function getZonedParts(date: Date, timeZone = BOOKING_TIMEZONE): ZonedParts {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = Object.fromEntries(
    formatter
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour === "24" ? "0" : parts.hour),
    minute: Number(parts.minute),
  };
}

function zonedTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute = 0,
  timeZone = BOOKING_TIMEZONE,
): Date {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const readParts = (date: Date) =>
    Object.fromEntries(
      formatter
        .formatToParts(date)
        .filter((part) => part.type !== "literal")
        .map((part) => [part.type, part.value]),
    );

  let guess = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const shown = readParts(guess);
    const shownUtc = Date.UTC(
      Number(shown.year),
      Number(shown.month) - 1,
      Number(shown.day),
      Number(shown.hour),
      Number(shown.minute),
      Number(shown.second ?? 0),
    );
    const requestedUtc = Date.UTC(year, month - 1, day, hour, minute, 0);
    guess = new Date(guess.getTime() + (requestedUtc - shownUtc));
  }

  return guess;
}

function formatSlotLabel(hour: number) {
  return `${String(hour).padStart(2, "0")}:00`;
}

export function getMinimumBookableTime(now = new Date()) {
  return new Date(now.getTime() + MIN_LEAD_MS);
}

export function getEarliestBookableDate(now = new Date()) {
  const minimum = getMinimumBookableTime(now);

  for (const hour of BOOKING_SLOT_HOURS) {
    const parts = getZonedParts(minimum);
    const slot = zonedTimeToUtc(parts.year, parts.month, parts.day, hour);
    if (slot.getTime() >= minimum.getTime()) {
      return new Date(parts.year, parts.month - 1, parts.day);
    }
  }

  const tomorrow = getZonedParts(
    new Date(minimum.getTime() + 24 * 60 * 60 * 1000),
  );
  return new Date(tomorrow.year, tomorrow.month - 1, tomorrow.day);
}

export function getAvailableTimeSlots(selectedDate: Date, now = new Date()) {
  const minimum = getMinimumBookableTime(now);
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;
  const day = selectedDate.getDate();

  return BOOKING_SLOT_HOURS.map((hour) => {
    const slotDate = zonedTimeToUtc(year, month, day, hour);
    return {
      hour,
      label: formatSlotLabel(hour),
      disabled: slotDate.getTime() < minimum.getTime(),
    };
  }).filter((slot) => !slot.disabled);
}

export function isGuestCountValid(value: number) {
  return Number.isInteger(value) && value >= MIN_GUESTS && value <= MAX_GUESTS;
}

export function isBookableSlot(selectedDate: Date, hour: number, now = new Date()) {
  return getAvailableTimeSlots(selectedDate, now).some((slot) => slot.hour === hour);
}
