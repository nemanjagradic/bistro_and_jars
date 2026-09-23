import type { Locale } from "./chrome-copy";

type ShakeStepCopy = {
  label: string;
  line: string;
};

type HomeCopy = {
  heroTagline: string;
  heroSubline: string;
  heroScrollCue: string;
  aboutKicker: string;
  aboutHeading: string;
  aboutParagraphs: readonly [string, string];
  aboutLocation: string;
  shakeSubtitle: string;
  shakeStepsLabel: string;
  shakeFinishedAlt: string;
  /** Order must match the cut times in shake-process.tsx. */
  shakeSteps: readonly ShakeStepCopy[];
};

export const HOME_COPY: Record<Locale, HomeCopy> = {
  sr: {
    heroTagline: "Kafa te dovede. Atmosfera te zadrži.",
    heroSubline:
      "Uz slatke tegle, dobro društvo i sve što Bistro & Jars čini posebnim.",
    heroScrollCue: "Skroluj",
    aboutKicker: "O nama",
    aboutHeading: "Stvoreno za dobre ukuse i još bolje trenutke.",
    aboutParagraphs: [
      "Bistro & Jars je coffee bar stvoren za dobru kafu, piće i prijatno druženje. Bilo da dolaziš sam ili sa prijateljima, ovde te čekaju dobra kafa, prijatan razgovor i atmosfera kojoj se rado vraćaš.",
      "Ako poželiš nešto slatko, tu su naši Monster Shakeovi, bogati, kreativni i napravljeni da privuku pažnju i pre prvog gutljaja. Mesto je idealno za predah, razgovor i uživanje u društvu, a dobrodošli su i tvoji ljubimci.",
    ],
    aboutLocation: "Pronađi nas na adresi Pariske komune 59, na Novom Beogradu.",
    shakeSubtitle: "Od prvog sastojka do poslednjeg detalja.",
    shakeStepsLabel: "Koraci pripreme",
    shakeFinishedAlt: "Monster Shake Kinder u tegli, sa šlagom i Kinder jajetom",
    shakeSteps: [
      {
        label: "Osnova",
        line: "Sladoled od vanile, mleko i slatka pavlaka.",
      },
      {
        label: "Tegla",
        line: "Prvi deo dekoracije: čokolada iznutra, Nutella po obodu, pa šarene mrvice.",
      },
      {
        label: "Punjenje",
        line: "Šejk se sipa u pripremljenu teglu.",
      },
      {
        label: "Kruna",
        line: "Šlag na vrh, pa Kinder čokolada i Kinder Surprise jaje.",
      },
      {
        label: "Završni detalj",
        line: "Čokoladni preliv i šarene mrvice preko šlaga — Monster Shake je gotov.",
      },
    ],
  },
  en: {
    heroTagline: "Coffee brings you in. The atmosphere makes you stay.",
    heroSubline:
      "With sweet jars, good company, and everything that makes Bistro & Jars special.",
    heroScrollCue: "Scroll",
    aboutKicker: "About us",
    aboutHeading: "Made for good flavours and even better moments.",
    aboutParagraphs: [
      "Bistro & Jars is a coffee bar made for good coffee, drinks, and pleasant company. Whether you come alone or with friends, good coffee, pleasant conversation, and an atmosphere you'll be glad to return to are waiting for you here.",
      "If you're in the mood for something sweet, our Monster Shakes are here — rich, creative, and made to grab your attention even before the first sip. It's an ideal place for a break, a conversation, and enjoying good company, and your pets are welcome too.",
    ],
    aboutLocation: "Find us at Pariske komune 59 in New Belgrade.",
    shakeSubtitle: "From the first ingredient to the last detail.",
    shakeStepsLabel: "Preparation steps",
    shakeFinishedAlt:
      "Monster Shake Kinder in a jar, with whipped cream and a Kinder egg",
    shakeSteps: [
      {
        label: "Base",
        line: "Vanilla ice cream, milk, and cream.",
      },
      {
        label: "Jar",
        line: "First part of the decoration: chocolate inside, Nutella around the rim, then colourful sprinkles.",
      },
      {
        label: "Filling",
        line: "The shake is poured into the prepared jar.",
      },
      {
        label: "Crown",
        line: "Whipped cream on top, then Kinder chocolate and a Kinder Surprise egg.",
      },
      {
        label: "Final touch",
        line: "Chocolate sauce and colourful sprinkles over the whipped cream — the Monster Shake is ready.",
      },
    ],
  },
};
