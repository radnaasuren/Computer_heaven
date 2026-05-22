"use client";

import { useMemo, useState } from "react";
import {
  Cpu,
  Monitor,
  HardDrive,
  MemoryStick,
  Search,
  ShoppingCart,
  Tag,
} from "lucide-react";
import { PrebuiltPC } from "@/lib/prebuilt";

const CATEGORIES = ["Бүгд", "Gaming", "Office", "Workstation", "Budget"];

const mapCategory = (pc: PrebuiltPC) => {
  if (pc.tags.includes("gaming")) return "Gaming";
  if (pc.tags.includes("office")) return "Office";
  if (pc.tags.includes("workstation")) return "Workstation";
  if (pc.tags.includes("budget")) return "Budget";
  return "Other";
};

const formatPrice = (price: number, currency: string) => {
  if (currency === "USD") {
    return `$${price.toFixed(2)}`;
  }

  return `${currency} ${price.toFixed(2)}`;
};

const getSpecs = (specs: PrebuiltPC["specs"]) => {
  const result: string[] = [];

  if (specs.targetUse) result.push(specs.targetUse);
  if (specs.targetResolution) result.push(specs.targetResolution);
  if (specs.estimatedFps) result.push(specs.estimatedFps);
  if (specs.storage) result.push(specs.storage);
  if (specs.warranty) result.push(`Warranty: ${specs.warranty}`);

  return result;
};

type PrebuiltPageClientProps = {
  initialPcs: PrebuiltPC[];
};

export default function PrebuiltPageClient({ initialPcs }: PrebuiltPageClientProps) {
  const [activeCategory, setActiveCategory] = useState("Бүгд");
  const [search, setSearch] = useState("");

  const pcs = useMemo(
    () =>
      initialPcs.map((pc) => ({
        ...pc,
        category: mapCategory(pc),
      })),
    [initialPcs]
  );

  const filtered = useMemo(() => {
    const lowerSearch = search.toLowerCase();

    return pcs.filter((pc) => {
      const matchCategory =
        activeCategory === "Бүгд" || pc.category === activeCategory;
      const matchSearch =
        pc.name.toLowerCase().includes(lowerSearch) ||
        pc.description.toLowerCase().includes(lowerSearch) ||
        pc.shortDescription.toLowerCase().includes(lowerSearch) ||
        pc.tags.join(" ").toLowerCase().includes(lowerSearch);

      return matchCategory && matchSearch;
    });
  }, [pcs, activeCategory, search]);

  const icons = [Cpu, Monitor, MemoryStick, HardDrive];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="mb-12 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <p className="text-sm font-medium text-blue-600 mb-3">
              Ready to use PC
            </p>

            <h1 className="text-5xl font-bold tracking-tight mb-4">
              Бэлэн компьютер
            </h1>

            <p className="text-slate-500 text-lg max-w-2xl">
              Мэргэжлийн багийн угсарсан, туршсан, шууд ашиглахад бэлэн PC угсралтууд.
            </p>
          </div>

          <div className="relative w-full lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Компьютер хайх..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="mb-10 flex flex-wrap items-center gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition shadow-sm ${
                activeCategory === cat
                  ? "bg-blue-600 text-white shadow-blue-200"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">PC жагсаалт</h2>
          <p className="text-sm text-slate-500">{filtered.length} компьютер олдлоо</p>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-16 text-center shadow-sm">
            <Monitor className="mx-auto mb-4 h-12 w-12 text-slate-300" />
            <p className="text-slate-500">Тохирох компьютер олдсонгүй.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((pc) => {
              const specList = getSpecs(pc.specs);
              const image = pc.imageUrl || pc.images?.[0] || "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600";

              return (
                <div
                  key={pc.id}
                  className="group rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-56 bg-slate-100 overflow-hidden">
                    <img
                      src={image}
                      alt={pc.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute right-4 top-4 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                      {pc.category}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="mb-2 text-xl font-bold tracking-tight">{pc.name}</h3>
                    <p className="mb-5 line-clamp-2 text-sm leading-6 text-slate-500">
                      {pc.shortDescription}
                    </p>

                    <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                      {specList.map((spec, index) => {
                        const Icon = icons[index] || Cpu;

                        return (
                          <div key={index} className="flex items-center gap-3 text-sm text-slate-700">
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white border border-slate-200">
                              <Icon className="h-4 w-4 text-blue-600" />
                            </div>
                            <span>{spec}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs text-slate-400">Үнэ</p>
                        <p className="text-2xl font-bold text-slate-950">{formatPrice(pc.price, pc.currency)}</p>
                      </div>

                      <button className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
                        <ShoppingCart className="h-4 w-4" />
                        Сагсанд
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
