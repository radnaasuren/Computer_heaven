import type { 
  ProductFilterInput, 
  ProductInput, 
  PCBuild, 
  BenchmarkFilter, 
  BenchmarkData,
  CompatibilityResult
} from '@/types/graphql';

// Mock Products Data
const mockProducts = [
  // CPUs
  { id: '1', name: 'Intel Core i9-13900K', type: 'cpu', status: 'active', price: 589 },
  { id: '2', name: 'AMD Ryzen 9 7950X', type: 'cpu', status: 'active', price: 549 },
  { id: '3', name: 'Intel Core i7-13700K', type: 'cpu', status: 'active', price: 389 },
  { id: '4', name: 'AMD Ryzen 7 7700X', type: 'cpu', status: 'active', price: 349 },
  
  // GPUs
  { id: '5', name: 'NVIDIA RTX 4090', type: 'gpu', status: 'active', price: 1599 },
  { id: '6', name: 'AMD RX 7900 XTX', type: 'gpu', status: 'active', price: 999 },
  { id: '7', name: 'NVIDIA RTX 4070 Ti', type: 'gpu', status: 'active', price: 799 },
  { id: '8', name: 'AMD RX 7900 XT', type: 'gpu', status: 'active', price: 899 },
  
  // Motherboards
  { id: '9', name: 'ASUS ROG Strix Z790-E', type: 'motherboard', status: 'active', price: 449 },
  { id: '10', name: 'MSI MAG X670E Tomahawk', type: 'motherboard', status: 'active', price: 379 },
  { id: '11', name: 'Gigabyte Z790 Aorus Master', type: 'motherboard', status: 'active', price: 429 },
  
  // RAM
  { id: '12', name: 'Corsair Vengeance 32GB DDR5-5600', type: 'ram', status: 'active', price: 149 },
  { id: '13', name: 'G.Skill Trident Z5 32GB DDR5-6000', type: 'ram', status: 'active', price: 179 },
  { id: '14', name: 'Kingston Fury Beast 32GB DDR5-5200', type: 'ram', status: 'active', price: 129 },
  
  // PSUs
  { id: '15', name: 'Corsair RM1000x 1000W', type: 'psu', status: 'active', price: 189 },
  { id: '16', name: 'Seasonic Focus GX-850', type: 'psu', status: 'active', price: 149 },
  { id: '17', name: 'EVGA SuperNOVA 750 G6', type: 'psu', status: 'active', price: 129 },
  
  // Cases
  { id: '18', name: 'Fractal Design Meshify 2', type: 'case', status: 'active', price: 129 },
  { id: '19', name: 'NZXT H510 Elite', type: 'case', status: 'active', price: 149 },
  { id: '20', name: 'Lian Li Lancool 216', type: 'case', status: 'active', price: 99 },
  
  // Coolers
  { id: '21', name: 'Noctua NH-D15', type: 'cooler', status: 'active', price: 99 },
  { id: '22', name: 'Corsair H150i Elite', type: 'cooler', status: 'active', price: 169 },
  { id: '23', name: 'be quiet! Dark Rock Pro 4', type: 'cooler', status: 'active', price: 89 },
];

// Mock API Service Class
export class MockPCBuildAPI {
  // Product Services
  static async getProducts(filter?: ProductFilterInput) {
    let filteredProducts = [...mockProducts];
    
    if (filter?.type) {
      filteredProducts = filteredProducts.filter(p => p.type === filter.type);
    }
    
    if (filter?.status) {
      filteredProducts = filteredProducts.filter(p => p.status === filter.status);
    }
    
    if (filter?.search) {
      const searchLower = filter.search.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchLower)
      );
    }
    
    const page = filter?.page || 1;
    const pageSize = filter?.pageSize || 20;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    return {
      items: filteredProducts.slice(startIndex, endIndex),
      total: filteredProducts.length,
      page,
      pageSize,
      totalPages: Math.ceil(filteredProducts.length / pageSize)
    };
  }

  static async getProductById(id: string) {
    return mockProducts.find(p => p.id === id);
  }

  static async getProductTypes() {
    return ['cpu', 'gpu', 'motherboard', 'ram', 'psu', 'case', 'cooler'];
  }

  static async getProductStatuses() {
    return ['active', 'inactive', 'discontinued'];
  }

  static async upsertProduct(input: ProductInput) {
    return { success: true, message: "Product saved successfully", item: input };
  }

  static async deleteProduct(id: string) {
    return { success: true, message: "Product deleted successfully" };
  }

  // Compatibility Services
  static async checkCompatibility(build: PCBuild) {
    const checks = [];
    let score = 100;

    // Basic compatibility checks
    if (!build.cpu) {
      checks.push({
        severity: 'error' as const,
        message: 'CPU is required',
        rule: 'CPU_REQUIRED'
      });
      score -= 30;
    }

    if (!build.gpu) {
      checks.push({
        severity: 'error' as const,
        message: 'GPU is required',
        rule: 'GPU_REQUIRED'
      });
      score -= 30;
    }

    if (!build.motherboard) {
      checks.push({
        severity: 'error' as const,
        message: 'Motherboard is required',
        rule: 'MOTHERBOARD_REQUIRED'
      });
      score -= 20;
    }

    if (!build.ram || build.ram.length === 0) {
      checks.push({
        severity: 'error' as const,
        message: 'RAM is required',
        rule: 'RAM_REQUIRED'
      });
      score -= 20;
    }

    // Socket compatibility (simplified)
    if (build.cpu && build.motherboard) {
      const isIntelCPU = build.cpu.toLowerCase().includes('intel');
      const isAMDCPU = build.cpu.toLowerCase().includes('amd');
      const isIntelMB = build.motherboard.toLowerCase().includes('z790') || build.motherboard.toLowerCase().includes('intel');
      const isAMDMB = build.motherboard.toLowerCase().includes('x670') || build.motherboard.toLowerCase().includes('amd');
      
      if ((isIntelCPU && isAMDMB) || (isAMDCPU && isIntelMB)) {
        checks.push({
          severity: 'error' as const,
          message: 'CPU socket incompatible with motherboard',
          rule: 'SOCKET_COMPATIBILITY'
        });
        score -= 50;
      }
    }

    // Power supply recommendations
    if (build.gpu && build.psu) {
      const isHighEndGPU = build.gpu.toLowerCase().includes('rtx 4090') || build.gpu.toLowerCase().includes('rx 7900');
      const isLowWattagePSU = build.psu.toLowerCase().includes('750') || build.psu.toLowerCase().includes('650');
      
      if (isHighEndGPU && isLowWattagePSU) {
        checks.push({
          severity: 'warning' as const,
          message: 'Consider higher wattage PSU for high-end GPU',
          rule: 'PSU_WATTAGE'
        });
        score -= 10;
      }
    }

    const recommendations = [];
    if (score < 100) {
      recommendations.push('Ensure all components are compatible');
    }
    if (score >= 80) {
      recommendations.push('Build looks good!');
    }

    return {
      isCompatible: score >= 70,
      score: Math.max(0, score),
      checks,
      recommendations
    } as CompatibilityResult;
  }

  // Benchmark Services
  static async getBenchmarks(filter?: BenchmarkFilter) {
    return {
      items: [],
      total: 0,
      page: 1,
      pageSize: 20,
      totalPages: 0
    };
  }

  static async getBenchmarkById(id: string) {
    return null;
  }

  static async getPopularCPUs() {
    return [
      "Intel Core i9-13900K",
      "AMD Ryzen 9 7950X",
      "Intel Core i7-13700K",
      "AMD Ryzen 7 7700X"
    ];
  }

  static async getPopularGPUs() {
    return [
      "NVIDIA RTX 4090",
      "AMD RX 7900 XTX",
      "NVIDIA RTX 4070 Ti",
      "AMD RX 7900 XT"
    ];
  }

  static async getPopularGames() {
    return [
      "Cyberpunk 2077",
      "Valorant",
      "Call of Duty MW3",
      "Fortnite",
      "Apex Legends"
    ];
  }

  static async saveBenchmark(benchmark: Partial<BenchmarkData>) {
    return { success: true, message: "Benchmark saved successfully", item: benchmark };
  }

  static async deleteBenchmark(id: string) {
    return { success: true, message: "Benchmark deleted successfully" };
  }
}

// Export utilities
export const MockAPIUtils = {
  createProductFilter: (type?: string, status?: string, search?: string, page = 1, pageSize = 20) => ({
    type,
    status,
    search,
    page,
    pageSize,
  }),

  createBenchmarkFilter: (filter: Partial<BenchmarkFilter>) => ({
    page: 1,
    pageSize: 20,
    ...filter,
  }),

  createPCBuildInput: (build: Partial<PCBuild>) => ({
    name: build.name || 'My PC Build',
    cpu: build.cpu,
    gpu: build.gpu,
    motherboard: build.motherboard,
    ram: build.ram,
    psu: build.psu,
    case: build.case,
    cooler: build.cooler,
    storage: build.storage,
  }),

  getFpsRating: (fps: number) => {
    if (fps >= 120) return { rating: 'Excellent', color: 'text-green-600' };
    if (fps >= 60) return { rating: 'Good', color: 'text-yellow-600' };
    return { rating: 'Poor', color: 'text-red-600' };
  },

  getCompatibilityScore: (score: number) => {
    if (score >= 90) return { rating: 'Excellent', color: 'bg-green-500' };
    if (score >= 70) return { rating: 'Good', color: 'bg-yellow-500' };
    return { rating: 'Poor', color: 'bg-red-500' };
  },
};
