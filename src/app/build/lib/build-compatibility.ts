import type { PartsMockData } from "@/app/build/types/parts";

import type { BuilderState } from "./initial-parts";

export function resolveSelectedParts(
  data: PartsMockData,
  selection: BuilderState,
) {
  const p = data.parts;
  if (
    !selection.cpuId ||
    !selection.gpuId ||
    !selection.ramId ||
    !selection.motherboardId ||
    !selection.psuId ||
    !selection.caseId ||
    !selection.coolerId ||
    !selection.fanId ||
    !selection.storageId
  ) {
    return null;
  }
  const selectedCpu =
    p.cpu.find((item) => item.id === selection.cpuId) ?? p.cpu[0];
  const selectedGpu =
    p.gpu.find((item) => item.id === selection.gpuId) ?? p.gpu[0];
  const selectedRam =
    p.ram.find((item) => item.id === selection.ramId) ?? p.ram[0];
  const selectedMotherboard =
    p.motherboard.find((item) => item.id === selection.motherboardId) ??
    p.motherboard[0];
  const selectedPsu =
    p.psu.find((item) => item.id === selection.psuId) ?? p.psu[0];
  const selectedCase =
    p.case.find((item) => item.id === selection.caseId) ?? p.case[0];
  const selectedCooler =
    p.cooler.find((item) => item.id === selection.coolerId) ?? p.cooler[0];
  const selectedFan =
    p.fan.find((item) => item.id === selection.fanId) ?? p.fan[0];
  const selectedStorage =
    p.storage.find((item) => item.id === selection.storageId) ??
    p.storage[0];

  return {
    selectedCpu,
    selectedGpu,
    selectedRam,
    selectedMotherboard,
    selectedPsu,
    selectedCase,
    selectedCooler,
    selectedFan,
    selectedStorage,
  };
}

export function estimatedDrawWatts(
  selected: NonNullable<ReturnType<typeof resolveSelectedParts>>,
): number {
  return (
    (selected.selectedCpu.tdpWatts ?? 65) +
    (selected.selectedGpu.tdpWatts ?? 150) +
    45 +
    12
  );
}

export function totalBuildPrice(
  selected: NonNullable<ReturnType<typeof resolveSelectedParts>>,
): number {
  return [
    selected.selectedCpu.price,
    selected.selectedGpu.price,
    selected.selectedRam.price,
    selected.selectedMotherboard.price,
    selected.selectedPsu.price,
    selected.selectedCase.price,
    selected.selectedCooler.price,
    selected.selectedFan.price,
    selected.selectedStorage.price,
  ].reduce((sum, value) => sum + value, 0);
}

export type CompatibilityRow = {
  label: string;
  ok: boolean;
  detail: string;
};

/** Same rules as computerStore/components/builder-page.tsx */
export function buildCompatibilityRows(
  selected: NonNullable<ReturnType<typeof resolveSelectedParts>>,
  draw: number,
): CompatibilityRow[] {
  const {
    selectedCpu,
    selectedGpu,
    selectedRam,
    selectedMotherboard,
    selectedPsu,
    selectedCase,
    selectedCooler,
  } = selected;

  const cpuMotherboard = selectedCpu.socket === selectedMotherboard.socket;
  const ramMotherboard = selectedRam.type === selectedMotherboard.ramType;
  const ramCpu = selectedCpu.supportedMemoryTypes.some((type) =>
    type.toUpperCase().includes(selectedRam.type.toUpperCase()),
  );
  const psuHeadroom = selectedPsu.watt >= draw + 120;
  const coolerSocket = selectedCooler.supportedSockets.includes(
    selectedMotherboard.socket,
  );
  const coolerTdp =
    selectedCooler.tdpSupportWatts >= (selectedCpu.tdpWatts ?? 65);
  const caseMotherboard = selectedCase.supportedMotherboardSizes.includes(
    selectedMotherboard.formFactor,
  );
  const caseGpu = selectedGpu.lengthMm <= selectedCase.gpuMaxLengthMm;
  const caseCooler =
    selectedCooler.type === "Air Cooler"
      ? (selectedCooler.heightMm ?? 0) <= selectedCase.coolerMaxHeightMm
      : selectedCase.radiatorSupportMm.includes(
          `${selectedCooler.radiatorSizeMm}mm`,
        );

  return [
    {
      label: "CPU and motherboard socket",
      ok: cpuMotherboard,
      detail: `${selectedCpu.socket ?? "Unknown"} vs ${selectedMotherboard.socket}`,
    },
    {
      label: "RAM and motherboard memory type",
      ok: ramMotherboard,
      detail: `${selectedRam.type} vs ${selectedMotherboard.ramType}`,
    },
    {
      label: "RAM supported by CPU",
      ok: ramCpu,
      detail: selectedCpu.supportedMemoryTypes.join(", "),
    },
    {
      label: "PSU watt headroom",
      ok: psuHeadroom,
      detail: `${selectedPsu.watt}W selected, ~${draw}W estimated draw`,
    },
    {
      label: "Cooler socket support",
      ok: coolerSocket,
      detail: selectedCooler.supportedSockets.join(", "),
    },
    {
      label: "Cooler thermal support",
      ok: coolerTdp,
      detail: `${selectedCooler.tdpSupportWatts}W support for ${selectedCpu.tdpWatts ?? 65}W CPU`,
    },
    {
      label: "Case and motherboard size",
      ok: caseMotherboard,
      detail: `${selectedMotherboard.formFactor} board`,
    },
    {
      label: "Case and GPU length",
      ok: caseGpu,
      detail: `${selectedGpu.lengthMm}mm GPU, ${selectedCase.gpuMaxLengthMm}mm max`,
    },
    {
      label: "Case and cooler fit",
      ok: caseCooler,
      detail:
        selectedCooler.type === "Air Cooler"
          ? `${selectedCooler.heightMm}mm cooler, ${selectedCase.coolerMaxHeightMm}mm max`
          : `${selectedCooler.radiatorSizeMm}mm radiator support`,
    },
  ];
}
