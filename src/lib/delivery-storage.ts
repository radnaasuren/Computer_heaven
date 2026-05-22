import type { ShippingAddress } from "@/lib/orders-api";

export const DELIVERY_STORAGE_KEY = "pc_delivery_address";

export type DeliveryForm = ShippingAddress & {
  customerPhone?: string;
};

export function readDeliveryForm(): DeliveryForm | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(DELIVERY_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const o = parsed as DeliveryForm;
    if (typeof o.street !== "string" || typeof o.city !== "string") return null;
    return o;
  } catch {
    return null;
  }
}

export function writeDeliveryForm(form: DeliveryForm): void {
  localStorage.setItem(DELIVERY_STORAGE_KEY, JSON.stringify(form));
}
