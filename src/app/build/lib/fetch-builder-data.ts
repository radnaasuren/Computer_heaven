import { apiPartsToBuilderCatalog } from "@/app/build/lib/map-api-parts";
import type { PartsMockData } from "@/app/build/types/parts";
import { fetchAllApiPartsByType } from "@/lib/pc-parts-api";

const BUILDER_PART_TYPES = [
  "cpu",
  "gpu",
  "ram",
  "motherboard",
  "psu",
  "case",
  "cooler",
  "fan",
  "storage",
] as const;

export async function fetchBuilderPartsCatalog(): Promise<PartsMockData> {
  const entries = await Promise.all(
    BUILDER_PART_TYPES.map(async (type) => {
      const rows = await fetchAllApiPartsByType(type);
      return [type, rows] as const;
    }),
  );

  const byType: Record<string, unknown[]> = {};
  let currency = "USD";
  for (const [type, rows] of entries) {
    byType[type] = rows;
    const first = rows[0];
    if (first && typeof first === "object" && first !== null && "currency" in first) {
      const c = (first as { currency?: unknown }).currency;
      if (typeof c === "string" && c.trim()) currency = c.trim();
    }
  }

  const catalog = apiPartsToBuilderCatalog(byType, currency);

  const empty = BUILDER_PART_TYPES.filter(
    (t) => catalog.parts[t].length === 0,
  );
  if (empty.length > 0) {
    throw new Error(
      `PC Parts API: no parts for ${empty.join(", ")}. Is the API running at ${process.env.NEXT_PUBLIC_PC_PARTS_API_URL ?? "http://localhost:4000"}?`,
    );
  }

  return catalog;
}
