import { whatsappLink, telLink } from "./contact";
import type { ContactPayload } from "./contact-request";
import { formatGuestDate } from "./whatsapp-text";

function fallbackPhone() {
  return process.env.WHATSAPP_FALLBACK_E164 ?? "+381653053166";
}

export function fallbackLinks(payload: ContactPayload) {
  const phone = fallbackPhone();
  const text =
    payload.type === "inquiry"
      ? `Upit sa sajta.\nIme: ${payload.name}\nTelefon: ${payload.phone}\nPoruka: ${payload.message}`
      : `Zahtev za proslavu sa sajta.\nIme: ${payload.name}\nTelefon: ${payload.phone}\nDatum: ${formatGuestDate(payload.date)}\nVreme: ${payload.time}\nGosti: ${payload.guests}\nProslava: ${payload.celebration}`;

  return {
    whatsappUrl: `${whatsappLink(phone)}?text=${encodeURIComponent(text)}`,
    telUrl: telLink(phone),
  };
}

export function ownerTemplate(payload: ContactPayload) {
  if (payload.type === "inquiry") {
    return {
      name: "upit_sa_sajta",
      parameters: [payload.name, payload.phone, payload.message],
    };
  }

  return {
    name: "rezervacija_sa_sajta",
    parameters: [
      payload.name,
      payload.phone,
      payload.date,
      payload.time,
      String(payload.guests),
      payload.celebration,
    ],
  };
}

export function guestTemplate(payload: ContactPayload) {
  if (payload.type === "inquiry") {
    return {
      name: "potvrda_upita",
      parameters: [payload.name],
    };
  }

  return {
    name: "potvrda_rezervacije",
    parameters: [
      payload.name,
      formatGuestDate(payload.date),
      payload.time,
      String(payload.guests),
    ],
  };
}
