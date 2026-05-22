"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { formatPartPrice } from "@/app/build/lib/initial-parts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import { useBasket } from "@/contexts/basket-context";
import {
  readDeliveryForm,
  writeDeliveryForm,
  type DeliveryForm,
} from "@/lib/delivery-storage";
import { createOrder } from "@/lib/orders-api";

function priceFmt(amount: number, currency: string) {
  return formatPartPrice(amount, currency);
}

const emptyDelivery: DeliveryForm = {
  street: "",
  city: "",
  state: "",
  zip: "",
  country: "Mongolia",
  customerPhone: "",
};

export default function BasketPage() {
  const router = useRouter();
  const { user, refreshOrderCount } = useAuth();
  const { builds, itemCount, removeBuild, clearBasket } = useBasket();
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const [delivery, setDelivery] = useState<DeliveryForm>(emptyDelivery);

  useEffect(() => {
    const saved = readDeliveryForm();
    if (saved) setDelivery(saved);
  }, []);

  const grandTotal = builds.reduce((s, b) => s + b.subtotal, 0);
  const currency = builds[0]?.currency ?? "USD";

  const updateDelivery = (patch: Partial<DeliveryForm>) => {
    setDelivery((prev) => ({ ...prev, ...patch }));
  };

  const handleCheckout = async () => {
    if (!user) {
      router.push(`/login?next=${encodeURIComponent("/basket")}`);
      return;
    }
    if (builds.length === 0) return;

    const street = delivery.street.trim();
    const city = delivery.city.trim();
    if (!street || !city) {
      setCheckoutError("Хүргэлтийн хаяг (гуулч, хот/дүүрэг) заавал бөглөнө үү.");
      return;
    }

    setCheckingOut(true);
    setCheckoutError(null);
    try {
      const allItems = builds.flatMap((b) => b.items);
      const shippingAddress = {
        street,
        city,
        ...(delivery.state?.trim() ? { state: delivery.state.trim() } : {}),
        ...(delivery.zip?.trim() ? { zip: delivery.zip.trim() } : {}),
        country: delivery.country?.trim() || "Mongolia",
      };
      const customerPhone = delivery.customerPhone?.trim();

      await createOrder({
        customerName: user.displayName || user.username,
        customerEmail: user.email,
        ...(customerPhone ? { customerPhone } : {}),
        items: allItems,
        currency,
        shippingAddress,
        notes: `Сагснаас: ${builds.length} угсралт`,
      });

      writeDeliveryForm({ ...delivery, street, city });
      clearBasket();
      await refreshOrderCount();
      router.push("/orders");
    } catch (err) {
      setCheckoutError(
        err instanceof Error ? err.message : "Захиалга үүсгэхэд алдаа гарлаа",
      );
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#2c2f38]">Сагс</h1>
          <p className="text-sm text-[#7f8695]">
            {itemCount > 0
              ? `${builds.length} угсралт · ${itemCount} эд анги`
              : "Сагс хоосон байна"}
          </p>
        </div>
        <Link
          href="/build"
          className="inline-flex h-10 items-center justify-center rounded-xl border border-[#e4e7ef] bg-white px-4 text-sm font-medium text-[#2c2f38] hover:bg-[#f5f6fa]"
        >
          PC угсралт
        </Link>
      </div>

      {builds.length === 0 ? (
        <div className="rounded-[18px] border border-dashed border-[#e4e7ef] bg-white p-12 text-center">
          <p className="mb-4 text-[#7f8695]">
            PC угсралт хуудаснаас эд анги сонгоод сагсанд нэмнэ үү.
          </p>
          <Button
            type="button"
            className="rounded-xl bg-[#2f7df6] hover:bg-[#2568d4]"
            onClick={() => router.push("/build")}
          >
            PC угсралт руу
          </Button>
        </div>
      ) : (
        <>
          <ul className="space-y-4">
            {builds.map((build) => (
              <li
                key={build.id}
                className="rounded-[18px] border border-[#ececf2] bg-white p-5 shadow-sm"
              >
                <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h2 className="font-semibold text-[#2c2f38]">{build.title}</h2>
                    <p className="text-xs text-[#9aa1af]">
                      {new Date(build.addedAt).toLocaleString("mn-MN")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-[#2f7df6]">
                      {priceFmt(build.subtotal, build.currency)}
                    </span>
                    <button
                      type="button"
                      className="text-sm text-rose-600 hover:underline"
                      onClick={() => removeBuild(build.id)}
                    >
                      Устгах
                    </button>
                  </div>
                </div>
                <ul className="space-y-1 text-sm text-[#5b6270]">
                  {build.items.map((item, i) => (
                    <li key={`${build.id}-${i}`}>
                      {item.name} × {item.quantity} —{" "}
                      {priceFmt(item.unitPrice * item.quantity, build.currency)}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>

          <div className="rounded-[18px] border border-[#ececf2] bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-[#2c2f38]">
              Хүргэлтийн хаяг
            </h2>
            <div className="mb-6 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="delivery-street">Гудамж, байр, тоот</Label>
                <Input
                  id="delivery-street"
                  value={delivery.street}
                  onChange={(e) => updateDelivery({ street: e.target.value })}
                  placeholder="Жишээ: Сүхбаатарын гудамж 1-р хороо, 5-р байр"
                  className="h-10 rounded-xl"
                  disabled={checkingOut}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="delivery-city">Хот / дүүрэг</Label>
                <Input
                  id="delivery-city"
                  value={delivery.city}
                  onChange={(e) => updateDelivery({ city: e.target.value })}
                  placeholder="Улаанбаатар"
                  className="h-10 rounded-xl"
                  disabled={checkingOut}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="delivery-state">Хороо (заавал биш)</Label>
                <Input
                  id="delivery-state"
                  value={delivery.state ?? ""}
                  onChange={(e) => updateDelivery({ state: e.target.value })}
                  className="h-10 rounded-xl"
                  disabled={checkingOut}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="delivery-zip">Шуудангийн индекс (заавал биш)</Label>
                <Input
                  id="delivery-zip"
                  value={delivery.zip ?? ""}
                  onChange={(e) => updateDelivery({ zip: e.target.value })}
                  className="h-10 rounded-xl"
                  disabled={checkingOut}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="delivery-country">Улс</Label>
                <Input
                  id="delivery-country"
                  value={delivery.country ?? "Mongolia"}
                  onChange={(e) => updateDelivery({ country: e.target.value })}
                  className="h-10 rounded-xl"
                  disabled={checkingOut}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="delivery-phone">Утас</Label>
                <Input
                  id="delivery-phone"
                  type="tel"
                  value={delivery.customerPhone ?? ""}
                  onChange={(e) =>
                    updateDelivery({ customerPhone: e.target.value })
                  }
                  placeholder="99 123456"
                  className="h-10 rounded-xl"
                  disabled={checkingOut}
                />
              </div>
            </div>

            <div className="mb-4 flex justify-between text-lg">
              <span className="font-medium text-[#2c2f38]">Нийт дүн</span>
              <strong className="text-[#2f7df6]">
                {priceFmt(grandTotal, currency)}
              </strong>
            </div>

            {!user ? (
              <p className="mb-4 text-sm text-[#7f8695]">
                Захиалга өгөхийн тулд{" "}
                <Link href="/login?next=/basket" className="text-[#2f7df6] hover:underline">
                  нэвтэрнэ
                </Link>{" "}
                эсвэл{" "}
                <Link href="/signup?next=/basket" className="text-[#2f7df6] hover:underline">
                  бүртгүүлнэ
                </Link>{" "}
                үү.
              </p>
            ) : null}

            {checkoutError ? (
              <p className="mb-3 text-sm text-rose-600">{checkoutError}</p>
            ) : null}

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                className="h-11 flex-1 rounded-xl"
                onClick={clearBasket}
                disabled={checkingOut}
              >
                Сагс хоослох
              </Button>
              <Button
                type="button"
                className="h-11 flex-1 rounded-xl bg-[#2f7df6] hover:bg-[#2568d4]"
                disabled={checkingOut}
                onClick={() => void handleCheckout()}
              >
                {checkingOut
                  ? "Захиалга илгээж байна…"
                  : user
                    ? "Захиалга өгөх"
                    : "Нэвтрэх ба захиалах"}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
