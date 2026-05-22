import { emptyBuilderSelection } from "@/app/build/lib/initial-parts";
import type {
  CasePart,
  CoolerPart,
  CpuPart,
  FanPart,
  GpuPart,
  MotherboardPart,
  PartsMockData,
  PsuPart,
  RamPart,
  StoragePart,
} from "@/app/build/types/parts";

function asRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" ? (v as Record<string, unknown>) : {};
}

function pickStr(...candidates: unknown[]): string {
  for (const c of candidates) {
    if (typeof c === "string" && c.trim()) return c.trim();
  }
  return "";
}

function numOrNull(...candidates: unknown[]): number | null {
  for (const v of candidates) {
    if (typeof v === "number" && !Number.isNaN(v)) return v;
    if (typeof v === "string" && v.trim()) {
      const n = Number.parseFloat(v);
      if (!Number.isNaN(n)) return n;
    }
  }
  return null;
}

function strList(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((x): x is string => typeof x === "string" && Boolean(x.trim()))
    .map((x) => x.trim());
}

function partId(raw: Record<string, unknown>): string {
  return pickStr(raw.id, raw._id);
}

function mapCpu(raw: unknown): CpuPart | null {
  const r = asRecord(raw);
  const id = partId(r);
  if (!id) return null;
  const s = asRecord(r.specs);
  const c = asRecord(r.compatibility);
  return {
    id,
    name: pickStr(r.name) || id,
    brand: pickStr(r.brand) || "—",
    socket: pickStr(s.socket, c.socket) || null,
    cores: numOrNull(s.cores),
    threads: numOrNull(s.threads),
    tdpWatts: numOrNull(s.tdpWatts),
    supportedMemoryTypes: strList(s.supportedMemoryTypes ?? c.supportedMemoryTypes),
    aggregatePerformanceScore: numOrNull(s.aggregatePerformanceScore),
    price: numOrNull(r.price) ?? 0,
  };
}

function mapGpu(raw: unknown): GpuPart | null {
  const r = asRecord(raw);
  const id = partId(r);
  if (!id) return null;
  const s = asRecord(r.specs);
  return {
    id,
    name: pickStr(r.name) || id,
    brand: pickStr(r.brand) || "—",
    vram: pickStr(s.vram) || null,
    lengthMm: numOrNull(s.lengthMm) ?? 0,
    tdpWatts: numOrNull(s.tdpWatts),
    aggregatePerformanceScore: numOrNull(s.aggregatePerformanceScore),
    price: numOrNull(r.price) ?? 0,
  };
}

function mapRam(raw: unknown): RamPart | null {
  const r = asRecord(raw);
  const id = partId(r);
  if (!id) return null;
  const s = asRecord(r.specs);
  const c = asRecord(r.compatibility);
  return {
    id,
    name: pickStr(r.name) || id,
    type: pickStr(s.memoryType, s.type, c.ramType) || "—",
    speed: pickStr(s.speed) || "—",
    capacity: pickStr(s.capacity) || "—",
    modules: pickStr(s.modules) || "—",
    price: numOrNull(r.price) ?? 0,
  };
}

function mapMotherboard(raw: unknown): MotherboardPart | null {
  const r = asRecord(raw);
  const id = partId(r);
  if (!id) return null;
  const s = asRecord(r.specs);
  const c = asRecord(r.compatibility);
  return {
    id,
    name: pickStr(r.name) || id,
    brand: pickStr(r.brand) || "—",
    socket: pickStr(s.socket, c.socket) || "—",
    chipset: pickStr(s.chipset) || "—",
    ramType: pickStr(s.ramType, c.ramType) || "—",
    formFactor: pickStr(s.formFactor, c.formFactor) || "—",
    price: numOrNull(r.price) ?? 0,
  };
}

function mapPsu(raw: unknown): PsuPart | null {
  const r = asRecord(raw);
  const id = partId(r);
  if (!id) return null;
  const s = asRecord(r.specs);
  const c = asRecord(r.compatibility);
  return {
    id,
    name: pickStr(r.name, s.name) || id,
    watt: numOrNull(s.watt, c.watt) ?? 0,
    efficiency: pickStr(s.efficiency) || "—",
    formFactor: pickStr(s.formFactor) || "—",
    modular: pickStr(s.modular) || "—",
    price: numOrNull(r.price, s.price) ?? 0,
  };
}

function mapCase(raw: unknown): CasePart | null {
  const r = asRecord(raw);
  const id = partId(r);
  if (!id) return null;
  const s = asRecord(r.specs);
  const c = asRecord(r.compatibility);
  const moboSizes = strList(
    s.supportedMotherboardSizes ?? c.motherboardSizes,
  );
  return {
    id,
    name: pickStr(r.name, s.name) || id,
    size: pickStr(s.size) || "—",
    supportedMotherboardSizes: moboSizes,
    gpuMaxLengthMm: numOrNull(s.gpuMaxLengthMm, c.gpuMaxLengthMm) ?? 0,
    coolerMaxHeightMm: numOrNull(s.coolerMaxHeightMm, c.coolerMaxHeightMm) ?? 0,
    radiatorSupportMm: strList(s.radiatorSupportMm),
    price: numOrNull(r.price, s.price) ?? 0,
  };
}

function mapCooler(raw: unknown): CoolerPart | null {
  const r = asRecord(raw);
  const id = partId(r);
  if (!id) return null;
  const s = asRecord(r.specs);
  const c = asRecord(r.compatibility);
  return {
    id,
    name: pickStr(r.name, s.name) || id,
    type: pickStr(s.type) || "—",
    supportedSockets: strList(s.supportedSockets ?? c.supportedSockets),
    tdpSupportWatts: numOrNull(s.tdpSupportWatts, c.tdpSupportWatts) ?? 0,
    heightMm: numOrNull(s.heightMm),
    radiatorSizeMm: numOrNull(s.radiatorSizeMm),
    price: numOrNull(r.price, s.price) ?? 0,
  };
}

function mapFan(raw: unknown): FanPart | null {
  const r = asRecord(raw);
  const id = partId(r);
  if (!id) return null;
  const s = asRecord(r.specs);
  return {
    id,
    name: pickStr(r.name, s.name) || id,
    sizeMm: numOrNull(s.sizeMm) ?? 0,
    connectorType: pickStr(s.connectorType) || "—",
    rgb: pickStr(s.rgb) || "—",
    maxRpm: numOrNull(s.maxRpm) ?? 0,
    price: numOrNull(r.price, s.price) ?? 0,
  };
}

function mapStorage(raw: unknown): StoragePart | null {
  const r = asRecord(raw);
  const id = partId(r);
  if (!id) return null;
  const s = asRecord(r.specs);
  const c = asRecord(r.compatibility);
  return {
    id,
    name: pickStr(r.name, s.name) || id,
    type: pickStr(s.type, c.storageType) || "—",
    capacity: pickStr(s.capacity) || "—",
    speed: pickStr(s.speed) || "—",
    formFactor: pickStr(s.formFactor, c.formFactor) || "—",
    price: numOrNull(r.price, s.price) ?? 0,
  };
}

function compact<T>(items: (T | null)[]): T[] {
  return items.filter((x): x is T => x !== null);
}

export function apiPartsToBuilderCatalog(
  byType: Record<string, unknown[]>,
  currency = "USD",
): PartsMockData {
  const parts = {
    cpu: compact((byType.cpu ?? []).map(mapCpu)),
    gpu: compact((byType.gpu ?? []).map(mapGpu)),
    ram: compact((byType.ram ?? []).map(mapRam)),
    motherboard: compact((byType.motherboard ?? []).map(mapMotherboard)),
    psu: compact((byType.psu ?? []).map(mapPsu)),
    case: compact((byType.case ?? []).map(mapCase)),
    cooler: compact((byType.cooler ?? []).map(mapCooler)),
    fan: compact((byType.fan ?? []).map(mapFan)),
    storage: compact((byType.storage ?? []).map(mapStorage)),
  };

  return {
    generatedAt: new Date().toISOString(),
    source: ["pc_parts_api"],
    currency,
    defaults: emptyBuilderSelection(),
    parts,
  };
}
