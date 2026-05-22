"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { BuildRow } from "@/app/build/lib/initial-parts";
import { orderItemsFromBuildRows } from "@/app/build/lib/build-order";
import {
  basketItemCount,
  readBasket,
  writeBasket,
  type BasketBuild,
} from "@/lib/basket-storage";

type BasketContextValue = {
  builds: BasketBuild[];
  itemCount: number;
  addBuildFromRows: (rows: BuildRow[], currency?: string) => BasketBuild;
  removeBuild: (id: string) => void;
  clearBasket: () => void;
};

const BasketContext = createContext<BasketContextValue | null>(null);

function buildTitle(rows: BuildRow[]): string {
  const cpu = rows.find((r) => r.category === "cpu")?.part?.name;
  const gpu = rows.find((r) => r.category === "gpu")?.part?.name;
  const parts = [cpu, gpu].filter(Boolean);
  return parts.length ? parts.join(" · ") : "PC угсралт";
}

function createBasketBuild(rows: BuildRow[], currency: string): BasketBuild {
  const items = orderItemsFromBuildRows(rows);
  if (items.length === 0) {
    throw new Error("Сагсанд нэмэх эд анги сонгоно уу");
  }
  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  return {
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `build-${Date.now()}`,
    title: buildTitle(rows),
    items,
    currency,
    subtotal,
    addedAt: new Date().toISOString(),
  };
}

export function BasketProvider({ children }: { children: React.ReactNode }) {
  const [builds, setBuilds] = useState<BasketBuild[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setBuilds(readBasket());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeBasket(builds);
  }, [builds, hydrated]);

  const addBuildFromRows = useCallback((rows: BuildRow[], currency = "USD") => {
    const entry = createBasketBuild(rows, currency);
    setBuilds((prev) => [...prev, entry]);
    return entry;
  }, []);

  const removeBuild = useCallback((id: string) => {
    setBuilds((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const clearBasket = useCallback(() => {
    setBuilds([]);
  }, []);

  const itemCount = useMemo(() => basketItemCount(builds), [builds]);

  const value = useMemo(
    () => ({
      builds,
      itemCount,
      addBuildFromRows,
      removeBuild,
      clearBasket,
    }),
    [builds, itemCount, addBuildFromRows, removeBuild, clearBasket],
  );

  return (
    <BasketContext.Provider value={value}>{children}</BasketContext.Provider>
  );
}

export function useBasket(): BasketContextValue {
  const ctx = useContext(BasketContext);
  if (!ctx) {
    throw new Error("useBasket must be used within BasketProvider");
  }
  return ctx;
}
