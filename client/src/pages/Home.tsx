import { Jar } from "@/components/Jar";
import { PublicLayout } from "@/components/PublicLayout";
import { ReelVideo } from "@/components/ReelVideo";
import {
  accentStyle,
  strainLabel,
  useTitle,
  type CatalogProduct,
  type PublicVideo,
} from "@/lib/catalog";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { groupByLine, lineSlug } from "@shared/lines";
import {
  Crown,
  FlaskConical,
  Gem,
  Hand,
  Home as HomeIcon,
  Leaf,
  Lock,
  Search,
  Sprout,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";

/** Two strains from each line, interleaved, so the hero walks the whole range. */
function heroPicks(products: CatalogProduct[]): CatalogProduct[] {
  const groups = groupByLine(products).map(g => g.items);
  const picks: CatalogProduct[] = [];
  for (const offset of [0, 3]) {
    for (const items of groups) {
      const item = items[offset] ?? items[0];
      if (item && !picks.includes(item)) picks.push(item);
    }
  }
  return picks.slice(0, 8);
}

export default function Home() {
  useTitle("");
  const products = trpc.catalog.publicProducts.useQuery();
  const videos = trpc.videos.publicList.useQuery();

  const all = products.data ?? [];
  const picks = useMemo(() => heroPicks(all), [all]);
  const heroVideo = videos.data?.find(v => v.featured) ?? null;
  const reels = (videos.data ?? []).filter(v => !v.featured);

  return (
    <PublicLayout>
      <Hero picks={picks} video={heroVideo} loading={products.isLoading} />
      <Standards />
      <Lineup products={all} loading={products.isLoading} />
      {reels.length > 0 && <Reels videos={reels} />}
      <ReportFinder />
    </PublicLayout>
  );
}

/* ─── Hero ──────────────────────────────────────────────────────────────────
   The jar is the hero. It cycles through the range and the whole section
   takes that strain's colour, which is the one idea the label is built on. */

function Hero({
  picks,
  video,
  loading,
}: {
  picks: CatalogProduct[];
  video: PublicVideo | null;
  loading: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const current = picks[index % Math.max(picks.length, 1)];

  useEffect(() => {
    if (paused || picks.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(
      () => setIndex(i => (i + 1) % picks.length),
      4200
    );
    return () => window.clearInterval(timer);
  }, [paused, picks.length]);

  return (
    <section
      className="texture relative overflow-hidden border-b border-rule"
      style={accentStyle(current?.accentColor)}
    >
      <div className="container grid items-center gap-10 py-12 md:py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-6 lg:py-20">
        <div>
          <h1 className="text-balance text-[3.6rem] leading-[0.9] text-white sm:text-7xl xl:text-[6.25rem]">
            Exotic flower, with the lab report to prove it.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-steel md:text-xl">
            Indoor-grown, hand-trimmed hemp flower in jars, pre-rolls and hash
            holes. Every batch is lab tested. Search yours by strain or batch
            number.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/products" className="btn btn-solid">
              See the lineup
            </Link>
            <Link href="/lab-reports" className="btn btn-line">
              Find a lab report
            </Link>
          </div>
        </div>

        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          {video ? (
            <div className="relative mx-auto w-full max-w-[400px]">
              <div className="hud">
                <div className="hud-in">
                  <ReelVideo
                    src={video.fileUrl}
                    poster={video.posterUrl}
                    title={video.title}
                  />
                </div>
              </div>
              {current && (
                <Link
                  href={`/products/${current.slug}`}
                  className="absolute -bottom-6 -left-6 block w-[46%] sm:-left-16"
                  aria-label={`${current.name}, ${strainLabel(current.strain)}`}
                >
                  <Jar
                    key={current.id}
                    src={current.imageUrl}
                    alt=""
                    eager
                    className="jar-in"
                  />
                </Link>
              )}
            </div>
          ) : current ? (
            <Link
              href={`/products/${current.slug}`}
              className="mx-auto block w-full max-w-[520px] text-center"
            >
              <Jar
                key={current.id}
                src={current.imageUrl}
                alt={`${current.name} jar`}
                eager
                className="jar-in mx-auto w-[82%]"
              />
              <span className="plate -mt-2">
                <span className="plate-in text-3xl text-white sm:text-4xl">
                  {current.name}
                </span>
              </span>
              <span className="mt-3 block font-cond text-lg uppercase tracking-[0.1em] text-steel">
                <span className="font-semibold text-accent">
                  {strainLabel(current.strain)}
                </span>
                {current.collection && <> &nbsp;/&nbsp; {current.collection}</>}
              </span>
            </Link>
          ) : (
            <div className="mx-auto aspect-square w-full max-w-[520px]" aria-hidden>
              {!loading && <div className="glow h-full w-full" />}
            </div>
          )}

          {picks.length > 1 && (
            <div
              className={cn(
                "mt-7 flex flex-wrap justify-center gap-2",
                video && "mt-12"
              )}
              role="group"
              aria-label="Choose a strain"
            >
              {picks.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={p.name}
                  aria-pressed={i === index}
                  style={accentStyle(p.accentColor)}
                  className={cn(
                    "h-3 w-9 transition-all duration-300",
                    i === index ? "bg-accent" : "bg-white/20 hover:bg-white/45"
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="tick-rule transition-all duration-500" aria-hidden />
    </section>
  );
}

/* ─── Standards ─────────────────────────────────────────────────────────────
   The six marks printed on every label, in the label's own words. */

const STANDARDS = [
  { icon: Gem, label: "Premium flower" },
  { icon: Crown, label: "Top shelf" },
  { icon: HomeIcon, label: "Indoor grown" },
  { icon: Hand, label: "Hand trimmed" },
  { icon: Sprout, label: "Small batch" },
  { icon: FlaskConical, label: "Lab tested" },
];

function Standards() {
  return (
    <section aria-label="What's on every label" className="border-b border-rule">
      <ul className="container grid grid-cols-2 gap-y-6 py-8 sm:grid-cols-3 lg:grid-cols-6">
        {STANDARDS.map(s => (
          <li
            key={s.label}
            className="flex items-center gap-3 font-display text-xl font-bold uppercase text-white lg:justify-center"
          >
            <s.icon className="h-6 w-6 shrink-0 text-accent" strokeWidth={1.6} />
            {s.label}
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ─── Lineup ────────────────────────────────────────────────────────────── */

function Lineup({
  products,
  loading,
}: {
  products: CatalogProduct[];
  loading: boolean;
}) {
  const groups = groupByLine(products);

  return (
    <section className="container py-16 md:py-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="text-5xl text-white md:text-7xl">The lineup</h2>
        <Link
          href="/products"
          className="font-cond text-lg font-semibold uppercase tracking-wider text-steel underline decoration-white/30 underline-offset-[6px] hover:text-white"
        >
          All products
        </Link>
      </div>

      {loading ? (
        <p className="mt-10 text-steel">Loading the lineup…</p>
      ) : groups.length === 0 ? (
        <p className="mt-10 max-w-xl text-steel">
          The lineup is being loaded. Check back shortly.
        </p>
      ) : (
        <div className="mt-10 space-y-14 md:space-y-20">
          {groups.map(group => (
            <div key={group.name} className="border-t border-rule pt-8">
              <div>
                <div className="flex flex-col gap-x-10 gap-y-2 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <h3 className="text-4xl text-white md:text-6xl">
                      <Link
                        href={`/products?line=${lineSlug(group.name)}`}
                        className="hover:text-accent"
                      >
                        {group.name}
                      </Link>
                    </h3>
                    {group.info && (
                      <p className="mt-2 font-cond text-lg font-semibold uppercase tracking-wider text-steel">
                        {group.info.format}
                      </p>
                    )}
                  </div>
                  {group.info && (
                    <p className="max-w-md text-steel lg:text-right">{group.info.blurb}</p>
                  )}
                </div>

                <ul className="no-scrollbar -mx-5 mt-6 flex snap-x gap-2 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-x-4 md:gap-y-8 md:overflow-visible md:px-0 lg:grid-cols-6">
                  {group.items.map(p => (
                    <li
                      key={p.id}
                      className="w-[42vw] max-w-[190px] shrink-0 snap-start md:w-auto md:max-w-none"
                      style={accentStyle(p.accentColor)}
                    >
                      <Link href={`/products/${p.slug}`} className="group block text-center">
                        <Jar
                          src={p.imageUrl}
                          alt={`${p.name} jar`}
                          className="transition-transform duration-300 ease-out group-hover:-translate-y-1.5"
                        />
                        <span className="mt-1 block font-display text-2xl font-extrabold uppercase leading-none text-white group-hover:text-accent">
                          {p.name}
                        </span>
                        <span className="mt-1.5 block font-cond text-[0.95rem] font-semibold uppercase tracking-wider text-accent">
                          {strainLabel(p.strain)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* ─── Reels ─────────────────────────────────────────────────────────────── */

function Reels({ videos }: { videos: PublicVideo[] }) {
  return (
    <section className="border-y border-rule bg-panel py-16 md:py-20">
      <div className="container">
        <h2 className="text-5xl text-white md:text-7xl">On camera</h2>
      </div>
      <ul className="no-scrollbar container mt-8 flex snap-x gap-4 overflow-x-auto pb-2">
        {videos.map(v => (
          <li key={v.id} className="w-[68vw] max-w-[300px] shrink-0 snap-start">
            <div className="hud hud-quiet">
              <div className="hud-in">
                <ReelVideo src={v.fileUrl} poster={v.posterUrl} title={v.title} />
              </div>
            </div>
            <p className="mt-3 font-cond text-lg font-semibold uppercase tracking-wider text-white">
              {v.title}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ─── Report finder ─────────────────────────────────────────────────────── */

const LABEL_MARKS = [
  { icon: Leaf, label: "100% hemp flower" },
  { icon: FlaskConical, label: "No delta-8" },
  { icon: Gem, label: "Under 0.3% delta-9 THC" },
  { icon: Lock, label: "Child-resistant packaging" },
];

function ReportFinder() {
  const [, navigate] = useLocation();
  const [query, setQuery] = useState("");

  return (
    <section className="container pt-16 md:pt-24">
      <div className="hud">
        <div className="hud-in texture grid gap-10 px-6 py-10 md:px-12 md:py-14 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div>
            <h2 className="text-balance text-5xl text-white md:text-6xl">
              Got a jar in your hand?
            </h2>
            <p className="mt-4 max-w-lg text-lg text-steel">
              Type the strain, or the batch number printed next to the QR code,
              and read the certificate of analysis for that batch.
            </p>
            <form
              className="mt-7 flex max-w-lg flex-col gap-3 sm:flex-row"
              onSubmit={e => {
                e.preventDefault();
                const q = query.trim();
                navigate(q ? `/lab-reports?q=${encodeURIComponent(q)}` : "/lab-reports");
              }}
            >
              <label className="sr-only" htmlFor="home-report-search">
                Strain or batch number
              </label>
              <input
                id="home-report-search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Sour Diesel, or 082601"
                className="field flex-1"
              />
              <button type="submit" className="btn btn-accent">
                <Search className="h-4.5 w-4.5" />
                Find report
              </button>
            </form>
          </div>

          <ul className="space-y-4 border-rule lg:border-l lg:pl-10">
            {LABEL_MARKS.map(m => (
              <li
                key={m.label}
                className="flex items-center gap-3.5 font-cond text-xl font-semibold uppercase tracking-wide text-white"
              >
                <m.icon className="h-6 w-6 shrink-0 text-accent" strokeWidth={1.6} />
                {m.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
