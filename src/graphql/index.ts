// Export all GraphQL queries and mutations
export * from './queries';
export * from './mutations';

// API Endpoints Configuration
export const API_ENDPOINTS = {
  GRAPHQL: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3002/api/graphql',
  BACKEND_URL: 'http://localhost:3002',
  FRONTEND_URL: 'http://localhost:3000',
} as const;

// GraphQL Schema Types
export const GRAPHQL_TYPES = {
  // Product Types
  PRODUCT_TYPE: {
    CPU: 'cpu',
    GPU: 'gpu',
    RAM: 'ram',
    MOTHERBOARD: 'motherboard',
    PSU: 'psu',
    CASE: 'case',
    COOLER: 'cooler',
    FAN: 'fan',
    STORAGE: 'storage',
  } as const,
  
  PRODUCT_STATUS: {
    DRAFT: 'draft',
    ACTIVE: 'active',
    ARCHIVED: 'archived',
  } as const,
  
  // Benchmark Types
  RESOLUTION: {
    HD: '720p',
    FULL_HD: '1080p',
    QHD: '1440p',
    UHD_4K: '4K',
    UHD_8K: '8K',
  } as const,
  
  SETTINGS: {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
    ULTRA: 'Ultra',
    MAX: 'Max',
  } as const,
  
  COMPATIBILITY_SEVERITY: {
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
  } as const,
};
