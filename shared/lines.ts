/**
 * The product lines, in the order the site shows them.
 *
 * A line is just the `collection` text on a product; this file only adds the
 * order and the one sentence of copy each line gets on the public pages. A
 * line created from the admin that isn't listed here still shows up, after
 * these, without a blurb.
 */
export type LineInfo = {
  name: string;
  /** Used in the URL filter on the Products page. */
  slug: string;
  /** Short format line shown next to the name. */
  format: string;
  blurb: string;
};

export const LINES: LineInfo[] = [
  {
    name: "Powdered Donuts",
    slug: "powdered-donuts",
    format: "Indoor exotic pre-rolls",
    blurb:
      "Indoor exotic flower rolled and finished with a powdered coat. Six strains, each in its own tube.",
  },
  {
    name: "THC Hash Holes",
    slug: "thc-hash-holes",
    format: "10 count · 2.5G per pre-roll",
    blurb:
      "Ten 2.5-gram hash hole pre-rolls to a tube, rolled from indoor exotic flower.",
  },
  {
    name: "Exotic Flower 28G",
    slug: "flower-28g",
    format: "28 one-gram jars · 1 oz total",
    blurb:
      "An ounce of hand-trimmed indoor flower, portioned into twenty-eight one-gram jars.",
  },
  {
    name: "Vice City Edition",
    slug: "vice-city",
    format: "3.5G flower jar",
    blurb:
      "Eighths of exotic flower in the jars with the skyline on them. Six strains.",
  },
];

export function lineInfo(name: string | null | undefined): LineInfo | null {
  if (!name) return null;
  return LINES.find(l => l.name.toLowerCase() === name.toLowerCase()) ?? null;
}

export function lineSlug(name: string | null | undefined): string {
  const known = lineInfo(name);
  if (known) return known.slug;
  return (name ?? "other")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Groups products by line, known lines first in the order above, then any
 * others alphabetically. Products without a line land in a final "Other" group.
 */
export function groupByLine<T extends { collection: string | null }>(
  items: T[]
): { name: string; info: LineInfo | null; items: T[] }[] {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const key = item.collection?.trim() || "Other";
    const list = groups.get(key) ?? [];
    list.push(item);
    groups.set(key, list);
  }
  const rank = (name: string) => {
    const at = LINES.findIndex(
      l => l.name.toLowerCase() === name.toLowerCase()
    );
    if (at !== -1) return at;
    return name === "Other" ? Number.MAX_SAFE_INTEGER : LINES.length;
  };
  return Array.from(groups.entries())
    .sort(([a], [b]) => rank(a) - rank(b) || a.localeCompare(b))
    .map(([name, list]) => ({ name, info: lineInfo(name), items: list }));
}
