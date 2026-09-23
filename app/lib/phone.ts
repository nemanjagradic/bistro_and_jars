import { parsePhoneNumberFromString } from "libphonenumber-js/max";

const MOBILE_TYPES = new Set(["MOBILE", "FIXED_LINE_OR_MOBILE"]);

function compact(value: string) {
  return value.replace(/[\s().-]/g, "");
}

/** Guest phone → E.164. Local input is Serbian; `+` or `00` may be another country. Mobiles only. */
export function toE164(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const squashed = compact(trimmed);
  let input: string;

  if (squashed.startsWith("+")) {
    input = squashed;
  } else if (squashed.startsWith("00")) {
    input = `+${squashed.slice(2)}`;
  } else {
    const digits = squashed.replace(/\D/g, "");
    if (!digits) return null;
    if (digits.startsWith("381")) {
      input = `+${digits}`;
    } else {
      input = digits.startsWith("0") ? digits : `0${digits}`;
    }
  }

  const parsed = parsePhoneNumberFromString(input, "RS");
  if (!parsed?.isValid()) return null;

  const type = parsed.getType();
  if (!type || !MOBILE_TYPES.has(type)) return null;

  return parsed.number;
}
