import type { Locale } from "./chrome-copy";

/** Set at go-live; visible on the page only (metadata stays generic Serbian). */
export const TERMS_LAST_UPDATED_ISO = "2026-09";

export const TERMS_LAST_UPDATED: Record<Locale, string> = {
  sr: "septembar 2026.",
  en: "September 2026.",
};

export type TermsSection = {
  id: string;
  title: string;
  paragraphs: string[];
};

export type TermsCopy = {
  kicker: string;
  title: string;
  lastUpdatedPrefix: string;
  intro: string;
  privacyTitle: string;
  privacyBefore: string;
  privacyLink: string;
  contactTitle: string;
  contactIntro: string;
  contactOr: string;
  backToContact: string;
  sections: TermsSection[];
};

export const TERMS_COPY: Record<Locale, TermsCopy> = {
  sr: {
    kicker: "Pravna napomena",
    title: "Uslovi korišćenja",
    lastUpdatedPrefix: "Poslednja izmena:",
    intro: "Ovi uslovi uređuju korišćenje ovog sajta.",
    privacyTitle: "Privatnost",
    privacyBefore: "Način na koji prikupljamo i koristimo podatke opisan je u ",
    privacyLink: "politici privatnosti",
    contactTitle: "Kontakt",
    contactIntro: "Za pitanja u vezi sa ovim uslovima:",
    contactOr: "ili",
    backToContact: "Nazad na kontakt",
    sections: [
      {
        id: "operator",
        title: "Ko vodi sajt",
        paragraphs: [
          "Sajt vodi Miloš Ilić PR ugostiteljska radnja Bistro and Jars Deveta Umka (Bistro & Jars Coffee Bar), Milije Stanojlovića 32, 11260 Umka, Srbija, PIB: 115598508.",
          "Lokacija kafića: Pariske komune 59, 11070 Beograd (Novi Beograd).",
        ],
      },
      {
        id: "site",
        title: "Čemu služi sajt",
        paragraphs: [
          "Sajt prikazuje kafić, meni, galeriju i dve forme: upit i zahtev za proslavu.",
          "Preko sajta se ne plaća, ne otvara nalog i ne rezerviše običan sto.",
        ],
      },
      {
        id: "inquiry",
        title: "Upiti",
        paragraphs: [
          "Upitom šaljete ime, broj telefona i poruku da bi vam kafić odgovorio.",
          "Podaci koje unesete treba da budu tačni, a poruka da se odnosi na kafić.",
        ],
      },
      {
        id: "celebrations",
        title: "Zahtevi za proslavu",
        paragraphs: [
          "Forma je za proslave, za 1 do 50 gostiju.",
          "Slanje forme ne rezerviše termin. Rezervacija postoji tek kada vas kafić kontaktira i potvrdi je.",
          "Datum, vreme i broj gostiju na formi su zahtev. Izmene i otkaz dogovarate u tom kasnijem razgovoru.",
        ],
      },
      {
        id: "whatsapp",
        title: "WhatsApp",
        paragraphs: [
          "Zahtev stiže kafiću preko WhatsApp Business Platform servisa kompanije Meta Platforms Ireland Limited.",
          "Na broj koji ste uneli šaljemo jednu WhatsApp poruku kao potvrdu prijema zahteva. Kod upita ta poruka sadrži vaše ime. Kod proslave sadrži i datum, vreme i broj gostiju. Ne sadrži tekst poruke niti opis proslave.",
          "Ta potvrda znači da je zahtev primljen. Nije odgovor kafića i nije rezervacija.",
          "Ako WhatsApp ne isporuči potvrdu, zahtev možda nije stigao do kafića. Tada možete da pozovete ili pošaljete poruku na broj sa stranice za kontakt.",
        ],
      },
      {
        id: "use",
        title: "Korišćenje sajta",
        paragraphs: [
          "Nećete slati netačne podatke, tuđi broj, nezakonit sadržaj, niti ponavljati slanje da biste opteretili formu.",
          "Kafić može da odbije ili ne obradi zahtev koji nije u skladu sa ovim uslovima.",
        ],
      },
      {
        id: "info",
        title: "Meni, radno vreme i fotografije",
        paragraphs: [
          "Meni, cene i radno vreme na sajtu su informacija. Kafić ih može promeniti. Važi ono što vam kafić kaže uživo ili kada potvrdi proslavu.",
          "Fotografije, tekst i drugi sadržaj na sajtu zaštićeni su pravima njihovih nosilaca. Bez prethodne dozvole ne smete ih koristiti za sopstvenu komercijalnu upotrebu.",
        ],
      },
      {
        id: "availability",
        title: "Rad sajta",
        paragraphs: [
          "Kafić vodi sajt u stanju u kakvom jeste. Tehnički prekid, uključujući neisporučenu WhatsApp poruku, sam po sebi ne stvara rezervaciju niti drugu obavezu.",
        ],
      },
      {
        id: "changes",
        title: "Izmene",
        paragraphs: [
          "Kafić može da izmeni ove uslove objavljivanjem nove verzije na ovoj stranici. Datum na vrhu je datum važeće verzije. Nastavak korišćenja sajta posle tog datuma znači da prihvatate izmenjene uslove.",
        ],
      },
      {
        id: "law",
        title: "Pravo",
        paragraphs: ["Na ove uslove primenjuje se pravo Republike Srbije."],
      },
    ],
  },
  en: {
    kicker: "Legal notice",
    title: "Terms of Service",
    lastUpdatedPrefix: "Last updated:",
    intro:
      "These terms cover use of this website. Opening the site or sending a form means you accept them.",
    privacyTitle: "Privacy",
    privacyBefore: "How we collect and use data is described in the ",
    privacyLink: "privacy policy",
    contactTitle: "Contact",
    contactIntro: "For questions about these terms:",
    contactOr: "or",
    backToContact: "Back to contact",
    sections: [
      {
        id: "operator",
        title: "Who runs the site",
        paragraphs: [
          "The site is run by Miloš Ilić PR ugostiteljska radnja Bistro and Jars Deveta Umka (Bistro & Jars Coffee Bar), Milije Stanojlovića 32, 11260 Umka, Serbia, tax ID (PIB): 115598508.",
          "Café location: Pariske komune 59, 11070 Beograd (Novi Beograd).",
        ],
      },
      {
        id: "site",
        title: "What the site is for",
        paragraphs: [
          "The site shows the café, the menu, the gallery, and two forms: an inquiry and a celebration request.",
          "The site does not take payment, create an account, or book a regular table.",
        ],
      },
      {
        id: "inquiry",
        title: "Inquiries",
        paragraphs: [
          "An inquiry sends your name, phone number, and message so the café can reply.",
          "The details you enter should be accurate, and the message should be about the café.",
        ],
      },
      {
        id: "celebrations",
        title: "Celebration requests",
        paragraphs: [
          "The form is for celebrations, for 1 to 50 guests.",
          "Sending the form does not reserve a time. A reservation exists only after the café contacts you and confirms it.",
          "The date, time, and guest count on the form are a request. Changes and cancellation are agreed in that later conversation.",
        ],
      },
      {
        id: "whatsapp",
        title: "WhatsApp",
        paragraphs: [
          "The request reaches the café through Meta’s WhatsApp Business Platform (Meta Platforms Ireland Limited).",
          "You agree to one confirmation message on the number you entered. For an inquiry, that message contains your name. For a celebration, it also contains the date, time, and number of guests. It does not contain your message text or the celebration description.",
          "That confirmation means the request was received. It is not the café’s reply and it is not a booking.",
          "If WhatsApp does not deliver the confirmation, the request may not have reached the café. You can then call or message the number on the contact page.",
        ],
      },
      {
        id: "use",
        title: "Using the site",
        paragraphs: [
          "You will not send false details, someone else’s number, unlawful content, or repeated submissions meant to overload the form.",
          "The café may ignore a request that breaks these terms.",
        ],
      },
      {
        id: "info",
        title: "Menu, hours, and photos",
        paragraphs: [
          "The menu, prices, and opening hours on the site are information. The café can change them. What applies is what the café tells you in person or when it confirms a celebration.",
          "Photos and text on the site belong to the café. You may not copy them for your own commercial use.",
        ],
      },
      {
        id: "availability",
        title: "The site itself",
        paragraphs: [
          "The café runs the site as it is. A technical failure, including a WhatsApp message that is not delivered, does not by itself create a reservation or any other obligation.",
        ],
      },
      {
        id: "changes",
        title: "Changes",
        paragraphs: [
          "The café can update these terms by publishing a new version on this page. The date at the top is the date of the current version. Continuing to use the site after that date means you accept the updated terms.",
        ],
      },
      {
        id: "law",
        title: "Law",
        paragraphs: ["Serbian law applies to these terms."],
      },
    ],
  },
};
