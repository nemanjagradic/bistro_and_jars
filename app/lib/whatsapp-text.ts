const NAME_MAX = 60;

/** Meta rejects template values that contain newlines, tabs, or 4+ spaces. */
export function collapseWhatsAppText(value: string) {
  return value.replace(/[\t\n\r]+/g, " ").replace(/ {2,}/g, " ").trim();
}

export function templateName(value: string) {
  return collapseWhatsAppText(value).slice(0, NAME_MAX);
}

/** Guest templates only. Example: 3. 9. 2026. */
export function formatGuestDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-");
  return `${Number(day)}. ${Number(month)}. ${year}.`;
}

export function submittedAtBelgrade(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Belgrade",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
    timeZoneName: "longOffset",
  }).formatToParts(now);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  const hour = get("hour") === "24" ? "00" : get("hour");
  const rawOffset = get("timeZoneName").replace("GMT", "");
  const match = rawOffset.match(/^([+-])(\d{1,2})(?::(\d{2}))?$/);
  const offset = match
    ? `${match[1]}${match[2].padStart(2, "0")}:${match[3] ?? "00"}`
    : "+01:00";

  return `${get("year")}-${get("month")}-${get("day")}T${hour}:${get("minute")}:${get("second")}${offset}`;
}
