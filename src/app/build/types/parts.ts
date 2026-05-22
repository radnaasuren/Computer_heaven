/** Mirrors `mockdata/parts-mock.json` part shapes */

export type PartCategory =
  | "cpu"
  | "gpu"
  | "ram"
  | "motherboard"
  | "psu"
  | "case"
  | "cooler"
  | "fan"
  | "storage";

/** Matches mock + builder rules (nullable fields like computerStore builder-page). */
export type CpuPart = {
  id: string;
  name: string;
  brand: string;
  socket: string | null;
  cores: number | null;
  threads: number | null;
  tdpWatts: number | null;
  supportedMemoryTypes: string[];
  aggregatePerformanceScore: number | null;
  price: number;
};

export type GpuPart = {
  id: string;
  name: string;
  brand: string;
  vram: string | null;
  lengthMm: number;
  tdpWatts: number | null;
  aggregatePerformanceScore: number | null;
  price: number;
};

export type RamPart = {
  id: string;
  name: string;
  type: string;
  speed: string;
  capacity: string;
  modules: string;
  price: number;
};

export type MotherboardPart = {
  id: string;
  name: string;
  brand: string;
  socket: string;
  chipset: string;
  ramType: string;
  formFactor: string;
  price: number;
};

export type PsuPart = {
  id: string;
  name: string;
  watt: number;
  efficiency: string;
  formFactor: string;
  modular: string;
  price: number;
};

export type CasePart = {
  id: string;
  name: string;
  size: string;
  supportedMotherboardSizes: string[];
  gpuMaxLengthMm: number;
  coolerMaxHeightMm: number;
  radiatorSupportMm: string[];
  price: number;
};

export type CoolerPart = {
  id: string;
  name: string;
  type: string;
  supportedSockets: string[];
  tdpSupportWatts: number;
  heightMm: number | null;
  radiatorSizeMm: number | null;
  price: number;
};

export type FanPart = {
  id: string;
  name: string;
  sizeMm: number;
  connectorType: string;
  rgb: string;
  maxRpm: number;
  price: number;
};

export type StoragePart = {
  id: string;
  name: string;
  type: string;
  capacity: string;
  speed: string;
  formFactor: string;
  price: number;
};

/** One selected row in the builder: category + the part payload from JSON */
export type Part =
  | ({ category: "cpu" } & CpuPart)
  | ({ category: "gpu" } & GpuPart)
  | ({ category: "ram" } & RamPart)
  | ({ category: "motherboard" } & MotherboardPart)
  | ({ category: "psu" } & PsuPart)
  | ({ category: "case" } & CasePart)
  | ({ category: "cooler" } & CoolerPart)
  | ({ category: "fan" } & FanPart)
  | ({ category: "storage" } & StoragePart);

export type PartsMockDefaults = {
  cpuId: string;
  gpuId: string;
  ramId: string;
  motherboardId: string;
  psuId: string;
  caseId: string;
  coolerId: string;
  fanId: string;
  storageId: string;
};

export type PartsMockData = {
  generatedAt: string;
  source: string[];
  /** Price currency for `formatPartPrice` (API catalog uses USD). */
  currency?: string;
  defaults: PartsMockDefaults;
  parts: {
    cpu: CpuPart[];
    gpu: GpuPart[];
    ram: RamPart[];
    motherboard: MotherboardPart[];
    psu: PsuPart[];
    case: CasePart[];
    cooler: CoolerPart[];
    fan: FanPart[];
    storage: StoragePart[];
  };
};
