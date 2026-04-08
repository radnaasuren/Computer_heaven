"use client"

import { useState, useCallback } from "react"
import productApi, {
  type ProductFilter,
  type ProductListResponse,
  type ProductDetail,
  type ProductInput,
} from "./products"

export function useProductList(filter: ProductFilter) {
  const [data, setData] = useState<ProductListResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await productApi.list(filter)
      setData(res)
      return res
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
    } finally {
      setLoading(false)
    }
  }, [filter])

  return { data, loading, error, fetch }
}

export function useProduct(id: string | null) {
  const [data, setData] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetch = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const res = await productApi.get(id)
      setData(res)
      return res
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
    } finally {
      setLoading(false)
    }
  }, [id])

  return { data, loading, error, fetch }
}

export function useUpsertProduct() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const upsert = useCallback(async (input: ProductInput) => {
    setLoading(true)
    setError(null)
    try {
      const res = await productApi.upsert(input)
      return res
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { upsert, loading, error }
}

export function useDeleteProduct() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const remove = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await productApi.delete(id)
      return res
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { delete: remove, loading, error }
}
