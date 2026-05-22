"use client";

import {
  Check,
  Cpu,
  HardDrive,
  MonitorSmartphone,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { BuildPerformanceEstimate } from "@/app/build/components/build-performance-estimate";
import { useBasket } from "@/contexts/basket-context";

import {
  buildCompatibilityRows,
  estimatedDrawWatts,
  resolveSelectedParts,
  totalBuildPrice,
} from "@/app/build/lib/build-compatibility";
import {
  buildRowsFromSelection,
  emptyBuilderSelection,
  formatPartPrice,
  partSelectOptions,
  type BuilderStateLoose,
} from "@/app/build/lib/initial-parts";
import { findPart, partDetailRows } from "@/app/build/lib/part-detail";
import { partSubtitle, partTypeLabel } from "@/app/build/lib/part-labels";
import type { PartsMockData } from "@/app/build/types/parts";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type PCBuildClientProps = {
  data: PartsMockData;
};

const PartThumb = () => (
  <div
    className="h-10 w-[52px] shrink-0 rounded-lg bg-gradient-to-br from-[#20242d] to-[#5a6270]"
    aria-hidden
  />
);

export function PCBuildClient({ data }: PCBuildClientProps) {
  const currency = data.currency ?? "MNT";
  const priceFmt = (amount: number) => formatPartPrice(amount, currency);
  const router = useRouter();
  const { addBuildFromRows } = useBasket();

  const [selection, setSelection] = useState<BuilderStateLoose>(emptyBuilderSelection);
  const [basketMessage, setBasketMessage] = useState<string | null>(null);
  const [pickOpen, setPickOpen] = useState(false);
  const [pickKey, setPickKey] = useState<keyof PartsMockData["defaults"] | null>(
    null,
  );
  const [pickPreviewId, setPickPreviewId] = useState("");

  const rows = useMemo(() => buildRowsFromSelection(data, selection), [data, selection]);

  const coreParts = useMemo(
    () => ({
      cpu: rows.find((r) => r.category === "cpu")?.part ?? null,
      gpu: rows.find((r) => r.category === "gpu")?.part ?? null,
      ram: rows.find((r) => r.category === "ram")?.part ?? null,
    }),
    [rows],
  );
  const hasMissing = rows.some((r) => !r.part);

  const resolved = useMemo(() => {
    const strict = selection as unknown as PartsMockData["defaults"];
    return resolveSelectedParts(data, strict);
  }, [data, selection]);

  const draw = useMemo(() => (resolved ? estimatedDrawWatts(resolved) : 0), [resolved]);

  const compatibility = useMemo(
    () => (resolved ? buildCompatibilityRows(resolved, draw) : []),
    [resolved, draw],
  );

  const subtotal = useMemo(() => (resolved ? totalBuildPrice(resolved) : 0), [resolved]);
  const allCompatible = !hasMissing && compatibility.every((c) => c.ok);
  const itemCount = rows.filter((r) => Boolean(r.part)).length;

  const openPicker = (key: keyof PartsMockData["defaults"]) => {
    const cat = rows.find((r) => r.defaultKey === key)?.category;
    const opts = cat ? partSelectOptions(cat, data) : [];
    const current = selection[key];
    const initial =
      current && opts.some((o) => o.value === current)
        ? current
        : (opts[0]?.value ?? "");
    setPickPreviewId(initial);
    setPickKey(key);
    setPickOpen(true);
  };

  const closePicker = () => {
    setPickOpen(false);
    setPickKey(null);
    setPickPreviewId("");
  };

  const applyPick = (key: keyof PartsMockData["defaults"], id: string) => {
    setSelection((current) => ({ ...current, [key]: id }));
    closePicker();
  };

  const handleAddToBasket = () => {
    if (itemCount === 0) {
      setBasketMessage("Эхлээд эд анги сонгоно уу");
      return;
    }
    try {
      addBuildFromRows(rows, data.currency ?? "USD");
      setBasketMessage("Сагсанд нэмэгдлээ");
    } catch (err) {
      setBasketMessage(
        err instanceof Error ? err.message : "Сагсанд нэмэхэд алдаа гарлаа",
      );
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#f5f6fa] font-sans text-[#2c2f38]">
        <div className="mx-auto max-w-[1400px] px-[22px] py-[22px]">
          <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-[#5b6270]">
            <span className="rounded-full border border-[#ececf2] bg-white px-3 py-1">
              {data.parts.cpu.length} CPU
            </span>
            <span className="rounded-full border border-[#ececf2] bg-white px-3 py-1">
              {data.parts.gpu.length} GPU
            </span>
            <span className="rounded-full border border-[#ececf2] bg-white px-3 py-1">
              {data.parts.ram.length} RAM
            </span>
            <span className="rounded-full border border-[#ececf2] bg-white px-3 py-1">
              {data.parts.motherboard.length} эх хавтан
            </span>
          </div>

          <div className="grid gap-[18px] lg:grid-cols-[2.1fr_0.9fr]">
            <section className="space-y-[18px]">
              <div className="rounded-[18px] border border-[#ececf2] bg-white p-4 pb-4 shadow-[0_4px_12px_rgba(0,0,0,0.03)] sm:p-5">
                <div className="mb-[18px] flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold">PC угсралт</h2>
                </div>

                <div className="flex flex-col">
                  {rows.map((row) => (
                    <div
                      key={row.category}
                      className="relative border-t border-[#eff1f5] py-3.5 pl-3 pr-2 first:border-t-0"
                    >
                      <span
                        className="absolute left-0 top-0 h-full w-1 rounded-[10px] bg-[#4ee26f]"
                        aria-hidden
                      />
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[130px_1fr_110px] sm:items-start sm:gap-3.5">
                        <div className="pl-2 pt-1 text-base text-[#666d79] sm:pl-3">
                          {partTypeLabel(row.category)}
                        </div>
                        <div className="min-w-0 pl-2 sm:pl-0">
                          <div className="flex items-start gap-4">
                            <PartThumb />
                            <div className="min-w-0 flex-1">
                              {row.part ? (
                                <>
                                  <h4 className="mb-1 text-base font-semibold leading-tight">
                                    {row.part.name}
                                  </h4>
                                  <p className="mb-2 text-xs text-[#959cab]">
                                    {partSubtitle(row.part)}
                                  </p>
                                </>
                              ) : (
                                <h4 className="mb-1 text-base font-semibold leading-tight">
                                  Эд анги сонгоогүй
                                </h4>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="pl-2 text-left font-medium text-[#5b6270] sm:pt-1 sm:text-right">
                          {!row.part && (
                            <Button
                              type="button"
                              variant="outline"
                              className="h-10 rounded-[10px] border-[#e4e7ef] bg-[#fafbff] px-3 text-sm"
                              onClick={() => openPicker(row.defaultKey)}
                            >
                              Сонгох
                            </Button>
                          )}
                          {row.part && (
                            <div className="mt-2 flex justify-start sm:justify-end">
                              <button
                                type="button"
                                className="flex size-9 items-center justify-center rounded-[10px] border border-[#e4e7ef] bg-[#fafbff] text-[22px] leading-none text-[#414856] hover:bg-[#f0f2f8]"
                                aria-label={`${partTypeLabel(row.category)} устгах`}
                                onClick={() =>
                                  setSelection((current) => ({
                                    ...current,
                                    [row.defaultKey]: "",
                                  }))
                                }
                              >
                                ×
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <BuildPerformanceEstimate coreParts={coreParts} />

              </div>
            </section>

            <aside className="space-y-[18px]">
              <div className="rounded-[18px] border border-[#ececf2] bg-white p-[18px] shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
                <h3 className="mb-4 text-lg font-semibold">Угсралтын тойм</h3>
                <div className="mb-3 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg border border-[#eceef4] bg-[#f9fafb] p-3">
                    <div className="mb-1 flex items-center gap-2 text-[#7f8695]">
                      <Cpu className="size-4" />
                      <span>Нийт</span>
                    </div>
                    <p className="text-lg font-semibold text-[#2c2f38]">
                      {priceFmt(subtotal)}
                    </p>
                  </div>
                  <div className="rounded-lg border border-[#eceef4] bg-[#f9fafb] p-3">
                    <div className="mb-1 flex items-center gap-2 text-[#7f8695]">
                      <Zap className="size-4" />
                      <span>Ойролцоо хэрэглээ</span>
                    </div>
                    <p className="text-lg font-semibold text-[#2c2f38]">
                      {resolved ? `${draw}W` : "—"}
                    </p>
                  </div>
                  <div className="rounded-lg border border-[#eceef4] bg-[#f9fafb] p-3">
                    <div className="mb-1 flex items-center gap-2 text-[#7f8695]">
                      <MonitorSmartphone className="size-4" />
                      <span>CPU оноо</span>
                    </div>
                    <p className="text-lg font-semibold text-[#2c2f38]">
                      {resolved?.selectedCpu.aggregatePerformanceScore ?? "—"}
                    </p>
                  </div>
                  <div className="rounded-lg border border-[#eceef4] bg-[#f9fafb] p-3">
                    <div className="mb-1 flex items-center gap-2 text-[#7f8695]">
                      <HardDrive className="size-4" />
                      <span>GPU оноо</span>
                    </div>
                    <p className="text-lg font-semibold text-[#2c2f38]">
                      {resolved?.selectedGpu.aggregatePerformanceScore ?? "—"}
                    </p>
                  </div>
                </div>
                <div className="mb-3.5 flex justify-between text-[15px] text-[#8a90a0]">
                  <span>Дүн ({itemCount} эд анги)</span>
                  <span>{priceFmt(subtotal)}</span>
                </div>
                <div className="mb-4 flex justify-between text-[15px] text-[#8a90a0]">
                  <span>Ойролцоо ватт</span>
                  <span>
                    {resolved ? `${draw}W / PSU ${resolved.selectedPsu.watt}W` : "—"}
                  </span>
                </div>
                <hr className="my-4 border-0 border-t border-[#eceef4]" />
                <div className="mb-5 flex items-center justify-between text-lg">
                  <span>Нийт</span>
                  <strong className="text-[22px] font-bold">{priceFmt(subtotal)}</strong>
                </div>
                <Button
                  type="button"
                  className="mb-2 h-auto w-full rounded-[10px] bg-[#2f7df6] py-3.5 text-base hover:bg-[#2568d4]"
                  onClick={handleAddToBasket}
                >
                  Сагсанд нэмэх
                </Button>
                {basketMessage ? (
                  <p
                    className={cn(
                      "mb-3 text-center text-sm",
                      basketMessage.includes("нэмэгдлээ")
                        ? "text-emerald-700"
                        : "text-rose-600",
                    )}
                  >
                    {basketMessage}{" "}
                    {basketMessage.includes("нэмэгдлээ") ? (
                      <button
                        type="button"
                        className="font-medium text-[#2f7df6] underline"
                        onClick={() => router.push("/basket")}
                      >
                        Сагс харах
                      </button>
                    ) : null}
                  </p>
                ) : null}
                <a
                  href="#"
                  className="block text-center text-sm text-[#7f8695] no-underline hover:underline"
                >
                  Харьцуулалт харах
                </a>
              </div>

              <div
                className={cn(
                  "rounded-[18px] border bg-white p-[18px] shadow-[0_4px_12px_rgba(0,0,0,0.03)]",
                  allCompatible ? "border-[#ececf2]" : "border-amber-200",
                )}
              >
                <div className="mb-2.5 flex items-center gap-3">
                  <div
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-full text-white",
                      allCompatible ? "bg-[#26c768]" : "bg-amber-500",
                    )}
                  >
                    {allCompatible ? (
                      <Check className="size-4" strokeWidth={3} />
                    ) : (
                      <span className="text-sm font-bold">!</span>
                    )}
                  </div>
                  <h4
                    className={cn(
                      "text-lg font-semibold",
                      allCompatible ? "text-[#3d8f61]" : "text-amber-800",
                    )}
                  >
                    {allCompatible
                      ? "Бүх эд анги хоорондоо нийцтэй"
                      : "Нийцтэй байдлыг шалгана уу"}
                  </h4>
                </div>
                <p className="text-sm leading-relaxed text-[#7f8795]">
                  {allCompatible
                    ? "Энэ угсралт үндсэн дүрмүүдийг давж байна."
                    : "Доорх шалгалтуудын нэг буюу хэд хэд нь асуудалтай байна."}
                </p>
              </div>

              <div className="rounded-[18px] border border-[#ececf2] bg-white p-[18px] shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
                <h3 className="mb-3 text-lg font-semibold">Нийцтэй байдлын шалгалт</h3>
                <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
                  {compatibility.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-start justify-between gap-3 rounded-[10px] border border-[#eef1f6] px-3 py-2.5 text-sm"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-[#2c2f38]">{item.label}</p>
                        <p className="text-xs text-[#8a90a0]">{item.detail}</p>
                      </div>
                      <span
                        className={cn(
                          "shrink-0 rounded-md px-2 py-0.5 text-xs font-medium",
                          item.ok
                            ? "bg-emerald-50 text-emerald-800"
                            : "bg-rose-50 text-rose-800",
                        )}
                      >
                        {item.ok ? "Зөв" : "Зөрүүтэй"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <Dialog
        open={pickOpen}
        onOpenChange={(open) => {
          if (!open) closePicker();
          else setPickOpen(true);
        }}
      >
        <DialogContent
          showCloseButton
          className="flex h-[min(560px,85vh)] w-[min(720px,calc(100%-2rem))] max-w-[720px] flex-col gap-0 overflow-hidden p-0 sm:max-w-[720px]"
        >
          <DialogHeader className="shrink-0 border-b border-[#ececf2] px-6 py-4">
            <DialogTitle>Эд анги сонгох</DialogTitle>
            {pickKey ? (
              <p className="text-sm font-normal text-muted-foreground">
                {partTypeLabel(
                  rows.find((r) => r.defaultKey === pickKey)?.category ?? "cpu",
                )}
              </p>
            ) : null}
          </DialogHeader>

          {pickKey ? (
            (() => {
              const cat = rows.find((r) => r.defaultKey === pickKey)?.category;
              const opts = cat ? partSelectOptions(cat, data) : [];
              const previewPart =
                cat && pickPreviewId ? findPart(data, cat, pickPreviewId) : null;
              const rowsDetail = previewPart ? partDetailRows(previewPart) : [];

              if (!cat || opts.length === 0) {
                return (
                  <div className="min-h-[320px] px-6 py-4 text-sm text-muted-foreground">
                    Энэ хэсэгт одоогоор илэрц алга.
                  </div>
                );
              }

              return (
                <div className="grid min-h-0 flex-1 grid-cols-1 divide-y divide-[#ececf2] md:grid-cols-[minmax(0,280px)_1fr] md:divide-x md:divide-y-0">
                  <div className="flex min-h-0 flex-col gap-2 p-4 md:p-5">
                    <label className="text-xs font-medium text-[#5b6270]">
                      Жагсаалтаас сонгох
                    </label>
                    <select
                      className="h-10 w-full shrink-0 rounded-[10px] border border-[#e4e7ef] bg-[#fafbff] px-3 text-sm text-[#2c2f38] outline-none focus:border-[#2f7df6]"
                      value={pickPreviewId}
                      onChange={(e) => setPickPreviewId(e.target.value)}
                    >
                      {opts.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="min-h-0 overflow-y-auto p-4 md:p-5">
                    {previewPart ? (
                      <div className="space-y-4">
                        <div className="flex gap-3">
                          <div
                            className="h-16 w-[72px] shrink-0 rounded-xl bg-gradient-to-br from-[#20242d] to-[#5a6270]"
                            aria-hidden
                          />
                          <div className="min-w-0">
                            <h3 className="text-base font-semibold leading-snug text-[#2c2f38]">
                              {previewPart.name}
                            </h3>
                            <p className="mt-1 text-sm text-[#7a8190]">
                              {partSubtitle(previewPart)}
                            </p>
                          </div>
                        </div>
                        <dl className="grid gap-x-4 gap-y-2 text-sm sm:grid-cols-[minmax(0,140px)_1fr]">
                          {rowsDetail.map((row) => (
                            <div key={row.label} className="contents">
                              <dt className="text-[#7a8190]">{row.label}</dt>
                              <dd className="font-medium text-[#2c2f38]">
                                {row.value}
                              </dd>
                            </div>
                          ))}
                          <div className="contents">
                            <dt className="text-[#7a8190]">Үнэ</dt>
                            <dd className="font-semibold text-[#2f7df6]">
                              {priceFmt(previewPart.price)}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Эд анги сонгоно уу.</p>
                    )}
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="min-h-[200px]" />
          )}

          <DialogFooter className="mx-0 mb-0 shrink-0 border-t border-[#ececf2] bg-[#fafbff]/80 px-6 py-3">
            <Button variant="outline" type="button" onClick={closePicker}>
              Хаах
            </Button>
            <Button
              type="button"
              disabled={!pickKey || !pickPreviewId}
              onClick={() => pickKey && applyPick(pickKey, pickPreviewId)}
            >
              Сонгох
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </>
  );
}
