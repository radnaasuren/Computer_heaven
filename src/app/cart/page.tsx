import type { Metadata } from "next";
import Link from "next/link";
import {
  Check,
  Search,
  Share2,
  ShoppingCart,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Cart · PC Builder",
  description: "Review your PC build and cart summary.",
};

const PART_ROWS = [
  {
    type: "CPU",
    title: "Intel Core i9-14900K",
    subtitle: "Intel Core i9 · 4.0GHz · 24 Cores",
    price: "$589.99",
  },
  {
    type: "CPU Cooler",
    title: "NZXT Kraken Elite 360 RGB",
    subtitle: "Liquid Cooler · RGB · 360mm",
    price: "$209.99",
  },
  {
    type: "Motherboard",
    title: "ASUS ROG MAXIMUS Z790 DARK HERO",
    subtitle: "ATX · DDR5 · WiFi",
    price: "$420.99",
  },
  {
    type: "Memory",
    title: "G.Skill Trident Z5 RGB 64 GB",
    subtitle: "2 × 32GB · DDR5-6400",
    price: "$214.99",
  },
  {
    type: "Storage",
    title: "Samsung 990 Pro 2 TB",
    subtitle: "NVMe SSD · PCIe 4.0",
    price: "$169.99",
  },
  {
    type: "Graphic Card",
    title: "NVIDIA Founders Edition RTX 4090",
    subtitle: "24GB GDDR6X",
    price: "$1,999.99",
  },
  {
    type: "Case",
    title: "Lian Li O11 Dynamic EVO",
    subtitle: "Mid Tower · Tempered Glass",
    price: "$149.99",
  },
  {
    type: "Power Supply",
    title: "Corsair RM850e (2023)",
    subtitle: "850W · 80+ Gold",
    price: "$99.99",
  },
] as const;

function PartThumb() {
  return (
    <div
      className="h-10 w-[52px] shrink-0 rounded-lg bg-gradient-to-br from-[#20242d] to-[#5a6270]"
      aria-hidden
    />
  );
}

export default function CartPage() {
  return (
    <div className="min-h-screen bg-[#f5f6fa] font-sans text-[#2c2f38]">
      <div className="mx-auto max-w-[1400px] px-[22px] py-[22px]">
        <header className="relative mb-[18px] flex items-center justify-center rounded-[18px] border border-[#ececf2] bg-[#f7f7fb] px-7 py-[22px]">
          <nav className="flex flex-wrap justify-center gap-8 text-lg md:gap-8">
            <Link
              href="/"
              className="text-[#707684] transition-colors hover:text-[#2d3445]"
            >
              Home
            </Link>
            <span className="cursor-default text-[#707684]">Survey</span>
            <Link
              href="/cart"
              className="font-semibold text-[#2d3445]"
            >
              PC Build
            </Link>
            <span className="cursor-default text-[#707684]">Бэлэн компьютер</span>
            <span className="cursor-default text-[#707684]">Benchmark</span>
          </nav>
          <div className="absolute right-7 flex items-center gap-[18px] text-[22px] text-[#495160]">
            <button
              type="button"
              className="rounded-md p-1 hover:bg-black/5"
              aria-label="Search"
            >
              <Search className="size-[22px]" strokeWidth={2} />
            </button>
            <div className="relative">
              <ShoppingCart className="size-[22px]" strokeWidth={2} />
              <span className="absolute -right-2.5 -top-2 flex size-4 items-center justify-center rounded-full bg-[#2bc66a] text-[11px] font-medium text-white">
                2
              </span>
            </div>
            <button
              type="button"
              className="rounded-md p-1 hover:bg-black/5"
              aria-label="Account"
            >
              <User className="size-[22px]" strokeWidth={1.75} />
            </button>
          </div>
        </header>

        <main className="grid gap-[18px] lg:grid-cols-[2.1fr_0.9fr]">
          <section className="space-y-[18px]">
            <div className="rounded-[18px] border border-[#ececf2] bg-white p-4 pb-2 shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
              <div className="mb-[18px] flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">PC Builder</h2>
                <Button
                  variant="outline"
                  className="h-auto gap-2 rounded-[10px] border-[#e5e7ef] bg-[#fafbff] px-3.5 py-2.5 font-normal text-[#7a8190]"
                >
                  <Share2 className="size-4" />
                  Share Build
                </Button>
              </div>

              <div className="flex flex-col">
                {PART_ROWS.map((row) => (
                  <div
                    key={row.type + row.title}
                    className="relative grid grid-cols-1 gap-3 border-t border-[#eff1f5] py-3.5 pl-3 pr-2 sm:grid-cols-[130px_1fr_110px_56px] sm:items-center sm:gap-3.5"
                  >
                    <span
                      className="absolute left-0 top-0 h-full w-1 rounded-[10px] bg-[#4ee26f]"
                      aria-hidden
                    />
                    <div className="pl-2 text-base text-[#666d79] sm:pl-3">
                      {row.type}
                    </div>
                    <div className="flex min-w-0 items-center gap-4 pl-2 sm:pl-0">
                      <PartThumb />
                      <div className="min-w-0">
                        <h4 className="mb-1 text-base font-semibold leading-tight">
                          {row.title}
                        </h4>
                        <p className="text-xs text-[#959cab]">{row.subtitle}</p>
                      </div>
                    </div>
                    <div className="pl-2 text-left font-medium text-[#5b6270] sm:text-right">
                      {row.price}
                    </div>
                    <div className="flex justify-start sm:justify-end">
                      <button
                        type="button"
                        className="flex size-9 items-center justify-center rounded-[10px] border border-[#e4e7ef] bg-[#fafbff] text-[22px] leading-none text-[#414856] hover:bg-[#f0f2f8]"
                        aria-label={`Remove ${row.type}`}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-[18px] md:grid-cols-2">
              <div className="rounded-[18px] border border-[#ececf2] bg-white p-[18px] shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Saved Builds</h3>
                  <a
                    href="#"
                    className="text-sm text-[#3878e8] no-underline hover:underline"
                  >
                    View All
                  </a>
                </div>
                <div className="grid grid-cols-[72px_1fr_auto] items-center gap-3.5">
                  <div
                    className="size-[72px] shrink-0 rounded-[10px] bg-gradient-to-br from-[#1d2330] to-[#4d5564]"
                    aria-hidden
                  />
                  <div className="min-w-0">
                    <h4 className="mb-1.5 text-base font-semibold">
                      High FPS Gaming Build
                    </h4>
                    <p className="mb-1.5 text-[13px] text-[#7e8696]">
                      Intel Core i9 · RTX 4090 · 64GB RAM
                    </p>
                    <span className="text-xs text-[#a0a6b3]">
                      Last updated: 2 days ago
                    </span>
                  </div>
                  <button
                    type="button"
                    className="shrink-0 rounded-[10px] bg-[#2f7df6] px-3.5 py-3 text-base text-white hover:bg-[#2568d4]"
                  >
                    $3,844.93
                  </button>
                </div>
              </div>

              <div className="rounded-[18px] border border-[#ececf2] bg-white p-[18px] shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Suggested Upgrade</h3>
                  <a
                    href="#"
                    className="text-sm text-[#3878e8] no-underline hover:underline"
                  >
                    Swap +$129
                  </a>
                </div>
                <div className="mb-4 grid grid-cols-[62px_1fr_auto] items-center gap-3.5">
                  <div
                    className="h-11 w-[62px] shrink-0 rounded-[10px] bg-gradient-to-br from-[#1d2330] to-[#4d5564]"
                    aria-hidden
                  />
                  <div>
                    <h4 className="mb-1.5 text-[15px] font-semibold">
                      Crucial T700
                    </h4>
                    <p className="text-xs text-[#8b92a0]">2TB PCIe 5.0 NVMe SSD</p>
                  </div>
                  <span className="font-medium text-[#5c6271]">$389.99</span>
                </div>
                <div className="grid grid-cols-[62px_1fr_auto] items-center gap-3.5">
                  <div
                    className="h-11 w-[62px] shrink-0 rounded-[10px] bg-gradient-to-br from-[#1d2330] to-[#4d5564]"
                    aria-hidden
                  />
                  <div>
                    <h4 className="mb-1.5 text-[15px] font-semibold">S3D</h4>
                    <p className="text-xs text-[#8b92a0]">770 Pro 1TB SSD</p>
                  </div>
                  <span className="font-medium text-[#5c6271]">$179.99</span>
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-[18px]">
            <div className="rounded-[18px] border border-[#ececf2] bg-white p-[18px] shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
              <h3 className="mb-4 text-lg font-semibold">Build Summary</h3>
              <div className="mb-3.5 flex justify-between text-[15px] text-[#8a90a0]">
                <span>Subtotal (8 items)</span>
                <span>$3,844.93</span>
              </div>
              <div className="mb-4 flex justify-between text-[15px] text-[#8a90a0]">
                <span>Estimated Wattage</span>
                <span>822W / 850W</span>
              </div>
              <hr className="my-4 border-0 border-t border-[#eceef4]" />
              <div className="mb-5 flex items-center justify-between text-lg">
                <span>Total</span>
                <strong className="text-[22px] font-bold">$3,844.93</strong>
              </div>
              <Button className="mb-3 h-auto w-full rounded-[10px] bg-[#2f7df6] py-3.5 text-base hover:bg-[#2568d4]">
                Add to Cart
              </Button>
              <a
                href="#"
                className="block text-center text-sm text-[#7f8695] no-underline hover:underline"
              >
                View Comparison
              </a>
            </div>

            <div className="rounded-[18px] border border-[#ececf2] bg-white p-[18px] shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
              <div className="mb-2.5 flex items-center gap-3">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#26c768] text-white">
                  <Check className="size-4" strokeWidth={3} />
                </div>
                <h4 className="text-lg font-semibold text-[#3d8f61]">
                  All components are compatible
                </h4>
              </div>
              <p className="text-sm leading-relaxed text-[#7f8795]">
                Great! No compatibility issues detected. You&apos;ve got a
                well-balanced build!
              </p>
            </div>

            <div className="rounded-[18px] border border-[#ececf2] bg-white p-[18px] shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
              <div className="mb-3.5 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Estimated Performance</h3>
                <span className="rounded-lg bg-[#f3f5fb] px-2.5 py-2 text-xs text-[#9aa1af]">
                  5861.39174
                </span>
              </div>
              <div className="mb-4 grid grid-cols-4 overflow-hidden rounded-[10px] bg-[#f4f6fb]">
                {(["1080p", "1440p", "4K", "8K"] as const).map((label, i) => (
                  <button
                    key={label}
                    type="button"
                    className={cn(
                      "py-3 text-sm text-[#7f8696] transition-colors",
                      i === 0
                        ? "bg-[#2f7df6] text-white"
                        : "hover:bg-black/5",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="flex justify-between border-b border-[#eef1f6] py-2.5 text-sm text-[#626a79]">
                <span>Cyberpunk 2077</span>
                <span>105 FPS</span>
              </div>
              <div className="flex justify-between border-b border-[#eef1f6] py-2.5 text-sm text-[#626a79]">
                <span>Call of Duty: Warzone</span>
                <span>185 FPS</span>
              </div>
              <div className="flex justify-between py-2.5 text-sm text-[#626a79]">
                <span>Counter-Strike 2</span>
                <span>400+ FPS</span>
              </div>
              <a
                href="#"
                className="mt-3.5 block text-center text-sm text-[#2f7df6] no-underline hover:underline"
              >
                View Full Benchmarks
              </a>
            </div>

            <div className="rounded-[18px] border border-[#ececf2] bg-white p-[18px] shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Recently Viewed Parts</h3>
                <a
                  href="#"
                  className="text-sm text-[#3878e8] no-underline hover:underline"
                >
                  View All
                </a>
              </div>
              <div className="mb-3.5 grid grid-cols-[50px_1fr_auto] items-center gap-3">
                <div
                  className="h-9 w-[50px] shrink-0 rounded-[10px] bg-gradient-to-br from-[#1d2330] to-[#4d5564]"
                  aria-hidden
                />
                <div>
                  <h4 className="mb-1 text-[15px] font-semibold">
                    Ryzen 7 7800X3D
                  </h4>
                  <p className="text-xs text-[#9aa1ae]">2 days ago</p>
                </div>
                <span className="text-sm text-[#5c6270]">$389.99</span>
              </div>
              <div className="grid grid-cols-[50px_1fr_auto] items-center gap-3">
                <div
                  className="h-9 w-[50px] shrink-0 rounded-[10px] bg-gradient-to-br from-[#1d2330] to-[#4d5564]"
                  aria-hidden
                />
                <div>
                  <h4 className="mb-1 text-[15px] font-semibold">
                    Lian Li GALAHAD II Trinity
                  </h4>
                  <p className="text-xs text-[#9aa1ae]">2 days ago</p>
                </div>
                <span className="text-sm text-[#5c6270]">$179.99</span>
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}
