export type ProductType = 'cpu' | 'gpu' | 'ram' | 'motherboard' | 'psu' | 'case' | 'cooler' | 'fan' | 'storage';
export type ProductStatus = 'draft' | 'active' | 'archived';

export interface Product {
  id: string;
  type: ProductType;
  status: ProductStatus;
  name: string;
  slug: string;
  brand: string;
  sku: string;
  price: number;
  stockQty: number;
  currency: string;
  shortDescription?: string;
  tags: string[];
  specs: Record<string, any>;
  compatibility?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface CompatibilityCheck {
  compatible: boolean;
  message: string;
  severity: 'error' | 'warning' | 'info';
  rule: string;
}

export interface CompatibilityResult {
  isCompatible: boolean;
  checks: CompatibilityCheck[];
  score: number;
  recommendations: string[];
}

export interface PCBuild {
  id?: string;
  name: string;
  cpu?: string;
  gpu?: string;
  motherboard?: string;
  ram?: string[];
  psu?: string;
  case?: string;
  cooler?: string;
  storage?: string[];
  totalWattage?: number;
  estimatedPrice?: number;
}

export interface ProductFilterInput {
  type?: string;
  status?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface ProductInput {
  id?: string;
  type: string;
  status: string;
  name: string;
  slug: string;
  brand: string;
  sku: string;
  price: number;
  stockQty: number;
  currency: string;
  shortDescription?: string;
  tags: string[];
  specs: Record<string, unknown>;
  compatibility?: Record<string, unknown>;
}

export interface BenchmarkFilter {
  cpu?: string;
  gpu?: string;
  game?: string;
  resolution?: string;
  settings?: string;
  minFps?: number;
  maxFps?: number;
  page?: number;
  pageSize?: number;
}

export interface BenchmarkData {
  id: string;
  cpuModel: string;
  gpuModel: string;
  ram: string;
  resolution: string;
  settings: string;
  game: string;
  avgFps: number;
  minFps: number;
  maxFps: number;
  frameTime: number;
  cpuUsage: number;
  gpuUsage: number;
  ramUsage: number;
  temperature: number;
  testDate: string;
}
