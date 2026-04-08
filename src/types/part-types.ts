export const PRODUCT_TYPES = [
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

export type ProductType = (typeof PRODUCT_TYPES)[number];

export type ProductImage = {
  url: string;
  alt?: string;
};

export type CpuMemoryType = "DDR4" | "DDR5";
export type PsuEfficiency =
  | "80+ Bronze"
  | "80+ Silver"
  | "80+ Gold"
  | "80+ Platinum"
  | "80+ Titanium";
export type PsuFormFactor = "ATX" | "SFX" | "SFX-L";
export type PsuModularType = "Non-Modular" | "Semi-Modular" | "Fully Modular";
export type MotherboardSocket = "FCLGA1200" | "FCLGA1700" | "AM4" | "AM5";
export type MotherboardChipset =
  | "H510"
  | "B560"
  | "Z590"
  | "B660"
  | "B760"
  | "Z790"
  | "B550"
  | "X570"
  | "B650"
  | "X670E";
export type MotherboardFormFactor = "Mini-ITX" | "Micro-ATX" | "ATX" | "E-ATX";
export type CaseSize = "Mini Tower" | "Mid Tower" | "Full Tower";
export type CasePanelType = "Solid" | "Tempered Glass" | "Mesh";
export type CoolerType = "Air Cooler" | "AIO Liquid Cooler";
export type FanConnectorType = "3-pin" | "4-pin PWM" | "Molex";
export type FanBearingType = "Sleeve" | "Hydraulic" | "Rifle" | "FDB";
export type FanRgbType = "No" | "ARGB" | "RGB";
export type StorageType = "HDD" | "SATA SSD" | "NVMe SSD";
export type StorageFormFactor = "3.5-inch" | "2.5-inch" | "M.2 2280";

export type BaseCompatibility = {
  socket?: string;
  supportedMemoryTypes?: string[];
  ramType?: string;
  supportedSockets?: string[];
  motherboardSizes?: string[];
  gpuMaxLengthMm?: number;
  coolerMaxHeightMm?: number;
  minPsuWatts?: number;
  recommendedPsuWatts?: number;
  [key: string]: unknown;
};

export type CpuSpecs = {
  socket: MotherboardSocket;
  cores: number;
  threads: number;
  baseClockGHz?: number;
  boostClockGHz?: number;
  tdpWatts: number;
  integratedGraphics?: boolean;
  supportedMemoryTypes: CpuMemoryType[];
  aggregatePerformanceScore?: number;
};

export type GpuSpecs = {
  vram: string;
  vramType: string;
  tdpWatts: number;
  lengthMm?: number;
  interface?: string;
  aggregatePerformanceScore?: number;
};

export type RamSpecs = {
  memoryType: CpuMemoryType;
  capacityGb: number;
  moduleCount: number;
  moduleSizeGb: number;
  speedMtps: number;
  cl?: number;
  rgb?: boolean;
};

export type MotherboardSpecs = {
  socket: MotherboardSocket;
  chipset: MotherboardChipset;
  ramType: CpuMemoryType;
  formFactor: MotherboardFormFactor;
  maxMemoryGb?: number;
  m2Slots?: number;
  sataPorts?: number;
  wifi?: boolean;
};

export type PsuSpecs = {
  watt: number;
  efficiency: PsuEfficiency;
  formFactor: PsuFormFactor;
  modular: PsuModularType;
};

export type CoolerSpecs = {
  coolerType: CoolerType;
  supportedSockets: MotherboardSocket[];
  tdpSupportWatts: number;
  radiatorSizeMm?: 120 | 240 | 280 | 360;
  heightMm?: number;
};

export type FanSpecs = {
  sizeMm: 80 | 92 | 120 | 140 | 200;
  connectorType: FanConnectorType;
  bearingType?: FanBearingType;
  rgb: FanRgbType;
  maxRpm: number;
};

export type CaseSpecs = {
  size: CaseSize;
  supportedMotherboardSizes: MotherboardFormFactor[];
  gpuMaxLengthMm: number;
  coolerMaxHeightMm?: number;
  radiatorSupportMm?: Array<120 | 240 | 280 | 360>;
  sidePanel?: CasePanelType;
};

export type StorageSpecs = {
  storageType: StorageType;
  capacityGb?: number;
  interface?: string;
  formFactor: StorageFormFactor;
  readSpeedMbps?: number;
  speedLabel?: string;
};

export type ProductCompatibilityByType = {
  cpu: BaseCompatibility & {
    socket: MotherboardSocket;
    supportedMemoryTypes: CpuMemoryType[];
    coolerMinTdpWatts?: number;
  };
  gpu: BaseCompatibility & {
    minPsuWatts?: number;
    recommendedPsuWatts?: number;
    gpuLengthMm?: number;
    requiredPowerConnectors?: string[];
  };
  ram: BaseCompatibility & {
    ramType: CpuMemoryType;
    channelsPreferred?: number;
  };
  motherboard: BaseCompatibility & {
    socket: MotherboardSocket;
    ramType: CpuMemoryType;
    formFactor?: MotherboardFormFactor;
  };
  psu: BaseCompatibility & {
    watt?: number;
  };
  case: BaseCompatibility & {
    motherboardSizes?: MotherboardFormFactor[];
    gpuMaxLengthMm?: number;
    coolerMaxHeightMm?: number;
  };
  cooler: BaseCompatibility & {
    supportedSockets?: MotherboardSocket[];
    tdpSupportWatts?: number;
  };
  fan: BaseCompatibility;
  storage: BaseCompatibility & {
    storageType?: StorageType;
    formFactor?: StorageFormFactor;
  };
};

export type ProductSpecsByType = {
  cpu: CpuSpecs;
  gpu: GpuSpecs;
  ram: RamSpecs;
  motherboard: MotherboardSpecs;
  psu: PsuSpecs;
  cooler: CoolerSpecs;
  fan: FanSpecs;
  case: CaseSpecs;
  storage: StorageSpecs;
};

export type ProductDocumentBase = {
  type: ProductType;
  name: string;
  slug: string;
  brand: string;
  sku: string;
  price: number;
  stockQty: number;
  currency: string;
  images: ProductImage[];
  shortDescription?: string;
  tags: string[];
};

export type ProductDocumentShapeByType<T extends ProductType> =
  ProductDocumentBase & {
    type: T;
    specs: ProductSpecsByType[T];
    compatibility: ProductCompatibilityByType[T];
  };

export type ProductDocumentShape =
  | ProductDocumentShapeByType<"cpu">
  | ProductDocumentShapeByType<"gpu">
  | ProductDocumentShapeByType<"ram">
  | ProductDocumentShapeByType<"motherboard">
  | ProductDocumentShapeByType<"psu">
  | ProductDocumentShapeByType<"cooler">
  | ProductDocumentShapeByType<"fan">
  | ProductDocumentShapeByType<"case">
  | ProductDocumentShapeByType<"storage">;
