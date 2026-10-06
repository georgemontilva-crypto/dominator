import { Jar } from "@/components/Jar";
import { ProductCard } from "@/components/ProductCard";
import { PublicLayout } from "@/components/PublicLayout";
import { ReportRow } from "@/components/ReportRow";
import { accentStyle, strainLabel, useTitle } from "@/lib/catalog";
import { trpc } from "@/lib/trpc";
import { parseFacts } from "@shared/const";
import { lineSlug } from "@shared/lines";
import { ChevronLeft } from "lucide-react";
import { Link, useParams } from "wouter";

export default function ProductDetail() {
  const { slug = "" } = useParams<{ slug: string }>();
  const product = trpc.catalog.productBySlug.useQuery({ slug }, { retry: false });
  const catalog = trpc.catalog.publicProducts.useQuery();
  const p = product.data;
  useTitle(p ? p.name : "Product");

  if (product.isLoading) {
    return (
      <PublicLayout>
        <div className="container py-24 text-steel">Loading…</div>
      </PublicLayout>
    );
  }

  if (!p) {
    return (
      <PublicLayout>
        <div className="container max-w-2xl py-24">
          <h1 className="text-5xl text-white md:text-6xl">
            That product isn't here
          </h1>
          <p className="mt-4 text-lg text-steel">
            It may have been renamed or taken out of the lineup.
          </p>
          <Link href="/products" className="btn btn-solid mt-8">
            See all products
          </Link>
        </div>
      </PublicLayout>
    );
  }

  const facts = parseFacts(p.facts);
  const siblings = (catalog.data ?? []).filter(
    other => other.collection === p.collection && other.id !== p.id
  );

  return (
    <PublicLayout>
      <div style={accentStyle(p.accentColor)}>
        <div className="texture border-b border-rule">
          <div className="container pt-6">
            <Link
              href={p.collection ? `/products?line=${lineSlug(p.collection)}` : "/products"}
              className="inline-flex items-center gap-1 font-cond text-base font-semibold uppercase tracking-wider text-steel hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
              {p.collection ?? "Products"}
            </Link>
          </div>

          <div className="container grid gap-8 pb-12 pt-4 md:pb-16 lg:grid-cols-2 lg:items-center lg:gap-14">
            <Jar
              src={p.imageUrl}
              alt={`${p.name} jar`}
              eager
              className="mx-auto w-full max-w-[540px]"
            />

            <div>
              {p.strain && (
                <span className="plate">
                  <span className="plate-in text-xl text-accent">
                    {strainLabel(p.strain)}
                  </span>
                </span>
              )}
              <h1 className="mt-4 text-balance text-6xl text-white md:text-8xl">
                {p.name}
              </h1>
              {p.subtitle && (
                <p className="mt-3 font-cond text-xl font-semibold uppercase tracking-wider text-steel">
                  {p.subtitle}
                </p>
              )}
              {p.description && (
                <p className="mt-6 max-w-xl whitespace-pre-line text-lg text-bone/85">
                  {p.description}
                </p>
              )}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#lab-reports" className="btn btn-accent">
                  {p.reports.length > 0 ? "Read the lab report" : "Lab report"}
                </a>
                <Link href="/contact" className="btn btn-line">
                  Ask about this product
                </Link>
              </div>
            </div>
          </div>
          <div className="tick-rule" aria-hidden />
        </div>

        <div className="container grid gap-12 py-14 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-16">
          {facts.length > 0 && (
            <section aria-labelledby="facts-title">
              {/* The label's own "Product Facts" box: white, black type, heavy
                  rules. It is the one white surface on the site because it is
                  the one white surface on the jar. */}
              <div className="bg-white p-1.5 text-black">
                <div className="border-2 border-black">
                  <h2
                    id="facts-title"
                    className="border-b-[5px] border-black px-3 py-2 font-sans text-xl font-semibold normal-case tracking-normal"
                  >
                    Product facts
                  </h2>
                  <dl>
                    {facts.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-baseline justify-between gap-4 border-b border-black/70 px-3 py-2 last:border-b-0"
                      >
                        <dt className="font-semibold">{f.label}</dt>
                        <dd className="text-right tabular-nums">{f.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
              <p className="mt-3 text-sm text-steel">
                As printed on the label.
                {facts.some(f => /total thc/i.test(f.label)) &&
                  " Total THC = Δ9-THC + (0.877 × THCA)."}{" "}
                The lab report has the full panel for each batch.
              </p>
            </section>
          )}

          <section id="lab-reports" aria-labelledby="reports-title" className="scroll-mt-24">
            <h2 id="reports-title" className="text-4xl text-white md:text-5xl">
              Lab reports
            </h2>
            {p.reports.length > 0 ? (
              <>
                <p className="mt-3 max-w-xl text-steel">
                  Match the batch number on your jar to the one below.
                </p>
                <ul className="mt-4 divide-y divide-rule border-y border-rule">
                  {p.reports.map(r => (
                    <ReportRow key={r.id} report={r} />
                  ))}
                </ul>
              </>
            ) : (
              <div className="mt-4 border-y border-rule py-6">
                <p className="text-white">
                  The report for {p.name} hasn't been posted yet.
                </p>
                <p className="mt-1 text-steel">
                  <Link href="/contact" className="underline underline-offset-4 hover:text-white">
                    Send us the batch number
                  </Link>{" "}
                  from your jar and we'll email it to you.
                </p>
              </div>
            )}

            <p className="mt-8 max-w-2xl text-sm leading-relaxed text-steel">
              21+ only. Keep out of reach of children. Intended for inhalation;
              not for ingestion or topical use. May cause a user to fail a drug
              test. Do not drive or operate heavy machinery after use.
            </p>
          </section>
        </div>
      </div>

      {siblings.length > 0 && (
        <section className="container border-t border-rule pt-12">
          <h2 className="text-4xl text-white md:text-5xl">
            More from {p.collection}
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 xl:grid-cols-5">
            {siblings.map(s => (
              <ProductCard key={s.id} product={s} />
            ))}
          </div>
        </section>
      )}
    </PublicLayout>
  );
}
