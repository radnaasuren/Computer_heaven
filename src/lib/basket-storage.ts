import type { OrderItemInput } from "@/lib/orders-api";

export const BASKET_STORAGE_KEY = "pc_build_basket";

export type BasketBuild = {
  id: string;
  title: string;
  items: OrderItemInput[];
  currency: string;
  subtotal: number;
  addedAt: string;
};

export function readBasket(): BasketBuild[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(BASKET_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (b): b is BasketBuild =>
        Boolean(
          b &&
            typeof b === "object" &&
            typeof (b as BasketBuild).id === "string" &&
            Array.isArray((b as BasketBuild).items),
        ),
    );
  } catch {
    return [];
  }
}

export function writeBasket(builds: BasketBuild[]): void {
  localStorage.setItem(BASKET_STORAGE_KEY, JSON.stringify(builds));
}

export function basketItemCount(builds: BasketBuild[]): number {
  return builds.reduce(
    (sum, build) =>
      sum + build.items.reduce((s, item) => s + item.quantity, 0),
    0,
  );
}
