import { DEFAULT_CONTACT } from "@shared/const";
import { trpc } from "@/lib/trpc";
import { ChevronDown, FlaskConical, Hand, Home, Sprout } from "lucide-react";
import { Link } from "wouter";

/* ─── The brand ─────────────────────────────────────────────────────────────
   Who makes it and how, in the label's own four claims — each one explained
   rather than repeated. */

const HOW = [
  {
    icon: Home,
    term: "Indoor grown",
    detail: "Every strain is grown indoors, where light, air and water are controlled from start to finish.",
  },
  {
    icon: Hand,
    term: "Hand trimmed",
    detail: "Flower is trimmed by hand before it goes in the jar.",
  },
  {
    icon: Sprout,
    term: "Small batch",
    detail: "We pack in small batches, and each one gets its own batch number.",
  },
  {
    icon: FlaskConical,
    term: "Lab tested",
    detail: "Each batch is lab tested, and its certificate of analysis is posted on this site.",
  },
];

export function BrandSection({
  strainCount,
  lineCount,
}: {
  strainCount: number;
  lineCount: number;
}) {
  const details = trpc.site.contactDetails.useQuery().data ?? DEFAULT_CONTACT;
  // "Billings, MT" out of "418 N 15th Street, Billings, MT 59101": the street
  // belongs on the contact page, the town is what says where the brand is from.
  const town = details.address.split(",").slice(1).join(",").replace(/\d{5}.*$/, "").trim();

  return (
    <section className="border-b border-rule">
      <div className="container grid gap-12 py-16 md:py-24 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
        <div>
          <h2 className="text-balance text-5xl text-white md:text-7xl">
            Flower first. Proof on the jar.
          </h2>
          <div className="mt-6 max-w-xl space-y-4 text-lg text-bone/85">
            <p>
              Dominator is exotic hemp flower from {details.company}
              {town ? `, out of ${town}` : ""}.
              {strainCount > 0 && lineCount > 0 && (
                <>
                  {" "}
                  We make {strainCount} strains across {lineCount} lines:
                  pre-rolls, hash holes, ounce jars and eighths.
                </>
              )}
            </p>
            <p>
              Every label carries a batch number and a QR code, so anyone
              holding a jar can look up exactly what the lab found in it.
            </p>
          </div>
          <Link href="/about" className="btn btn-line mt-8">
            More about us
          </Link>
        </div>

        <dl className="grid gap-x-10 gap-y-9 sm:grid-cols-2">
          {HOW.map(item => (
            <div key={item.term} className="border-t-[3px] border-accent pt-4">
              <dt className="flex items-center gap-3 font-display text-3xl font-extrabold uppercase text-white">
                <item.icon className="h-6 w-6 shrink-0 text-accent" strokeWidth={1.6} />
                {item.term}
              </dt>
              <dd className="mt-2 text-steel">{item.detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ─── Reading the label ─────────────────────────────────────────────────────
   The real 28G label with its parts keyed to a legend. The numbers are a key
   between the picture and the list, not a ranking. Pin positions are
   percentages of the image, so they stay on their target at any width. */

const LABEL_PARTS = [
  {
    x: 26.5,
    y: 41.3,
    title: "Strain and type",
    detail: "The strain name, with indica, sativa or hybrid right under it.",
  },
  {
    x: 72.5,
    y: 24.2,
    title: "How much is inside",
    detail: "Serving size and total weight. This jar holds 28 one-gram servings.",
  },
  {
    x: 4.6,
    y: 50.6,
    title: "Product facts",
    detail: "Cannabinoids per serving: CBD, CBG, delta-9 THC and total THC.",
  },
  {
    x: 82.6,
    y: 14,
    title: "What it is, and isn't",
    detail: "100% hemp flower, no delta-8, under 0.3% delta-9 THC, child-resistant packaging.",
  },
  {
    x: 80.4,
    y: 71,
    title: "Batch number and QR code",
    detail: "The batch number identifies your jar's lab report. The QR code takes you to it.",
  },
];

export function LabelGuide() {
  return (
    <section className="border-y border-rule bg-panel">
      <div className="container grid gap-10 py-16 md:py-24 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
        <div className="relative mx-auto w-full max-w-[520px]">
          <img
            src="/brand/label-sour-diesel.webp"
            alt="The Dominator Sour Diesel 28G label"
            width={1000}
            height={1133}
            loading="lazy"
            className="block w-full"
          />
          {LABEL_PARTS.map((part, i) => (
            <span
              key={part.title}
              aria-hidden
              style={{ left: `${part.x}%`, top: `${part.y}%` }}
              className="absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white font-cond text-lg font-semibold text-black shadow-[0_0_0_4px_rgba(0,0,0,0.55)] sm:h-9 sm:w-9"
            >
              {i + 1}
            </span>
          ))}
        </div>

        <div>
          <h2 className="text-balance text-5xl text-white md:text-7xl">
            Everything is on the label
          </h2>
          <p className="mt-4 max-w-lg text-lg text-steel">
            What each part of a Dominator label tells you.
          </p>
          <ol className="mt-8 space-y-5">
            {LABEL_PARTS.map((part, i) => (
              <li key={part.title} className="flex gap-4">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white font-cond text-lg font-semibold text-black">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-cond text-xl font-semibold normal-case tracking-wide text-white">
                    {part.title}
                  </h3>
                  <p className="mt-0.5 text-steel">{part.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ─── Questions ─────────────────────────────────────────────────────────────
   Answers come from the label's own statements. Native <details>, so they
   open with the keyboard and without any script. */

const FAQ: { q: string; a: React.ReactNode }[] = [
  {
    q: "Where do I find the lab report for my jar?",
    a: (
      <>
        Look for "Batch #" next to the QR code on your label. Scan the code, or
        type the batch number or the strain on the{" "}
        <Link href="/lab-reports" className="underline underline-offset-4 hover:text-white">
          Lab Reports
        </Link>{" "}
        page.
      </>
    ),
  },
  {
    q: "What does \"under 0.3% delta-9 THC\" mean?",
    a: "Dominator flower is hemp-derived and contains less than 0.3% delta-9 THC on a dry weight basis, which is the federal limit for hemp. State rules vary, so check the law where you live.",
  },
  {
    q: "Can it make me fail a drug test?",
    a: "Yes. These products may contain THC and can cause a user to fail a drug test.",
  },
  {
    q: "How is it meant to be used?",
    a: "It's intended for inhalation only, not for ingestion or topical use. All THCs have psychoactive properties: don't drive or operate heavy machinery after use. If you're pregnant or nursing, talk to a healthcare provider first.",
  },
  {
    q: "Who can buy Dominator?",
    a: "Adults 21 and older. Keep every product out of reach of children.",
  },
  {
    q: "Can my store carry Dominator?",
    a: (
      <>
        Yes. Send us a message through the{" "}
        <Link href="/contact" className="underline underline-offset-4 hover:text-white">
          Contact Us
        </Link>{" "}
        page and choose "Wholesale".
      </>
    ),
  },
];

export function FaqSection() {
  return (
    <section className="container grid gap-10 py-16 md:py-24 lg:grid-cols-[320px_1fr] lg:gap-16">
      <h2 className="text-5xl text-white md:text-6xl">Good to know</h2>
      <div className="border-t border-rule">
        {FAQ.map(item => (
          <details key={item.q} className="group border-b border-rule">
            <summary className="flex list-none items-center justify-between gap-6 py-5 text-xl font-semibold text-white marker:hidden hover:text-accent [&::-webkit-details-marker]:hidden">
              {item.q}
              <ChevronDown
                className="h-5 w-5 shrink-0 text-steel transition-transform duration-200 group-open:rotate-180"
                aria-hidden
              />
            </summary>
            <p className="max-w-2xl pb-6 text-lg text-steel">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
