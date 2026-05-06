import type { Part } from "@/app/build/types/parts";

/** Short line under the part name for the builder row */
export function partSubtitle(part: Part): string {
  switch (part.category) {
    case "cpu":
      return `${part.brand} · ${part.cores ?? "—"}C/${part.threads ?? "—"}T · ${part.socket ?? "—"}`;
    case "gpu":
      return `${part.vram ?? "—"} · ${part.tdpWatts ?? "—"}W TDP · ${part.lengthMm}mm`;
    case "ram":
      return `${part.modules} · ${part.speed}`;
    case "motherboard":
      return `${part.formFactor} · ${part.ramType} · ${part.chipset}`;
    case "psu":
      return `${part.watt}W · ${part.efficiency} · ${part.modular}`;
    case "case":
      return `${part.size} · GPU ≤${part.gpuMaxLengthMm}mm`;
    case "cooler":
      return part.type === "Air Cooler"
        ? `Air · up to ${part.tdpSupportWatts}W`
        : `AIO · ${part.radiatorSizeMm}mm`;
    case "fan":
      return `${part.sizeMm}mm · ${part.connectorType} · ${part.rgb}`;
    case "storage":
      return `${part.type} · ${part.capacity} · ${part.speed}`;
    default: {
      const _x: never = part;
      return _x;
    }
  }
}

const LABEL: Record<Part["category"], string> = {
  cpu: "CPU",
  gpu: "Graphic Card",
  ram: "Memory",
  motherboard: "Motherboard",
  psu: "Power Supply",
  case: "Case",
  cooler: "CPU Cooler",
  fan: "Fan",
  storage: "Storage",
};

export function partTypeLabel(category: Part["category"]): string {
  return LABEL[category];
}
