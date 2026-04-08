import { graphql } from "./http"
import {
  productList,
  productById,
  upsertProduct,
  deleteProduct,
} from "./query/products"

export type ProductFilter = {
  type?: string
  status?: string
  search?: string
  page?: number
  pageSize?: number
}

export type ProductItem = {
  id: string
  type: string
  status: string
  name: string
  slug: string
  brand: string
  price: number
  stockQty: number
  specs: unknown
}

export type ProductListResponse = {
  items: ProductItem[]
  total: number
  page: number
  pageSize: number
}

export type ProductDetail = ProductItem & {
  sku: string
  currency: string
  shortDescription?: string
  tags: string[]
  compatibility?: unknown
}

export type ProductInput = {
  id?: string
  type: string
  status: string
  name: string
  slug: string
  brand: string
  sku: string
  price: number
  stockQty: number
  currency: string
  shortDescription?: string
  tags: string[]
  specs: unknown
  compatibility?: unknown
}

export type SuccessResponse = {
  success: boolean
  message: string
}

const productApi = {
  list: (filter: ProductFilter) => {
    return graphql<{ products: ProductListResponse }>({
      query: productList,
      variables: { filter },
      hasAuth: true,
    }).then((data) => data.products)
  },

  get: (id: string) => {
    return graphql<{ product: ProductDetail | null }>({
      query: productById,
      variables: { id },
      hasAuth: true,
    }).then((data) => data.product)
  },

  upsert: (input: ProductInput) => {
    return graphql<{
      upsertProduct: SuccessResponse & { item?: ProductItem | null }
    }>({
      query: upsertProduct,
      variables: { input },
      hasAuth: true,
    }).then((data) => data.upsertProduct)
  },

  delete: (id: string) => {
    return graphql<{ deleteProduct: SuccessResponse }>({
      query: deleteProduct,
      variables: { id },
      hasAuth: true,
    }).then((data) => data.deleteProduct)
  },
}

export default productApi
