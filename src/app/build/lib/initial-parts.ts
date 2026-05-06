import type {
  Part,
  PartCategory,
  PartsMockData,
} from "@/app/build/types/parts";

export type BuilderState = PartsMockData["defaults"];

/** Allows a slot to be cleared (\"\" means missing). */
export type BuilderStateLoose = {
  [K in keyof PartsMockData["defaults"]]: string;
};

function findById<T extends { id: string }>(
  list: T[],
  id: string,
  label: string,
): T {
  const item = list.find((p) => p.id === id);
  if (!item) {
    throw new Error(`parts-mock: missing ${label} id "${id}"`);
  }
  return item;
}

function findOrFirst<T extends { id: string }>(list: T[], id: string): T {
  return list.find((p) => p.id === id) ?? list[0];
}

/** Row order in the builder list (matches typical flow + mock defaults). */
const ORDER: { category: PartCategory; defaultKey: keyof PartsMockData["defaults"] }[] =
  [
    { category: "cpu", defaultKey: "cpuId" },
    { category: "cooler", defaultKey: "coolerId" },
    { category: "motherboard", defaultKey: "motherboardId" },
    { category: "ram", defaultKey: "ramId" },
    { category: "storage", defaultKey: "storageId" },
    { category: "gpu", defaultKey: "gpuId" },
    { category: "case", defaultKey: "caseId" },
    { category: "psu", defaultKey: "psuId" },
    { category: "fan", defaultKey: "fanId" },
  ];

function partFromOrderEntry(
  parts: PartsMockData["parts"],
  category: PartCategory,
  id: string,
  mode: "strict" | "fallback",
): Part {
  const pick = <T extends { id: string }>(list: T[], label: string) =>
    mode === "strict" ? findById(list, id, label) : findOrFirst(list, id);

  switch (category) {
    case "cpu":
      return { category, ...pick(parts.cpu, "cpu") };
    case "gpu":
      return { category, ...pick(parts.gpu, "gpu") };
    case "ram":
      return { category, ...pick(parts.ram, "ram") };
    case "motherboard":
      return { category, ...pick(parts.motherboard, "motherboard") };
    case "psu":
      return { category, ...pick(parts.psu, "psu") };
    case "case":
      return { category, ...pick(parts.case, "case") };
    case "cooler":
      return { category, ...pick(parts.cooler, "cooler") };
    case "fan":
      return { category, ...pick(parts.fan, "fan") };
    case "storage":
      return { category, ...pick(parts.storage, "storage") };
    default: {
      const _x: never = category;
      return _x;
    }
  }
}

export function partsFromDefaults(mock: PartsMockData): Part[] {
  const { defaults, parts } = mock;

  return ORDER.map(({ category, defaultKey }) => {
    const id = defaults[defaultKey];
    return partFromOrderEntry(parts, category, id, "strict");
  });
}

export type BuildRow = {
  category: PartCategory;
  defaultKey: keyof BuilderState;
  selectedId: string;
  part: Part | null;
};

/** Current build rows from selection ids (null when a slot is missing). */
export function buildRowsFromSelection(
  mock: PartsMockData,
  selection: BuilderStateLoose,
): BuildRow[] {
  const { parts } = mock;

  return ORDER.map(({ category, defaultKey }) => {
    const id = selection[defaultKey] ?? "";
    const part = id ? partFromOrderEntry(parts, category, id, "fallback") : null;

    return {
      category,
      defaultKey,
      selectedId: id,
      part,
    };
  });
}

export function partSelectOptions(
  category: PartCategory,
  data: PartsMockData,
): { value: string; label: string }[] {
  const p = data.parts;
  switch (category) {
    case "cpu":
      return p.cpu.map((item) => ({
        value: item.id,
        label: `${item.name} • ${item.cores}C/${item.threads}T`,
      }));
    case "gpu":
      return p.gpu.map((item) => ({
        value: item.id,
        label: `${item.name} • ${item.vram ?? "VRAM n/a"}`,
      }));
    case "ram":
      return p.ram.map((item) => ({
        value: item.id,
        label: `${item.name} • ${item.speed}`,
      }));
    case "motherboard":
      return p.motherboard.map((item) => ({
        value: item.id,
        label: `${item.name} • ${item.socket}`,
      }));
    case "psu":
      return p.psu.map((item) => ({
        value: item.id,
        label: `${item.name} • ${item.watt}W`,
      }));
    case "case":
      return p.case.map((item) => ({
        value: item.id,
        label: `${item.name} • ${item.size}`,
      }));
    case "cooler":
      return p.cooler.map((item) => ({
        value: item.id,
        label: `${item.name} • ${item.type}`,
      }));
    case "fan":
      return p.fan.map((item) => ({
        value: item.id,
        label: `${item.name} • ${item.maxRpm} RPM`,
      }));
    case "storage":
      return p.storage.map((item) => ({
        value: item.id,
        label: `${item.name} • ${item.speed}`,
      }));
    default: {
      const _x: never = category;
      return _x;
    }
  }
}

export function defaultKeyForCategory(
  category: PartCategory,
): keyof BuilderState {
  const entry = ORDER.find((o) => o.category === category);
  if (!entry) throw new Error(`Unknown category ${category}`);
  return entry.defaultKey;
}

export function formatPartPrice(price: number): string {
  return new Intl.NumberFormat("mn-MN", {
    style: "currency",
    currency: "MNT",
    maximumFractionDigits: 0,
  }).format(price);
}
