export function getPcPartsApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_PC_PARTS_API_URL ?? "http://localhost:4000";
  return raw.replace(/\/$/, "");
}

/** Populated row for UI — supports legacy flat docs and ref-based + fpsAvg docs. */
export interface PcPartsBenchmark {
  _id: string;
  cpu: string;
  gpu: string;
  ram: string;
  /** Scenario / title (game name, or derived label when API has no game). */
  game: string;
  resolution: string;
  settings: string;
  fps: number;
  testDate: string;
  notes?: string;
  source?: string;
  /** Short label for charts (avoids duplicate long GPU names). */
  chartLabel: string;
}

export interface PcPartsBenchmarksResponse {
  success: boolean;
  data: unknown[];
  count: number;
  total: number;
  page: number;
  pages: number;
  message?: string;
}

export interface PcPartsPart {
  _id: string;
  name: string;
  type: string;
  price: number;
  brand: string;
  description?: string;
  imageUrl?: string;
  specifications?: Record<string, unknown>;
}

export interface PcPartsPartsResponse {
  success: boolean;
  data: PcPartsPart[];
  count: number;
  total: number;
  page: number;
  pages: number;
  message?: string;
}

/** Name from `{ name }` subdocs, string fields, or product-style refs. */
function refName(ref: unknown): string {
  if (ref && typeof ref === "object" && "name" in ref) {
    const n = (ref as { name?: unknown }).name;
    if (typeof n === "string") return n.trim();
  }
  return "";
}

/** `game` may be a string, `{ name, slug, category }`, or absent (use gameRef). */
function gameTitleFromRaw(r: Record<string, unknown>): string {
  const g = r.game;
  if (typeof g === "string" && g.trim()) return g.trim();
  if (g && typeof g === "object") {
    const n = refName(g);
    if (n) return n;
  }
  return pickStr(refName(r.gameRef), r.title);
}

function pickStr(...candidates: unknown[]): string {
  for (const c of candidates) {
    if (typeof c === "string" && c.trim()) return c.trim();
  }
  return "";
}

function normalizeResolution(res: string): string {
  const s = res.trim();
  if (s.toLowerCase() === "4k") return "4K";
  return s;
}

/** Map varied API / Mongo shapes to a single UI model. */
export function normalizeBenchmarkRow(raw: unknown): PcPartsBenchmark {
  const r = raw as Record<string, unknown>;
  const _id = pickStr(r._id, r.id) || "unknown";
  const cpu = pickStr(r.cpu, refName(r.cpuRef));
  const gpu = pickStr(r.gpu, refName(r.gpuRef));
  const ram = pickStr(r.ram, refName(r.ramRef));
  const gameTitle = gameTitleFromRaw(r);
  const preset = pickStr(r.preset);
  const settings = pickStr(r.settings) || preset;
  const resolution = normalizeResolution(pickStr(r.resolution));
  const fpsRaw = r.fps ?? r.fpsAvg;
  const fps =
    typeof fpsRaw === "number" && !Number.isNaN(fpsRaw)
      ? fpsRaw
      : typeof fpsRaw === "string"
        ? Number.parseFloat(fpsRaw) || 0
        : 0;
  const testDate =
    pickStr(r.testDate) ||
    (typeof r.createdAt === "string" ? r.createdAt.slice(0, 10) : "") ||
    (typeof r.updatedAt === "string" ? r.updatedAt.slice(0, 10) : "");
  const source = pickStr(r.source);

  const scenario = (() => {
    if (gameTitle) return gameTitle;
    if (preset) return `Preset: ${preset}`;
    if (source && source.toLowerCase() !== "estimated") return `Source (${source})`;
    if (source) return "Estimated";
    return "Performance row";
  })();

  const gpuShort = gpu.length > 28 ? `${gpu.slice(0, 26)}…` : gpu;
  const chartLabel = [
    gameTitle || null,
    gpuShort,
    resolution,
    preset || settings || source,
  ]
    .filter(Boolean)
    .join(" · ");

  return {
    _id,
    cpu,
    gpu,
    ram,
    game: scenario,
    resolution,
    settings,
    fps,
    testDate,
    notes: typeof r.notes === "string" ? r.notes : undefined,
    source: source || undefined,
    chartLabel: chartLabel || `${resolution || "—"} row`,
  };
}

function toSearchParams(
  params: Record<string, string | number | undefined>,
): string {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "") continue;
    sp.set(key, String(value));
  }
  const q = sp.toString();
  return q ? `?${q}` : "";
}

async function pcPartsGet<T>(path: string): Promise<T> {
  const url = `${getPcPartsApiBaseUrl()}${path}`;
  const res = await fetch(url, { cache: "no-store" });
  const text = await res.text();
  let body: unknown;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(`PC Parts API: invalid JSON (${res.status})`);
  }
  if (!res.ok) {
    const msg =
      typeof body === "object" && body !== null && "message" in body
        ? String((body as { message?: string }).message)
        : text;
    throw new Error(`PC Parts API ${res.status}: ${msg || res.statusText}`);
  }
  return body as T;
}

/** Distinct non-empty strings, stable sort */
function uniqueSorted(values: (string | undefined | null)[]): string[] {
  const normalized = values
    .filter((v): v is string => typeof v === "string")
    .map((v) => v.trim())
    .filter(Boolean);
  return [...new Set(normalized)].sort((a, b) => a.localeCompare(b));
}

const PARTS_PAGE_LIMIT = 100;
const MAX_PART_PAGES = 80;

function rawPreset(raw: unknown): string {
  if (raw && typeof raw === "object" && "preset" in raw) {
    const p = (raw as { preset?: unknown }).preset;
    if (typeof p === "string") return p.trim();
  }
  return "";
}

function rawGameName(raw: unknown): string {
  if (!raw || typeof raw !== "object") return "";
  return gameTitleFromRaw(raw as Record<string, unknown>);
}

/** Sample several benchmark pages so game / preset facets are not stuck on page 1 only. */
function stratifiedBenchmarkPages(totalPages: number): number[] {
  const p = Math.max(1, Math.floor(totalPages));
  if (p <= 1) return [1];
  const pick = new Set([
    1,
    2,
    3,
    4,
    5,
    p,
    Math.max(1, Math.ceil(p * 0.25)),
    Math.max(1, Math.ceil(p * 0.5)),
    Math.max(1, Math.ceil(p * 0.75)),
  ]);
  return [...pick].filter((x) => x >= 1 && x <= p).sort((a, b) => a - b);
}

async function fetchGamesAndPresetsFromBenchmarks(): Promise<{
  games: string[];
  presets: string[];
}> {
  const limit = PARTS_PAGE_LIMIT;
  const first = await pcPartsGet<PcPartsBenchmarksResponse>(
    `/api/benchmarks${toSearchParams({ page: 1, limit })}`,
  );
  const allRaw: unknown[] = Array.isArray(first.data) ? [...first.data] : [];
  const pages =
    typeof first.pages === "number" && first.pages > 0
      ? first.pages
      : typeof first.total === "number" && first.total > 0
        ? Math.max(1, Math.ceil(first.total / limit))
        : 1;

  const extraPages = stratifiedBenchmarkPages(pages).filter((pg) => pg !== 1);
  const chunks = await Promise.all(
    extraPages.map((page) =>
      pcPartsGet<PcPartsBenchmarksResponse>(
        `/api/benchmarks${toSearchParams({ page, limit })}`,
      ).then((r) => (Array.isArray(r.data) ? r.data : [])),
    ),
  );
  for (const c of chunks) allRaw.push(...c);

  return {
    games: uniqueSorted(allRaw.map(rawGameName)),
    presets: uniqueSorted(allRaw.map(rawPreset)),
  };
}

/** All parts for a type (paginated GET /api/parts?type=…). */
export async function fetchAllApiPartsByType(type: string): Promise<unknown[]> {
  const all: unknown[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const r = await pcPartsGet<PcPartsPartsResponse>(
      `/api/parts${toSearchParams({ type, page, limit: PARTS_PAGE_LIMIT })}`,
    );
    const rows = Array.isArray(r.data) ? r.data : [];
    all.push(...rows);
    totalPages =
      typeof r.pages === "number" && r.pages > 0
        ? r.pages
        : typeof r.total === "number" && r.total > 0
          ? Math.max(1, Math.ceil(r.total / PARTS_PAGE_LIMIT))
          : page;
    page++;
  } while (page <= totalPages && page <= MAX_PART_PAGES);

  return all;
}

/** All part `name` values for a type (paginated GET /api/parts?type=…). */
async function fetchAllPartNamesByType(type: string): Promise<string[]> {
  const rows = await fetchAllApiPartsByType(type);
  const names = rows
    .map((p) =>
      p && typeof p === "object" && "name" in p
        ? (p as { name?: unknown }).name
        : undefined,
    )
    .filter((n): n is string => typeof n === "string" && Boolean(n.trim()))
    .map((n) => n.trim());
  return uniqueSorted(names);
}

type FilterOptionsBundle = {
  popularCPUs: string[];
  popularGPUs: string[];
  popularRAMs: string[];
  popularGames: string[];
  popularPresets: string[];
};

const FILTER_OPTIONS_TTL_MS = 60_000;

let filterOptionsCache: { promise: Promise<FilterOptionsBundle>; expiresAt: number } | null =
  null;

function getBenchmarkFilterOptions(): Promise<FilterOptionsBundle> {
  const now = Date.now();
  if (!filterOptionsCache || filterOptionsCache.expiresAt <= now) {
    const promise = (async (): Promise<FilterOptionsBundle> => {
      const [popularCPUs, popularGPUs, popularRAMs, gamesAndPresets, partGameNames] =
        await Promise.all([
          fetchAllPartNamesByType("cpu"),
          fetchAllPartNamesByType("gpu"),
          fetchAllPartNamesByType("ram"),
          fetchGamesAndPresetsFromBenchmarks(),
          fetchAllPartNamesByType("game").catch(() => [] as string[]),
        ]);

      const popularGames = uniqueSorted([...gamesAndPresets.games, ...partGameNames]);

      return {
        popularCPUs,
        popularGPUs,
        popularRAMs,
        popularGames,
        popularPresets: gamesAndPresets.presets,
      };
    })();

    filterOptionsCache = { promise, expiresAt: now + FILTER_OPTIONS_TTL_MS };
  }
  return filterOptionsCache.promise;
}

export interface BenchmarkViewerPayload {
  benchmarks: {
    items: PcPartsBenchmark[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  popularCPUs: string[];
  popularGPUs: string[];
  popularRAMs: string[];
  popularGames: string[];
  popularPresets: string[];
}

/** Benchmark rows for the PC builder (cpu + gpu + ram required). */
export async function fetchBuildBenchmarks(params: {
  cpu: string;
  gpu: string;
  ram: string;
  limit?: number;
}): Promise<PcPartsBenchmark[]> {
  const list = await pcPartsGet<PcPartsBenchmarksResponse>(
    `/api/benchmarks${toSearchParams({
      cpu: params.cpu,
      gpu: params.gpu,
      ram: params.ram,
      page: 1,
      limit: params.limit ?? 80,
    })}`,
  );

  if (!list.success || !Array.isArray(list.data)) {
    throw new Error(list.message || "Invalid benchmarks response");
  }

  return list.data.map(normalizeBenchmarkRow);
}

export async function fetchBenchmarkViewerData(filters: {
  cpu?: string;
  gpu?: string;
  ram?: string;
  game?: string;
  preset?: string;
  resolution?: string;
  settings?: string;
  minFps?: number;
  page?: number;
  limit?: number;
}): Promise<BenchmarkViewerPayload> {
  const limit = filters.limit ?? 50;
  const page = filters.page ?? 1;

  const listParams: Record<string, string | number | undefined> = {
    cpu: filters.cpu,
    gpu: filters.gpu,
    ram: filters.ram,
    game: filters.game,
    preset: filters.preset,
    resolution: filters.resolution,
    settings: filters.settings,
    minFps: filters.minFps,
    page,
    limit,
  };

  const [list, popular] = await Promise.all([
    pcPartsGet<PcPartsBenchmarksResponse>(
      `/api/benchmarks${toSearchParams(listParams)}`,
    ),
    getBenchmarkFilterOptions(),
  ]);

  if (!list.success || !Array.isArray(list.data)) {
    throw new Error(list.message || "Invalid benchmarks response");
  }

  const items = list.data.map(normalizeBenchmarkRow);

  const gamesFromThisResponse = uniqueSorted(
    list.data.map((row) => gameTitleFromRaw(row as Record<string, unknown>)),
  );

  const popularGames = uniqueSorted([...popular.popularGames, ...gamesFromThisResponse]);

  return {
    benchmarks: {
      items,
      total: list.total,
      page: list.page,
      pageSize: limit,
      totalPages: list.pages,
    },
    popularCPUs: popular.popularCPUs,
    popularGPUs: popular.popularGPUs,
    popularRAMs: popular.popularRAMs,
    popularGames,
    popularPresets: popular.popularPresets,
  };
}

export async function fetchParts(params: {
  type?: string;
  brand?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}): Promise<PcPartsPartsResponse> {
  const path = `/api/parts${toSearchParams({
    type: params.type,
    brand: params.brand,
    search: params.search,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    page: params.page ?? 1,
    limit: params.limit ?? 100,
  })}`;
  return pcPartsGet<PcPartsPartsResponse>(path);
}
