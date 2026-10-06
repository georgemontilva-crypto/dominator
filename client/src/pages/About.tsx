import { Jar } from "@/components/Jar";
import { PageHeader, PublicLayout } from "@/components/PublicLayout";
import { accentStyle, useTitle } from "@/lib/catalog";
import { trpc } from "@/lib/trpc";
import { DEFAULT_CONTACT } from "@shared/const";
import { groupByLine } from "@shared/lines";
import { Link } from "wouter";

const HOW = [
  {
    term: "Indoor grown",
    detail:
      "Every strain is grown indoors, where light, air and water are controlled from start to finish.",
  },
  {
    term: "Hand trimmed",
    detail: "Flower is trimmed by hand, not by machine, before it goes in the jar.",
  },
  {
    term: "Small batch",
    detail:
      "We pack in small batches. Each one gets its own batch number, printed next to the QR code.",
  },
  {
    term: "Lab tested",
    detail:
      "Each batch is lab tested, and its certificate of analysis is posted on this site.",
  },
];

const LABEL = [
  ["100% hemp flower", "Nothing but flower in the jar."],
  ["No delta-8", "None of our flower contains delta-8."],
  ["Under 0.3% delta-9 THC", "Within the federal limit for hemp, measured on a dry weight basis."],
  ["Child resistant", "Jars and tubes ship in child-resistant packaging."],
  ["21+ only", "Our products are for adults, and this site is too."],
];

export default function About() {
  useTitle("About Us");
  const products = trpc.catalog.publicProducts.useQuery();
  const details = trpc.site.contactDetails.useQuery().data ?? DEFAULT_CONTACT;
  // One jar from each line, for the row under the intro.
  const faces = groupByLine(products.data ?? [])
    .map(g => g.items[0])
    .filter(Boolean);

  return (
    <PublicLayout>
      <PageHeader title="About us">
        {details.company} makes exotic hemp flower: jars, pre-rolls and hash
        holes, grown indoors and tested by the batch.
      </PageHeader>

      <div className="container py-14 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <h2 className="text-balance text-5xl text-white md:text-6xl">
              Flower first. Proof on the jar.
            </h2>
            <div className="mt-6 max-w-xl space-y-4 text-lg text-bone/85">
              <p>
                Dominator started from a simple standard: the flower should be
                good enough to sell on its own, and the paperwork should be
                easy enough to find that nobody has to take our word for it.
              </p>
              <p>
                That's why every label carries a batch number and a QR code,
                and why this site exists. Pick up any jar, look up its batch,
                and read exactly what the lab found.
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/products" className="btn btn-solid">
                See the lineup
              </Link>
              <Link href="/lab-reports" className="btn btn-line">
                Read the lab reports
              </Link>
            </div>
          </div>

          {faces.length > 0 && (
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2">
              {faces.map(p => (
                <li key={p.id} style={accentStyle(p.accentColor)}>
                  <Link href={`/products/${p.slug}`} aria-label={p.name}>
                    <Jar src={p.imageUrl} alt={`${p.name} jar`} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <section className="border-y border-rule bg-panel">
        <div className="container grid gap-10 py-14 md:py-20 lg:grid-cols-[320px_1fr]">
          <h2 className="text-5xl text-white md:text-6xl">How it's made</h2>
          <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {HOW.map(item => (
              <div key={item.term} className="border-t-[3px] border-accent pt-4">
                <dt className="font-display text-3xl font-extrabold uppercase text-white">
                  {item.term}
                </dt>
                <dd className="mt-2 text-steel">{item.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="container grid gap-10 py-14 md:py-20 lg:grid-cols-[320px_1fr]">
        <h2 className="text-5xl text-white md:text-6xl">What the label means</h2>
        <dl className="divide-y divide-rule border-y border-rule">
          {LABEL.map(([term, detail]) => (
            <div key={term} className="grid gap-1 py-4 sm:grid-cols-[260px_1fr] sm:gap-6">
              <dt className="font-cond text-xl font-semibold uppercase tracking-wide text-white">
                {term}
              </dt>
              <dd className="text-steel">{detail}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="container">
        <div className="hud">
          <div className="hud-in texture flex flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-12">
            <div>
              <h2 className="text-4xl text-white md:text-5xl">
                Carry Dominator, or just have a question?
              </h2>
              <p className="mt-2 text-steel">
                {details.address ? `${details.company}, ${details.address}.` : details.company}
              </p>
            </div>
            <Link href="/contact" className="btn btn-accent shrink-0">
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
