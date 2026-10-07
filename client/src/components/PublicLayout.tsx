import { AgeGate } from "@/components/AgeGate";
import { BackToTop } from "@/components/BackToTop";
import { Emblem, Wordmark } from "@/components/Logo";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { BRAND_NAME, DEFAULT_CONTACT } from "@shared/const";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState, type RefObject } from "react";
import { Link, useLocation } from "wouter";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Lab Reports", href: "/lab-reports" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

function isActive(location: string, href: string) {
  return href === "/" ? location === "/" : location.startsWith(href);
}

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const footerRef = useRef<HTMLElement | null>(null);

  // A link in the mobile menu changes the route; the menu shouldn't stay up.
  useEffect(() => setOpen(false), [location]);

  return (
    <div className="flex min-h-screen flex-col">
      <AgeGate />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:bg-white focus:px-4 focus:py-2 focus:text-black"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-50 border-b border-rule bg-black/90 backdrop-blur-md">
        <div className="container flex h-[68px] items-center justify-between gap-6">
          <Link
            href="/"
            aria-label={`${BRAND_NAME} home`}
            className="flex items-center gap-3 text-white"
          >
            <Emblem className="h-9" />
            <Wordmark className="h-7 sm:h-8" />
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            {NAV.map(item => {
              const active = isActive(location, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative px-3.5 py-2 font-cond text-[1.0625rem] font-semibold uppercase tracking-[0.08em] transition-colors",
                    active ? "text-white" : "text-steel hover:text-white"
                  )}
                >
                  {item.label}
                  {active && (
                    <span
                      className="absolute inset-x-3.5 -bottom-[15px] h-[3px] bg-accent"
                      aria-hidden
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center text-white lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(o => !o)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {open && (
          <nav
            id="mobile-nav"
            aria-label="Main"
            className="border-t border-rule bg-black lg:hidden"
          >
            <div className="container flex flex-col py-3">
              {NAV.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(location, item.href) ? "page" : undefined}
                  className={cn(
                    "border-b border-rule py-4 font-display text-3xl font-extrabold uppercase last:border-b-0",
                    isActive(location, item.href) ? "text-accent" : "text-white"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>

      <main id="main" className="flex-1">
        {children}
      </main>

      <SiteFooter footerRef={footerRef} />
      <BackToTop footerRef={footerRef} />
    </div>
  );
}

function SiteFooter({
  footerRef,
}: {
  footerRef: RefObject<HTMLElement | null>;
}) {
  const details = trpc.site.contactDetails.useQuery().data ?? DEFAULT_CONTACT;

  return (
    <footer ref={footerRef} className="texture mt-24 border-t border-rule">
      <div className="container py-14">
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3 text-white">
              <Emblem className="h-12" />
              <Wordmark className="h-10" />
            </div>
            <p className="mt-5 max-w-sm text-steel">
              Indoor-grown, hand-trimmed hemp flower. Lab tested by the batch.
            </p>
            <div className="mt-6 inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-signal font-display text-base font-black text-black">
                21+
              </span>
              <span className="font-cond text-base uppercase tracking-wider text-white">
                Adults only
              </span>
            </div>
          </div>

          <nav aria-label="Footer">
            <h2 className="font-cond text-base font-semibold tracking-[0.12em] text-steel">
              Site
            </h2>
            <ul className="mt-4 space-y-2.5">
              {NAV.map(item => (
                <li key={item.href}>
                  <Link href={item.href} className="text-white hover:text-accent">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-cond text-base font-semibold tracking-[0.12em] text-steel">
              Manufactured by
            </h2>
            <address className="mt-4 space-y-2.5 not-italic text-white">
              <p>{details.company}</p>
              {details.address && <p className="text-steel">{details.address}</p>}
              {details.email && (
                <p>
                  <a href={`mailto:${details.email}`} className="hover:text-accent">
                    {details.email}
                  </a>
                </p>
              )}
              {details.phone && (
                <p>
                  <a
                    href={`tel:${details.phone.replace(/[^\d+]/g, "")}`}
                    className="hover:text-accent"
                  >
                    {details.phone}
                  </a>
                </p>
              )}
              {details.instagram && (
                <p>
                  <a
                    href={details.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent"
                  >
                    Instagram
                  </a>
                </p>
              )}
            </address>
          </div>
        </div>

        <div className="mt-12 border-t border-rule pt-8 text-sm leading-relaxed text-steel">
          <p className="max-w-4xl">
            These products contain hemp-derived cannabinoids and are within the
            legal limit of less than 0.3% delta-9 THC. Keep out of reach of
            children. Products may contain tetrahydrocannabinol (THC) and can
            cause a user to fail a drug test. All THCs have psychoactive
            properties. Pregnant or nursing women should consult a healthcare
            provider before use. Do not drive or operate heavy machinery after
            use. Intended for inhalation; not for ingestion or topical use.
            These products have not been evaluated by the FDA.
          </p>
          <p className="mt-5">
            © {new Date().getFullYear()} {details.company}. For adults 21 and
            older.
          </p>
        </div>
      </div>
    </footer>
  );
}

/** Shared page heading: the stencil title over the label's segmented rule. */
export function PageHeader({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="texture border-b border-rule">
      <div className="container pb-10 pt-14 md:pb-14 md:pt-20">
        <h1 className="text-balance text-6xl text-white md:text-8xl">{title}</h1>
        {children && (
          <p className="mt-5 max-w-2xl text-lg text-steel md:text-xl">{children}</p>
        )}
      </div>
      <div className="tick-rule" aria-hidden />
    </div>
  );
}
