import { pcPartsRequest } from "@/lib/pc-parts-client";

export type OrderItemInput = {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
};

export type ShippingAddress = {
  street: string;
  city: string;
  state?: string;
  zip?: string;
  country?: string;
};

export type CreateOrderInput = {
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  items: OrderItemInput[];
  currency?: string;
  shippingAddress: ShippingAddress;
  notes?: string;
};

export type OrderRecord = {
  _id: string;
  userId: string;
  username: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: OrderItemInput[];
  status: string;
  total: number;
  currency?: string;
  shippingAddress?: ShippingAddress;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
};

type OrdersListResponse = {
  success: boolean;
  data: OrderRecord[];
  count: number;
  total: number;
  page: number;
  pages: number;
};

type OrderResponse = {
  success: boolean;
  data: OrderRecord;
};

export async function fetchOrders(params?: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<OrdersListResponse> {
  const sp = new URLSearchParams();
  if (params?.page) sp.set("page", String(params.page));
  if (params?.limit) sp.set("limit", String(params.limit));
  if (params?.status) sp.set("status", params.status);
  const q = sp.toString();
  return pcPartsRequest<OrdersListResponse>(`/api/orders${q ? `?${q}` : ""}`, {
    auth: true,
  });
}

export async function createOrder(input: CreateOrderInput): Promise<OrderRecord> {
  const res = await pcPartsRequest<OrderResponse>("/api/orders", {
    method: "POST",
    auth: true,
    body: {
      ...input,
      status: "pending",
    },
  });
  if (!res.data) {
    throw new Error("Захиалга үүсээгүй");
  }
  return res.data;
}

export async function fetchOrderById(id: string): Promise<OrderRecord> {
  const res = await pcPartsRequest<OrderResponse>(`/api/orders/${id}`, {
    auth: true,
  });
  if (!res.data) {
    throw new Error("Захиалга олдсонгүй");
  }
  return res.data;
}
