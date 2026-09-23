export const VENUE = {
  addressLine1: "Pariske komune 59",
  addressLine2: "11070 Beograd",
  phoneE164: "+381653053166",
  phoneDisplay: "+381 65 305 3166",
  email: "bistrojars@gmail.com",
  instagramHandle: "bistro_jars_coffee_bar",
  googleMapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Bistro+%26+Jars+Coffee+Bar",
} as const;

export function telLink(phone = VENUE.phoneE164) {
  return `tel:${phone}`;
}

export function whatsappLink(phone = VENUE.phoneE164) {
  return `https://wa.me/${phone.replace(/\D/g, "")}`;
}

export function mailtoLink(email = VENUE.email) {
  return `mailto:${email}`;
}

export function instagramLink(handle = VENUE.instagramHandle) {
  return `https://www.instagram.com/${handle}/`;
}
