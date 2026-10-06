/**
 * Carga inicial del catálogo de Dominator: las 24 cepas de las cuatro líneas,
 * con la foto que viene en el repo (client/public/products) y los datos que
 * están impresos en las etiquetas.
 *
 * Es idempotente y aditivo. Un producto cuyo slug ya existe se deja tal cual,
 * así que correrlo contra una base que ya se editó desde el panel no puede
 * deshacer ese trabajo. Dos formas de correrlo, la misma lógica en las dos:
 *
 *   SEED_CATALOG=true                    (en Railway; corre una vez al arrancar)
 *   DATABASE_URL="…" pnpm seed           (desde una máquina que alcance la BD)
 *
 * No carga reportes de laboratorio: esos se suben desde /admin/lab-reports.
 */
import "dotenv/config";
import type { Strain } from "@shared/const";
import { LINES } from "@shared/lines";
import * as db from "./db";

type SeedProduct = {
  name: string;
  strain: Strain;
  accent: string;
  /** Líneas extra de "Product facts", propias de esta cepa. */
  facts?: string[];
};

type SeedLine = {
  /** Debe coincidir con un nombre de shared/lines.ts. */
  collection: string;
  slugPrefix: string;
  subtitle: string;
  describe: (name: string, strain: Strain) => string;
  facts: string[];
  products: SeedProduct[];
};

const COMPLIANCE_FACT = "Delta-9 THC: <0.3% on a dry weight basis";

/** Los valores del panel "Product Facts" de la etiqueta de 28G, por porción. */
function flowerFacts(cbd: string, cbg: string, d9: string): string[] {
  return [
    `CBD per serving: ${cbd} mg`,
    `CBG per serving: ${cbg} mg`,
    `Delta-9 THC per serving: ${d9} mg`,
    "Total THC per serving: <10.0 mg",
  ];
}

const CATALOG: SeedLine[] = [
  {
    collection: "Powdered Donuts",
    slugPrefix: "powdered-donuts",
    subtitle: "Indoor exotic pre-rolls",
    describe: (name, strain) =>
      `${name} is one of the six Powdered Donuts: indoor exotic flower, rolled and finished with a powdered coat. It's the ${strain} pick of the line. Hemp-derived, with less than 0.3% delta-9 THC on a dry weight basis.`,
    facts: ["Format: Pre-rolls", COMPLIANCE_FACT],
    products: [
      { name: "Purple Tyrant", strain: "indica", accent: "#a335f2" },
      { name: "Midnight Gas", strain: "indica", accent: "#49e05a" },
      { name: "Electric Crown", strain: "sativa", accent: "#3d7bf2" },
      { name: "Jet Stream", strain: "sativa", accent: "#e6e22e" },
      { name: "God Mode", strain: "hybrid", accent: "#f23545" },
      { name: "Chrome Candy", strain: "hybrid", accent: "#f235a3" },
    ],
  },
  {
    collection: "THC Hash Holes",
    slugPrefix: "thc-hash-holes",
    subtitle: "10 count · 2.5G per pre-roll",
    describe: (name, strain) =>
      `${name} in the Hash Holes format: ten pre-rolls to a tube, 2.5 grams each, rolled from indoor exotic flower. ${strain === "hybrid" ? "A hybrid" : strain === "indica" ? "An indica" : "A sativa"}. Hemp-derived, with less than 0.3% delta-9 THC on a dry weight basis.`,
    facts: ["Count: 10 pre-rolls", "Per pre-roll: 2.5 G", COMPLIANCE_FACT],
    products: [
      { name: "Blackout Truffle", strain: "indica", accent: "#b48cf2" },
      { name: "Super Gas", strain: "indica", accent: "#f26a35" },
      { name: "Over Drive Haze", strain: "sativa", accent: "#f235a3" },
      { name: "Solar Flare", strain: "sativa", accent: "#2fd67b" },
      { name: "Blue Reign", strain: "hybrid", accent: "#3d5cf2" },
      { name: "Venom Zushi", strain: "hybrid", accent: "#f23545" },
    ],
  },
  {
    collection: "Exotic Flower 28G",
    slugPrefix: "flower-28g",
    subtitle: "28 one-gram jars · 1 oz total",
    describe: (name, strain) =>
      `A full ounce of ${name}, portioned into twenty-eight one-gram jars. Indoor grown, hand trimmed and packed in small batches. ${strain === "hybrid" ? "Hybrid" : strain === "indica" ? "Indica" : "Sativa"}. 100% hemp flower with no delta-8, under 0.3% delta-9 THC.`,
    facts: [
      "Serving size: 1 G (1000 mg)",
      "Servings per jar: 28",
      "Net weight: 28 G (1 oz)",
    ],
    products: [
      {
        name: "Mango Rush",
        strain: "sativa",
        accent: "#f2e235",
        facts: flowerFacts("32.91", "16.92", "2.91"),
      },
      {
        name: "Pineapple Rush",
        strain: "sativa",
        accent: "#3ddc68",
        facts: flowerFacts("33.56", "17.58", "2.56"),
      },
      {
        name: "Berry Cream",
        strain: "indica",
        accent: "#f235a3",
        facts: flowerFacts("33.29", "17.34", "2.29"),
      },
      {
        name: "Peach Cobbler",
        strain: "indica",
        accent: "#f28435",
        facts: flowerFacts("32.63", "16.67", "2.63"),
      },
      {
        name: "Strawberry Glaze",
        strain: "hybrid",
        accent: "#f23545",
        facts: flowerFacts("33.84", "17.81", "2.84"),
      },
      {
        name: "Sour Diesel",
        strain: "hybrid",
        accent: "#9b4be8",
        facts: flowerFacts("32.17", "16.23", "2.17"),
      },
    ],
  },
  {
    collection: "Vice City Edition",
    slugPrefix: "vice-city",
    subtitle: "3.5G flower jar",
    describe: (name, strain) =>
      `${name} from the Vice City Edition: an eighth of exotic flower in the skyline jar. ${strain === "hybrid" ? "Hybrid" : strain === "indica" ? "Indica" : "Sativa"}. Hemp-derived, with less than 0.3% delta-9 THC on a dry weight basis.`,
    facts: ["Net weight: 3.5 G (0.12 oz)", COMPLIANCE_FACT],
    products: [
      { name: "Vice City Kush", strain: "indica", accent: "#f235c3" },
      { name: "Wanted Level", strain: "indica", accent: "#35f245" },
      { name: "Five Star", strain: "sativa", accent: "#35e2f2" },
      { name: "Grand Theft Ganja", strain: "sativa", accent: "#f2a03d" },
      { name: "Los Santos OG", strain: "hybrid", accent: "#f2e235" },
      { name: "Busted", strain: "hybrid", accent: "#f2617a" },
    ],
  },
];

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function seedCatalog(): Promise<void> {
  let created = 0;

  for (const line of CATALOG) {
    // El orden de las líneas sale del mismo sitio que usa la web pública, para
    // que el panel y el sitio no puedan quedar ordenados distinto.
    const lineIndex = Math.max(
      0,
      LINES.findIndex(l => l.name === line.collection)
    );

    for (let i = 0; i < line.products.length; i++) {
      const p = line.products[i];
      const slug = `${line.slugPrefix}-${slugify(p.name)}`;

      if (await db.getProductBySlug(slug)) {
        console.log(`= ${line.collection} / ${p.name} (already present)`);
        continue;
      }

      await db.createProduct({
        slug,
        name: p.name,
        collection: line.collection,
        subtitle: line.subtitle,
        strain: p.strain,
        accentColor: p.accent,
        description: line.describe(p.name, p.strain),
        facts: [...line.facts, ...(p.facts ?? [])].join("\n"),
        // La foto viaja con el sitio, así que no hay clave de R2 que borrar.
        imageUrl: `/products/${slug}.webp`,
        imageKey: null,
        sortOrder: (lineIndex + 1) * 100 + i,
        published: true,
      });
      created++;
      console.log(`+ ${line.collection} / ${p.name}`);
    }
  }

  console.log(`[Seed] Done. ${created} product(s) added.`);
}

/**
 * Boot hook. Va detrás de SEED_CATALOG para que un redeploy no lo vuelva a
 * disparar en cada reinicio del contenedor: pones la variable, esperas el
 * deploy y la borras. Un fallo se registra y se traga: el catálogo es
 * contenido, y el sitio debe arrancar igual sin él.
 */
export async function seedCatalogIfRequested(): Promise<void> {
  if (process.env.SEED_CATALOG !== "true") return;
  try {
    console.log("[Seed] SEED_CATALOG is set — loading the Dominator catalogue…");
    await seedCatalog();
  } catch (err) {
    console.error("[Seed] FAILED — the site will start without it:", err);
  }
}

/** CLI entry point: `pnpm seed`. */
const isCli =
  process.argv[1]?.endsWith("seed.ts") || process.argv[1]?.endsWith("seed.js");
if (isCli) {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set.");
    process.exit(1);
  }
  seedCatalog()
    .then(() => process.exit(0))
    .catch(err => {
      console.error("Seed failed:", err);
      process.exit(1);
    });
}
