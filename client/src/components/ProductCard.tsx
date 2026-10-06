import { Jar } from "@/components/Jar";
import { accentStyle, strainLabel, type CatalogProduct } from "@/lib/catalog";
import { Link } from "wouter";

export function ProductCard({ product }: { product: CatalogProduct }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      style={accentStyle(product.accentColor)}
      className="group block"
    >
      <div className="hud hud-quiet transition-colors duration-200 group-hover:bg-accent group-focus-visible:bg-accent">
        <div className="hud-in px-4 pb-5 pt-3">
          <Jar
            src={product.imageUrl}
            alt={`${product.name} jar`}
            className="mx-auto w-full max-w-[260px]"
          />
          <h3 className="mt-1 text-[1.7rem] text-white">{product.name}</h3>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-2.5 font-cond text-[0.95rem] uppercase tracking-wider text-steel">
            {product.strain && (
              <span className="font-semibold text-accent">
                {strainLabel(product.strain)}
              </span>
            )}
            {product.subtitle && <span>{product.subtitle}</span>}
          </p>
        </div>
      </div>
    </Link>
  );
}
