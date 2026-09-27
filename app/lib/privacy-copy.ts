import type { Locale } from "./chrome-copy";

/** Set at go-live; visible on the page only (metadata stays generic Serbian). */
export const PRIVACY_LAST_UPDATED_ISO = "2026-09";

export const PRIVACY_LAST_UPDATED: Record<Locale, string> = {
  sr: "septembar 2026.",
  en: "September 2026.",
};

export const COMMISSIONER_URL: Record<Locale, string> = {
  sr: "https://www.poverenik.rs/",
  en: "https://www.poverenik.rs/en/",
};

export type PrivacySection = {
  id: string;
  title: string;
  paragraphs: string[];
  /** Shown after the first paragraph. Used for the form-field list. */
  list?: string[];
};

export type PrivacyCopy = {
  kicker: string;
  title: string;
  lastUpdatedPrefix: string;
  intro: string;
  commissionerName: string;
  commissionerBefore: string;
  rightsTitle: string;
  rightsIntro: string;
  contactTitle: string;
  contactIntro: string;
  contactOr: string;
  backToContact: string;
  sections: PrivacySection[];
};

export const PRIVACY_COPY: Record<Locale, PrivacyCopy> = {
  sr: {
    kicker: "Pravna napomena",
    title: "Politika privatnosti",
    lastUpdatedPrefix: "Poslednja izmena:",
    intro:
      "Ova politika objašnjava kako Bistro & Jars Coffee Bar prikuplja i koristi podatke koje nam dostavite putem ovog sajta.",
    commissionerName:
      "Povereniku za informacije od javnog značaja i zaštitu podataka o ličnosti",
    commissionerBefore: "Takođe imate pravo da se obratite ",
    rightsTitle: "Vaša prava",
    rightsIntro:
      "Možete zatražiti uvid, ispravku ili brisanje podataka, ograničenje obrade, uložiti prigovor na obradu i, kada zakon to predviđa, zatražiti prenosivost podataka.",
    contactTitle: "Kontakt",
    contactIntro: "Za pitanja u vezi sa podacima:",
    contactOr: "ili",
    backToContact: "Nazad na kontakt",
    sections: [
      {
        id: "controller",
        title: "Rukovalac podataka",
        paragraphs: [
          "Rukovalac je Miloš Ilić PR ugostiteljska radnja Bistro and Jars Deveta Umka (Bistro & Jars Coffee Bar), Milije Stanojlovića 32, 11260 Umka, Srbija, PIB: 115598508, tel. +381 65 305 3166.",
          "Lokacija kafića: Pariske komune 59, 11070 Beograd (Novi Beograd).",
        ],
      },
      {
        id: "collect",
        title: "Koje podatke prikupljamo",
        list: [
          "Upit: ime, broj telefona, poruka.",
          "Zahtev za proslavu: ime, broj telefona, datum, vreme, broj gostiju i kratak opis proslave.",
        ],
        paragraphs: [
          "Podatke koje nam šaljete unosite sami u forme.",
          "Prilikom korišćenja sajta, hosting provajder (Vercel) može privremeno zabeležiti tehničke podatke kao što je IP adresa, radi rada sajta i zaštite od zloupotrebe. Te podatke ne koristimo za marketing ni za praćenje posetilaca.",
          "Radi sprečavanja zloupotrebe, oko jedan sat održavamo brojač po IP adresi i heširani ključ broja telefona. Sadržaj forme se u tu svrhu ne čuva, a ovi podaci se automatski uklanjaju nakon isteka tog perioda.",
        ],
      },
      {
        id: "legal-basis",
        title: "Pravni osnov",
        paragraphs: [
          "Podaci koje unesete u formu obrađuju se kako bismo odgovorili na vaš upit ili obradili zahtev za proslavu i preduzeli potrebne radnje na vaš zahtev pre eventualnog dogovora ili rezervacije.",
          "Obrada tehničkih podataka potrebnih za rad sajta i sprečavanje zloupotrebe, uključujući logove i ograničavanje broja zahteva, zasniva se na našem legitimnom interesu da sajt radi bezbedno i pouzdano. Te podatke ne koristimo za marketing.",
          "Unos u formu je dobrovoljan. Bez podataka potrebnih za konkretnu formu ne možemo da primimo zahtev niti da vam odgovorimo.",
        ],
      },
      {
        id: "use",
        title: "Kako koristimo podatke",
        paragraphs: [
          "Podaci se koriste samo da odgovorimo na vaš upit, obradimo zahtev za proslavu i kontaktiramo vas u vezi sa tim zahtevom.",
        ],
      },
      {
        id: "sharing",
        title: "Kome prosleđujemo podatke",
        paragraphs: [
          "Podaci se prosleđuju kafiću, koji ih koristi za obradu vašeg zahteva. Za slanje i isporuku WhatsApp poruka koristi se WhatsApp Business Platform kompanije Meta Platforms Ireland Limited. Meta obrađuje podatke u meri potrebnoj za pružanje tog servisa i u skladu sa svojim pravilima i uslovima.",
          "Kratak opis proslave koji unesete u formu prosleđuje se kafiću radi obrade zahteva, ali se ne uključuje u automatsku WhatsApp potvrdu koju primate.",
          "Ne prodajemo vaše podatke. Naša aplikacija ne čuva kopiju sadržaja poslate forme u sopstvenoj bazi podataka.",
        ],
      },
      {
        id: "transfers",
        title: "Prenos u inostranstvo",
        paragraphs: [
          "Za pružanje usluga hostinga i slanje WhatsApp poruka mogu se koristiti infrastruktura i pružaoci usluga koji se nalaze van Republike Srbije. Vercel i Meta mogu obrađivati podatke u različitim državama u kojima posluju ili koriste infrastrukturu svojih pružalaca usluga. Prenos i obrada podataka vrše se u skladu sa primenljivim pravilima o zaštiti podataka i mehanizmima za međunarodni prenos koje primenjuju ti pružaoci.",
        ],
      },
      {
        id: "reservations",
        title: "Napomena o rezervacijama",
        paragraphs: [
          "Forma služi za slanje zahteva za proslavu. Slanje zahteva nije automatska potvrda rezervacije. Rezervacija važi tek kada vas kontaktiramo i lično je potvrdimo.",
        ],
      },
      {
        id: "retention",
        title: "Rok čuvanja",
        paragraphs: [
          "Nakon uspešnog slanja poruke na WhatsApp ne čuvamo kopiju sadržaja forme u samoj aplikaciji sajta. Zapis zahteva ostaje u WhatsApp razgovoru kafića onoliko dugo koliko je potreban za obradu zahteva, komunikaciju u vezi sa njim i vođenje potrebne evidencije, nakon čega se briše kada više nije potreban, osim ako postoji zakonska obaveza za njegovo čuvanje. Tehničke logove hosting provajdera i kratkotrajne podatke za zaštitu od zloupotrebe ne koristimo kao arhivu formi.",
        ],
      },
      {
        id: "analytics",
        title: "Analitika i praćenje",
        paragraphs: [
          "Ne koristimo Google Analytics, Meta Pixel, niti druge alate za analitičko ili reklamno praćenje.",
        ],
      },
      {
        id: "language",
        title: "Jezik",
        paragraphs: [
          "Na vašem uređaju, u localStorage pregledača, čuvamo samo izbor jezika, da bismo sajt prikazali na istom jeziku pri sledećoj poseti. Ovaj podatak služi samo za pamćenje izbora jezika i ne koristi se za praćenje korisnika.",
        ],
      },
    ],
  },
  en: {
    kicker: "Legal notice",
    title: "Privacy Policy",
    lastUpdatedPrefix: "Last updated:",
    intro:
      "This policy explains how Bistro & Jars Coffee Bar collects and uses data you submit through this website.",
    commissionerName:
      "Commissioner for Information of Public Importance and Personal Data Protection of the Republic of Serbia",
    commissionerBefore: "You may also contact the ",
    rightsTitle: "Your rights",
    rightsIntro:
      "You may request access, correction, or deletion of your data, restriction of processing, and, where the law provides it, a portable copy. You may withdraw consent using the contact details below.",
    contactTitle: "Contact",
    contactIntro: "For privacy questions:",
    contactOr: "or",
    backToContact: "Back to contact",
    sections: [
      {
        id: "controller",
        title: "Data controller",
        paragraphs: [
          "The controller is Miloš Ilić PR ugostiteljska radnja Bistro and Jars Deveta Umka (Bistro & Jars Coffee Bar), Milije Stanojlovića 32, 11260 Umka, Serbia, tax ID (PIB): 115598508, tel. +381 65 305 3166.",
          "Café location: Pariske komune 59, 11070 Beograd (Novi Beograd).",
        ],
      },
      {
        id: "collect",
        title: "Data we collect",
        list: [
          "Inquiry: name, phone number, message.",
          "Reservation request (celebrations): name, phone number, date, time, number of guests, and a short description of the celebration.",
        ],
        paragraphs: [
          "You enter the data you send us yourself, in the forms.",
          "When you use the site, our hosting provider (Vercel) may temporarily log technical data such as an IP address, so the site can operate and so we can prevent abuse. We do not use this for marketing or visitor tracking.",
          "To prevent abuse, for about one hour we keep a counter for the IP address and a hashed key of the phone number. Form content is not stored there, and the counters expire on their own.",
        ],
      },
      {
        id: "legal-basis",
        title: "Legal basis",
        paragraphs: [
          "By submitting a form you consent to our processing that data solely to respond to your inquiry or handle your reservation request, and to receiving one WhatsApp message on the number you entered confirming that we received it.",
          "Visiting the site and the technical safeguards, including logs and rate limits, rely on our legitimate interest in operating the site and preventing abuse. We do not use that data for marketing.",
          "Filling in the form is voluntary. Without those details we cannot receive the request or reply to you.",
        ],
      },
      {
        id: "use",
        title: "How we use data",
        paragraphs: [
          "We use the data only to reply, process the reservation request, and contact you about that request.",
        ],
      },
      {
        id: "sharing",
        title: "Who we share data with",
        paragraphs: [
          "The site sends requests through Meta’s WhatsApp Business Platform (Meta Platforms Ireland Limited) to the café’s WhatsApp number. Through the same service we send one confirmation message to the number you entered. That confirmation includes your name and, for a reservation, the date, time, and number of guests. It does not include the text of your message or the celebration description. Only the café receives those.",
          "Meta processes this data under its own rules so the messages can be delivered. We do not sell your data. We do not keep a forms database on the website.",
        ],
      },
      {
        id: "transfers",
        title: "Transfers abroad",
        paragraphs: [
          "The site is hosted by Vercel in the United States. WhatsApp messages go through Meta Platforms Ireland Limited, and Meta may also process the data in other countries where it operates. Data can therefore leave Serbia. We do not transfer it for any other purpose.",
        ],
      },
      {
        id: "reservations",
        title: "Note on reservations",
        paragraphs: [
          "The reservation form is for celebrations, not for a regular table. Submitting a request is not an automatic booking confirmation. A reservation is valid only after we contact you and confirm it.",
        ],
      },
      {
        id: "retention",
        title: "Retention",
        paragraphs: [
          "After a WhatsApp message is sent successfully, we do not keep a copy of the form on the site. The request remains in the café’s WhatsApp thread while we handle it and for as long as we need it as a record of that conversation. You can ask us to delete it. We do not use hosting logs or the abuse counters as a forms archive.",
        ],
      },
      {
        id: "analytics",
        title: "Analytics and tracking",
        paragraphs: [
          "We do not use Google Analytics, Meta Pixel, or any other analytics or advertising tracking tools.",
        ],
      },
      {
        id: "language",
        title: "Language",
        paragraphs: [
          "We store only your language preference on your device, in the browser's localStorage, so the site opens in the same language next time. This is not a cookie and is not used for tracking.",
        ],
      },
    ],
  },
};
