import { PageHeader, PublicLayout } from "@/components/PublicLayout";
import { ReportRow } from "@/components/ReportRow";
import {
  accentStyle,
  strainLabel,
  useTitle,
  type ReportProduct,
} from "@/lib/catalog";
import { trpc } from "@/lib/trpc";
import { groupByLine } from "@shared/lines";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearch } from "wouter";

/** Letters and digits only, so "08-2601", "082601" and "#082601" all match. */
function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

/**
 * A product matches on its strain or line name; otherwise only the reports
 * whose batch or title match are kept. Searching a batch number therefore
 * narrows a strain with five batches down to the one in the visitor's hand.
 */
function filterProduct(product: ReportProduct, query: string): ReportProduct | null {
  // With no search every strain is listed, reported or not: the ones still
  // waiting on their certificate show a "Coming soon" tag instead.
  if (!query) return product;
  const byName = normalize(`${product.name} ${product.collection ?? ""}`).includes(query);
  if (byName) return product;
  const reports = product.reports.filter(r =>
    normalize(`${r.batch ?? ""} ${r.title}`).includes(query)
  );
  return reports.length > 0 ? { ...product, reports } : null;
}

export default function LabReports() {
  useTitle("Lab Reports");
  const initial = new URLSearchParams(useSearch()).get("q") ?? "";
  const [query, setQuery] = useState(initial);
  // The home page search lands here with ?q=…; a second search from there
  // must replace what is in the box, not be ignored because state already exists.
  useEffect(() => setQuery(initial), [initial]);

  const data = trpc.catalog.publicReports.useQuery();
  const all = data.data ?? [];
  const q = normalize(query);

  const matches = all
    .map(p => filterProduct(p, q))
    .filter((p): p is ReportProduct => p !== null);
  const groups = groupByLine(matches);

  return (
    <PublicLayout>
      <PageHeader title="Lab reports">
        Every batch is lab tested. Search by strain, or by the
        batch number printed next to the QR code on your jar.
      </PageHeader>

      <div className="container py-10">
        <div className="relative max-w-xl">
          <label htmlFor="report-search" className="sr-only">
            Strain or batch number
          </label>
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-steel"
            aria-hidden
          />
          <input
            id="report-search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Strain or batch number"
            className="field !pl-12 !pr-12 text-lg"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center text-steel hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="mt-10" aria-live="polite">
          {data.isLoading ? (
            <p className="text-steel">Loading reports…</p>
          ) : data.isError ? (
            <p className="text-steel">
              The reports couldn't be loaded. Reload the page to try again.
            </p>
          ) : all.length === 0 ? (
            <EmptyState title="Lab reports coming soon">
              The certificates of analysis are being uploaded. If you need one
              now,{" "}
              <Link href="/contact" className="underline underline-offset-4 hover:text-white">
                send us your batch number
              </Link>{" "}
              and we'll email it to you.
            </EmptyState>
          ) : groups.length === 0 ? (
            <EmptyState title={`No report matches "${query.trim()}"`}>
              Check the batch number on the jar: it's the six digits after
              "Batch #". You can also search by strain name, or{" "}
              <Link href="/contact" className="underline underline-offset-4 hover:text-white">
                ask us for the report
              </Link>
              .
            </EmptyState>
          ) : (
            <div className="space-y-14">
              {groups.map(group => (
                <section key={group.name}>
                  <h2 className="border-b border-rule pb-3 text-4xl text-white md:text-5xl">
                    {group.name}
                  </h2>
                  <ul>
                    {group.items.map(product => (
                      <li
                        key={product.id}
                        style={accentStyle(product.accentColor)}
                        className="grid gap-x-6 gap-y-2 border-b border-rule py-5 md:grid-cols-[250px_1fr]"
                      >
                        <Link
                          href={`/products/${product.slug}`}
                          className="group flex items-center gap-4 self-start"
                        >
                          {product.imageUrl && (
                            <img
                              src={product.imageUrl}
                              alt=""
                              loading="lazy"
                              className="h-16 w-16 shrink-0 object-contain"
                            />
                          )}
                          <span>
                            <span className="block font-display text-2xl font-extrabold uppercase leading-none text-white group-hover:text-accent">
                              {product.name}
                            </span>
                            <span className="mt-1 block font-cond text-base font-semibold uppercase tracking-wider text-accent">
                              {strainLabel(product.strain)}
                            </span>
                          </span>
                        </Link>

                        {product.reports.length > 0 ? (
                          <ul className="divide-y divide-rule">
                            {product.reports.map(r => (
                              <ReportRow key={r.id} report={r} />
                            ))}
                          </ul>
                        ) : (
                          <div className="flex flex-col gap-3 self-center sm:flex-row sm:items-center sm:justify-between">
                            <span className="plate self-start">
                              <span className="plate-in text-lg text-accent">
                                Coming soon
                              </span>
                            </span>
                            <p className="text-steel">
                              Need it now?{" "}
                              <Link
                                href="/contact"
                                className="underline underline-offset-4 hover:text-white"
                              >
                                Ask us for it
                              </Link>
                              .
                            </p>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}

function EmptyState({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="max-w-xl border-l-[3px] border-accent pl-5">
      <p className="text-xl font-semibold text-white">{title}</p>
      <p className="mt-2 text-steel">{children}</p>
    </div>
  );
}
