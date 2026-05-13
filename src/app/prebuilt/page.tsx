"use client";

import { useState } from "react";
import {
  Cpu,
  Monitor,
  HardDrive,
  MemoryStick,
  Search,
  ShoppingCart,
  Tag,
} from "lucide-react";
import PrebuiltPCs from "@/data/prebuilt.json";

type PC = {
  id: number;
  title: string;
  category: string;
  price: string;
  img: string;
  specs: string;
  description: string;
  badge: string | null;
};

const CATEGORIES = ["Бүгд", "Gaming", "Office", "Workstation", "Budget"];

export default function PrebuiltPage() {
  const pcs: PC[] = PrebuiltPCs;
  const [activeCategory, setActiveCategory] = useState("Бүгд");
  const [search, setSearch] = useState("");

  const filtered = pcs.filter((pc) => {
    const matchCategory =
      activeCategory === "Бүгд" || pc.category === activeCategory;

    const matchSearch =
      pc.title.toLowerCase().includes(search.toLowerCase()) ||
      pc.specs.toLowerCase().includes(search.toLowerCase()) ||
      pc.description.toLowerCase().includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

  const getSpecs = (specs: string) => specs.split(" | ");
  const icons = [Cpu, Monitor, MemoryStick, HardDrive];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="max-w-7xl mx-auto px-6 py-14">
        {/* Header */}
        <div className="mb-12 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <p className="text-sm font-medium text-blue-600 mb-3">
              Ready to use PC
            </p>

            <h1 className="text-5xl font-bold tracking-tight mb-4">
              Бэлэн компьютер
            </h1>

            <p className="text-slate-500 text-lg max-w-2xl">
              Мэргэжлийн багийн угсарсан, туршсан, шууд ашиглахад бэлэн PC
              угсралтууд.
            </p>
          </div>

          {/* Search box */}
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

        {/* Category buttons */}
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

        {/* Result count */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">PC жагсаалт</h2>
          <p className="text-sm text-slate-500">
            {filtered.length} компьютер олдлоо
          </p>
        </div>

        {/* Cards */}
        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-16 text-center shadow-sm">
            <Monitor className="mx-auto mb-4 h-12 w-12 text-slate-300" />
            <p className="text-slate-500">Тохирох компьютер олдсонгүй.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((pc) => {
              const specList = getSpecs(pc.specs);

              return (
                <div
                  key={pc.id}
                  className="group rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden transition hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Image area */}
                  <div className="relative h-56 bg-slate-100 overflow-hidden">
                    {pc.img ? (
                      <img
                        src={pc.img}
                        alt={pc.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <Monitor className="h-20 w-20 text-slate-300" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                    {pc.badge && (
                      <div className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800 shadow-sm backdrop-blur">
                        <Tag className="h-3 w-3 text-blue-600" />
                        {pc.badge}
                      </div>
                    )}

                    <div className="absolute right-4 top-4 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                      {pc.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="mb-2 text-xl font-bold tracking-tight">
                      {pc.title}
                    </h3>

                    <p className="mb-5 line-clamp-2 text-sm leading-6 text-slate-500">
                      {pc.description}
                    </p>

                    {/* Specs */}
                    <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                      {specList.map((spec, index) => {
                        const Icon = icons[index] || Cpu;

                        return (
                          <div
                            key={index}
                            className="flex items-center gap-3 text-sm text-slate-700"
                          >
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white border border-slate-200">
                              <Icon className="h-4 w-4 text-blue-600" />
                            </div>
                            <span>{spec}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Price + button */}
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs text-slate-400">Үнэ</p>
                        <p className="text-2xl font-bold text-slate-950">
                          ₮{pc.price}
                        </p>
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