import { gql } from '@apollo/client';

// PRODUCT MUTATIONS
export const UPSERT_PRODUCT = gql`
  mutation UpsertProduct($input: ProductInput!) {
    upsertProduct(input: $input) {
      success
      message
      item {
        id
        type
        status
        name
        slug
        brand
        sku
        price
        stockQty
        currency
        shortDescription
        tags
        specs
        compatibility
        createdAt
        updatedAt
      }
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      success
      message
    }
  }
`;

// BENCHMARK MUTATIONS
export const SAVE_BENCHMARK = gql`
  mutation SaveBenchmark($benchmark: BenchmarkInput!) {
    saveBenchmark(benchmark: $benchmark) {
      success
      message
      item {
        id
        cpuModel
        gpuModel
        ram
        resolution
        settings
        game
        avgFps
        minFps
        maxFps
        frameTime
        cpuUsage
        gpuUsage
        ramUsage
        temperature
        testDate
      }
    }
  }
`;

export const DELETE_BENCHMARK = gql`
  mutation DeleteBenchmark($id: ID!) {
    deleteBenchmark(id: $id) {
      success
      message
    }
  }
`;
