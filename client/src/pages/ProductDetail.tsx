import { Jar } from "@/components/Jar";
import { ProductCard } from "@/components/ProductCard";
import { PublicLayout } from "@/components/PublicLayout";
import { accentStyle, strainLabel, useTitle } from "@/lib/catalog";
import { trpc } from "@/lib/trpc";
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
                {/* Reports live on the Lab Reports page; this opens it already
                    narrowed to this strain. */}
                <Link
                  href={`/lab-reports?q=${encodeURIComponent(p.name)}`}
                  className="btn btn-accent"
                >
                  {p.reports.length > 0 ? "Read the lab report" : "Lab report"}
                </Link>
                <Link href="/contact" className="btn btn-line">
                  Ask about this product
                </Link>
              </div>
            </div>
          </div>
          <div className="tick-rule" aria-hidden />
        </div>

      </div>

      {siblings.length > 0 && (
        <section className="container pt-14 md:pt-16">
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
