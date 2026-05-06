import { gql } from '@apollo/client';
import { client } from '@/lib/apollo';
import * as queries from '@/graphql/queries';
import * as mutations from '@/graphql/mutations';
import { API_ENDPOINTS, GRAPHQL_TYPES } from '@/graphql';
import type { 
  ProductFilterInput, 
  ProductInput, 
  PCBuild, 
  BenchmarkFilter, 
  BenchmarkData 
} from '@/types/graphql';

// API Service Class
export class PCBuildAPI {
  // Product Services
  static async getProducts(filter?: ProductFilterInput) {
    const response = await client.query({
      query: queries.GET_PRODUCTS,
      variables: { filter },
    });
    return response.data.products;
  }

  static async getProductById(id: string) {
    const response = await client.query({
      query: queries.GET_PRODUCT_BY_ID,
      variables: { id },
    });
    return response.data.product;
  }

  static async getProductTypes() {
    const response = await client.query({
      query: queries.GET_PRODUCT_TYPES,
    });
    return response.data.productTypes;
  }

  static async getProductStatuses() {
    const response = await client.query({
      query: queries.GET_PRODUCT_STATUSES,
    });
    return response.data.productStatuses;
  }

  static async upsertProduct(input: ProductInput) {
    const response = await client.mutate({
      mutation: mutations.UPSERT_PRODUCT,
      variables: { input },
    });
    return response.data.upsertProduct;
  }

  static async deleteProduct(id: string) {
    const response = await client.mutate({
      mutation: mutations.DELETE_PRODUCT,
      variables: { id },
    });
    return response.data.deleteProduct;
  }

  // Compatibility Services
  static async checkCompatibility(build: PCBuild) {
    const response = await client.query({
      query: queries.CHECK_COMPATIBILITY,
      variables: { build },
    });
    return response.data.checkCompatibility;
  }

  // Benchmark Services
  static async getBenchmarks(filter?: BenchmarkFilter) {
    const response = await client.query({
      query: queries.GET_BENCHMARKS,
      variables: { filter },
    });
    return response.data.benchmarks;
  }

  static async getBenchmarkById(id: string) {
    const response = await client.query({
      query: queries.GET_BENCHMARK_BY_ID,
      variables: { id },
    });
    return response.data.getBenchmarkById;
  }

  static async getPopularCPUs() {
    const response = await client.query({
      query: queries.GET_POPULAR_CPUS,
    });
    return response.data.popularCPUs;
  }

  static async getPopularGPUs() {
    const response = await client.query({
      query: queries.GET_POPULAR_GPUS,
    });
    return response.data.popularGPUs;
  }

  static async getPopularGames() {
    const response = await client.query({
      query: queries.GET_POPULAR_GAMES,
    });
    return response.data.popularGames;
  }

  static async saveBenchmark(benchmark: Partial<BenchmarkData>) {
    const response = await client.mutate({
      mutation: mutations.SAVE_BENCHMARK,
      variables: { benchmark },
    });
    return response.data.saveBenchmark;
  }

  static async deleteBenchmark(id: string) {
    const response = await client.mutate({
      mutation: mutations.DELETE_BENCHMARK,
      variables: { id },
    });
    return response.data.deleteBenchmark;
  }
}

// Export constants and utilities
export { API_ENDPOINTS, GRAPHQL_TYPES };

// Utility functions for common operations
export const APIUtils = {
  // Filter helpers
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

  // Build helpers
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

  // Performance helpers
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
