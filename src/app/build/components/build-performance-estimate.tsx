"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import type { Part } from "@/app/build/types/parts";
import {
  fetchBuildBenchmarks,
  type PcPartsBenchmark,
} from "@/lib/pc-parts-api";
import { cn } from "@/lib/utils";

type PerfResolution = "1080p" | "1440p" | "4K" | "8K";

type CoreParts = {
  cpu: Part | null;
  gpu: Part | null;
  ram: Part | null;
};

type BuildPerformanceEstimateProps = {
  coreParts: CoreParts;
};

function matchesResolution(row: PcPartsBenchmark, resolution: PerfResolution): boolean {
  const r = row.resolution.trim().toLowerCase();
  if (resolution === "4K") return r === "4k";
  if (resolution === "8K") return r === "8k";
  return r === resolution.toLowerCase();
}

function fpsTone(fps: number): string {
  if (fps >= 120) return "text-emerald-600";
  if (fps >= 60) return "text-amber-600";
  return "text-rose-600";
}

export function BuildPerformanceEstimate({
  coreParts,
}: BuildPerformanceEstimateProps) {
  const [perfResolution, setPerfResolution] = useState<PerfResolution>("1080p");
  const [allBenchmarks, setAllBenchmarks] = useState<PcPartsBenchmark[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canFetch = Boolean(coreParts.cpu && coreParts.gpu && coreParts.ram);

  useEffect(() => {
    if (!canFetch || !coreParts.cpu || !coreParts.gpu || !coreParts.ram) {
      setAllBenchmarks([]);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    void fetchBuildBenchmarks({
      cpu: coreParts.cpu.name,
      gpu: coreParts.gpu.name,
      ram: coreParts.ram.name,
    })
      .then((items) => {
        if (!cancelled) setAllBenchmarks(items);
      })
      .catch((err) => {
        if (!cancelled) {
          setAllBenchmarks([]);
          setError(
            err instanceof Error ? err.message : "Бенчмарк ачаалахад алдаа гарлаа",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [canFetch, coreParts.cpu, coreParts.gpu, coreParts.ram]);

  const filtered = useMemo(
    () => allBenchmarks.filter((row) => matchesResolution(row, perfResolution)),
    [allBenchmarks, perfResolution],
  );

  const avgFps = useMemo(() => {
    if (!filtered.length) return null;
    const sum = filtered.reduce((acc, row) => acc + row.fps, 0);
    return Math.round(sum / filtered.length);
  }, [filtered]);

  const scoresBadge =
    coreParts.cpu?.category === "cpu" && coreParts.gpu?.category === "gpu"
      ? `CPU ${coreParts.cpu.aggregatePerformanceScore ?? "—"} · GPU ${coreParts.gpu.aggregatePerformanceScore ?? "—"}`
      : "—";

  return (
    <div className="mt-2 border-t border-[#ececf2] px-1 pb-4 pt-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <h3 className="text-2xl font-semibold tracking-tight text-[#2c2f38]">
          Гүйцэтгэлийн таамаг
        </h3>
        <span className="rounded-xl bg-[#f3f5fb] px-4 py-2.5 text-sm font-medium text-[#5b6270]">
          {canFetch ? scoresBadge : "CPU · GPU · RAM сонгоно уу"}
        </span>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-2 overflow-hidden rounded-xl bg-[#f4f6fb] p-1.5 sm:grid-cols-4">
        {(["1080p", "1440p", "4K", "8K"] as const).map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => setPerfResolution(label)}
            disabled={!canFetch}
            className={cn(
              "rounded-lg py-4 text-base font-medium transition-colors sm:text-lg",
              perfResolution === label
                ? "bg-[#2f7df6] text-white shadow-sm"
                : "text-[#7f8696] hover:bg-white/80",
              !canFetch && "cursor-not-allowed opacity-50",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="min-h-[180px] rounded-xl border border-[#e4e7ef] bg-[#fafbff] px-4 py-6 sm:px-6">
        {!canFetch ? (
          <p className="flex min-h-[140px] items-center justify-center text-center text-base leading-relaxed text-[#7f8695] sm:text-lg">
            CPU, GPU, RAM сонгосны дараа бенчмарк энд харагдана.
          </p>
        ) : loading ? (
          <p className="flex min-h-[140px] items-center justify-center text-center text-base text-[#7f8695]">
            Бенчмарк ачаалж байна…
          </p>
        ) : error ? (
          <p className="flex min-h-[140px] items-center justify-center text-center text-base text-rose-600">
            {error}
          </p>
        ) : filtered.length === 0 ? (
          <div className="flex min-h-[140px] flex-col items-center justify-center gap-2 text-center">
            <p className="text-base text-[#7f8695] sm:text-lg">
              {perfResolution} дээр бенчмарк олдсонгүй.
            </p>
            <p className="text-sm text-[#9aa1af]">
              {coreParts.cpu?.name} · {coreParts.gpu?.name} · {coreParts.ram?.name}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#eceef4] pb-5">
              <div>
                <p className="text-sm font-medium text-[#7f8695]">
                  {perfResolution} дундаж FPS
                </p>
                <p
                  className={cn(
                    "text-5xl font-bold tabular-nums tracking-tight sm:text-6xl",
                    avgFps !== null ? fpsTone(avgFps) : "text-[#2c2f38]",
                  )}
                >
                  {avgFps ?? "—"}
                </p>
              </div>
              <p className="max-w-sm text-right text-sm text-[#9aa1af]">
                {filtered.length} тоглоом · {coreParts.cpu?.name} · {coreParts.gpu?.name}
              </p>
            </div>

            <ul className="max-h-[280px] space-y-2 overflow-y-auto pr-1">
              {filtered.map((row) => (
                <li
                  key={row._id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[#eef1f6] bg-white px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-[#2c2f38]">{row.game}</p>
                    <p className="truncate text-xs text-[#9aa1af]">
                      {[row.settings, row.source].filter(Boolean).join(" · ") ||
                        row.chartLabel}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 text-2xl font-bold tabular-nums",
                      fpsTone(row.fps),
                    )}
                  >
                    {Math.round(row.fps)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <Link
        href="/benchmark"
        className="mt-5 flex w-full items-center justify-center rounded-xl bg-[#2f7df6] py-4 text-base font-medium text-white no-underline transition-colors hover:bg-[#2568d4]"
      >
        Бүх бенчмарк харах
      </Link>
    </div>
  );
}
