const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000"

type GraphqlOptions = {
  query: string
  variables?: Record<string, unknown>
  hasAuth?: boolean
}

export async function graphql<T>({
  query,
  variables,
  hasAuth = false,
}: GraphqlOptions): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  if (hasAuth) {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (token) headers["Authorization"] = `Bearer ${token}`
  }

  const res = await fetch(`${API_URL}/api/graphql`, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  })

  const json = await res.json()

  if (json.errors?.length) {
    throw new Error(json.errors[0]?.message ?? "GraphQL error")
  }

  return json.data as T
}
