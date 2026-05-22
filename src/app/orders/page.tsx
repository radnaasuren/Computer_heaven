"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/contexts/auth-context";
import {
  fetchOrders,
  type OrderRecord,
  type ShippingAddress,
} from "@/lib/orders-api";

function formatMoney(amount: number, currency = "USD"): string {
  const locale = currency === "USD" ? "en-US" : "mn-MN";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "USD" ? 2 : 0,
  }).format(amount);
}

function formatDate(iso?: string): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("mn-MN");
  } catch {
    return iso;
  }
}

function formatShippingAddress(addr?: ShippingAddress): string | null {
  if (!addr?.street && !addr?.city) return null;
  const parts = [
    addr.street,
    addr.city,
    addr.state,
    addr.zip,
    addr.country,
  ].filter(Boolean);
  return parts.join(", ");
}

const STATUS_LABEL: Record<string, string> = {
  pending: "Хүлээгдэж буй",
  paid: "Төлсөн",
  processing: "Бэлтгэж буй",
  shipped: "Илгээсэн",
  delivered: "Хүргэгдсэн",
  cancelled: "Цуцлагдсан",
};

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadOrders = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchOrders({ limit: 50 });
      setOrders(res.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Захиалга ачаалахад алдаа");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) void loadOrders();
    else setOrders([]);
  }, [user, loadOrders]);

  if (authLoading) {
    return (
      <div className="mx-auto max-w-3xl py-16 text-center text-[#7f8695]">
        Ачаалж байна…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-lg rounded-[18px] border border-[#ececf2] bg-white p-10 text-center shadow-sm">
        <h1 className="mb-2 text-2xl font-semibold text-[#2c2f38]">Миний захиалга</h1>
        <p className="mb-6 text-sm text-[#7f8695]">
          Захиалга харахын тулд эхлээд нэвтэрнэ үү.
        </p>
        <Link
          href="/login?next=/orders"
          className="inline-flex h-10 items-center justify-center rounded-xl bg-[#2f7df6] px-6 text-sm font-medium text-white hover:bg-[#2568d4]"
        >
          Нэвтрэх
        </Link>
        <p className="mt-4 text-sm text-[#9aa1af]">
          Бүртгэл байхгүй юу?{" "}
          <Link href="/signup?next=/orders" className="text-[#2f7df6] hover:underline">
            Бүртгүүлэх
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-[#2c2f38]">Миний захиалга</h1>
          <p className="text-sm text-[#7f8695]">{user.username}</p>
        </div>
        <Link
          href="/build"
          className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-background px-3 text-sm font-medium hover:bg-muted"
        >
          PC угсралт
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-[#7f8695]">Захиалга ачаалж байна…</p>
      ) : error ? (
        <p className="text-sm text-rose-600">{error}</p>
      ) : orders.length === 0 ? (
        <div className="rounded-[18px] border border-dashed border-[#e4e7ef] bg-white p-10 text-center">
          <p className="mb-4 text-[#7f8695]">Одоогоор захиалга байхгүй.</p>
          <Link href="/basket" className="text-[#2f7df6] hover:underline">
            Сагс руу очих
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li
              key={order._id}
              className="rounded-[18px] border border-[#ececf2] bg-white p-5 shadow-sm"
            >
              <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-[#2c2f38]">
                    {STATUS_LABEL[order.status] ?? order.status}
                  </p>
                  <p className="text-xs text-[#9aa1af]">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <p className="text-lg font-bold text-[#2f7df6]">
                  {formatMoney(order.total, order.currency ?? "USD")}
                </p>
              </div>
              {formatShippingAddress(order.shippingAddress) ? (
                <p className="mb-2 text-sm text-[#5b6270]">
                  <span className="font-medium text-[#2c2f38]">Хүргэлт: </span>
                  {formatShippingAddress(order.shippingAddress)}
                  {order.customerPhone ? (
                    <span className="text-[#9aa1af]"> · {order.customerPhone}</span>
                  ) : null}
                </p>
              ) : null}
              <ul className="space-y-1 text-sm text-[#5b6270]">
                {order.items.map((item, i) => (
                  <li key={`${order._id}-${i}`}>
                    {item.name} × {item.quantity} —{" "}
                    {formatMoney(item.unitPrice * item.quantity, order.currency)}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
