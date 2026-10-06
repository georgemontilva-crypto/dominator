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
