import { PageHeader, PublicLayout } from "@/components/PublicLayout";
import { ProductCard } from "@/components/ProductCard";
import { strainLabel, useTitle } from "@/lib/catalog";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { STRAINS, type Strain } from "@shared/const";
import { groupByLine, lineSlug } from "@shared/lines";
import { useLocation, useSearch } from "wouter";

/**
 * Both filters live in the URL, not in state: a filtered view can be linked
 * from the home page ("?line=vice-city"), shared, and survives Back.
 */
export default function Products() {
  useTitle("Products");
  const [, navigate] = useLocation();
  const params = new URLSearchParams(useSearch());
  const line = params.get("line") ?? "";
  const strain = (STRAINS as readonly string[]).includes(params.get("strain") ?? "")
    ? (params.get("strain") as Strain)
    : "";

  const products = trpc.catalog.publicProducts.useQuery();
  const all = products.data ?? [];
  const allGroups = groupByLine(all);

  const groups = allGroups
    .filter(g => !line || lineSlug(g.name) === line)
    .map(g => ({
      ...g,
      items: g.items.filter(p => !strain || p.strain === strain),
    }))
    .filter(g => g.items.length > 0);

  const setFilter = (key: "line" | "strain", value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    const qs = next.toString();
    navigate(qs ? `/products?${qs}` : "/products", { replace: true });
  };

  return (
    <PublicLayout>
      <PageHeader title="Products">
        Four lines, six strains in each. Pick one to see what's in it and read
        its lab report.
      </PageHeader>

      <div className="container py-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <FilterRow
            label="Line"
            value={line}
            onChange={v => setFilter("line", v)}
            options={[
              { value: "", label: "All lines" },
              ...allGroups.map(g => ({ value: lineSlug(g.name), label: g.name })),
            ]}
          />
          <FilterRow
            label="Type"
            value={strain}
            onChange={v => setFilter("strain", v)}
            options={[
              { value: "", label: "All types" },
              ...STRAINS.map(s => ({ value: s, label: strainLabel(s) })),
            ]}
          />
        </div>

        {products.isLoading ? (
          <p className="mt-12 text-steel">Loading products…</p>
        ) : products.isError ? (
          <p className="mt-12 text-steel">
            The products couldn't be loaded. Reload the page to try again.
          </p>
        ) : groups.length === 0 ? (
          <div className="mt-12 max-w-xl">
            <p className="text-lg text-white">Nothing matches those two filters.</p>
            <button
              type="button"
              onClick={() => navigate("/products", { replace: true })}
              className="btn btn-line mt-5"
            >
              Show all products
            </button>
          </div>
        ) : (
          <div className="mt-12 space-y-16">
            {groups.map(group => (
              <section key={group.name} aria-labelledby={`line-${lineSlug(group.name)}`}>
                <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1 border-b border-rule pb-4">
                  <h2
                    id={`line-${lineSlug(group.name)}`}
                    className="text-4xl text-white md:text-5xl"
                  >
                    {group.name}
                  </h2>
                  {group.info && (
                    <p className="font-cond text-lg font-semibold uppercase tracking-wider text-steel">
                      {group.info.format}
                    </p>
                  )}
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
                  {group.items.map(p => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}

function FilterRow({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map(o => (
        <button
          key={o.value || "all"}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "px-4 py-2 font-cond text-base font-semibold uppercase tracking-wider transition-colors",
            value === o.value
              ? "bg-white text-black"
              : "bg-white/[0.07] text-steel hover:bg-white/15 hover:text-white"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
