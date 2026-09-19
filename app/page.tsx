import { HeroEntrance } from "./components/hero-entrance";
import { ShakeProcess } from "./components/shake-process";

export default function Home() {
  return (
    <main>
      <HeroEntrance />

      <section className="bg-anthracite px-5 py-20 sm:px-8 sm:py-24 lg:px-16 lg:py-28">
        <div className="mx-auto grid max-w-6xl items-start gap-x-16 gap-y-5 md:grid-cols-12">
          <p className="font-sans text-[0.65rem] uppercase tracking-[0.28em] text-gold md:col-span-5">
            O nama
          </p>
          <h2 className="font-heading text-3xl font-medium leading-tight text-ivory sm:text-4xl md:col-span-5 md:col-start-1 md:text-[2.75rem] md:leading-tight">
            Stvoreno za dobre ukuse i još bolje trenutke.
          </h2>
          <div className="mt-4 md:col-span-7 md:col-start-6 md:row-start-2 md:mt-0">
            <div className="space-y-5 text-base leading-relaxed text-ivory/75 sm:text-lg">
              <p>
                Bistro & Jars je coffee bar stvoren za dobru kafu, piće i prijatno
                druženje. Bilo da dolaziš sam ili sa prijateljima, ovde te čekaju
                dobra kafa, prijatan razgovor i atmosfera kojoj se rado vraćaš.
              </p>
              <p>
                Ako poželiš nešto slatko, tu su naši Monster Shakeovi, bogati,
                kreativni i napravljeni da privuku pažnju i pre prvog gutljaja.
                Mesto je idealno za predah, razgovor i uživanje u društvu, a
                dobrodošli su i tvoji ljubimci.
              </p>
            </div>
            <p className="mt-8 text-sm leading-relaxed text-ivory/90 sm:mt-10 sm:text-base">
              Pronađi nas na adresi Pariske komune 59, na Novom Beogradu.
            </p>
          </div>
        </div>
      </section>

      <ShakeProcess />
    </main>
  );
}
