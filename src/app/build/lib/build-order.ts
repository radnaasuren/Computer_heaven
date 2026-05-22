import type { BuildRow } from "@/app/build/lib/initial-parts";
import type { Part } from "@/app/build/types/parts";
import type { CreateOrderInput, OrderItemInput } from "@/lib/orders-api";

function partMongoId(part: Part): string {
  return part.id;
}

export function orderItemsFromBuildRows(rows: BuildRow[]): OrderItemInput[] {
  return rows
    .filter((row): row is BuildRow & { part: Part } => Boolean(row.part))
    .map((row) => ({
      productId: partMongoId(row.part),
      name: row.part.name,
      quantity: 1,
      unitPrice: row.part.price,
    }));
}

export function buildOrderPayload(
  rows: BuildRow[],
  user: { email: string; username: string; displayName?: string },
  currency = "USD",
): CreateOrderInput {
  const items = orderItemsFromBuildRows(rows);
  if (items.length === 0) {
    throw new Error("Захиалгад нэмэх эд анги сонгоно уу");
  }

  return {
    customerName: user.displayName || user.username,
    customerEmail: user.email,
    items,
    currency,
    notes: "PC угсралт хуудаснаас",
  };
}
