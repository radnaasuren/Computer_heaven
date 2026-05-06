import { gql } from '@apollo/client';

// PRODUCTS QUERIES
export const GET_PRODUCTS = gql`
  query GetProducts($filter: ProductFilterInput) {
    products(filter: $filter) {
      items {
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
      total
      page
      pageSize
    }
  }
`;

export const GET_PRODUCT_BY_ID = gql`
  query GetProductById($id: ID!) {
    product(id: $id) {
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
`;

export const GET_PRODUCT_TYPES = gql`
  query GetProductTypes {
    productTypes
  }
`;

export const GET_PRODUCT_STATUSES = gql`
  query GetProductStatuses {
    productStatuses
  }
`;

// COMPATIBILITY QUERIES
export const CHECK_COMPATIBILITY = gql`
  query CheckCompatibility($build: PCBuildInput!) {
    checkCompatibility(build: $build) {
      isCompatible
      score
      recommendations
      checks {
        compatible
        message
        severity
        rule
      }
    }
  }
`;

// BENCHMARK QUERIES
export const GET_BENCHMARKS = gql`
  query GetBenchmarks($filter: BenchmarkFilter) {
    benchmarks(filter: $filter) {
      items {
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
      total
      page
      pageSize
    }
    popularCPUs
    popularGPUs
    popularGames
  }
`;

export const GET_BENCHMARK_BY_ID = gql`
  query GetBenchmarkById($id: ID!) {
    getBenchmarkById(id: $id) {
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
`;

export const GET_POPULAR_CPUS = gql`
  query GetPopularCPUs {
    popularCPUs
  }
`;

export const GET_POPULAR_GPUS = gql`
  query GetPopularGPUs {
    popularGPUs
  }
`;

export const GET_POPULAR_GAMES = gql`
  query GetPopularGames {
    popularGames
  }
`;
