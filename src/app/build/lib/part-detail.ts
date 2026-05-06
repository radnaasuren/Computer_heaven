import type { Part, PartCategory, PartsMockData } from "@/app/build/types/parts";

function dash(v: string | number | null | undefined): string {
  if (v === null || v === undefined || v === "") return "—";
  return String(v);
}

function joinList(a: string[] | null | undefined): string {
  if (!a?.length) return "—";
  return a.join(", ");
}

export function findPart(
  data: PartsMockData,
  category: PartCategory,
  id: string,
): Part | null {
  if (!id) return null;
  const p = data.parts;
  switch (category) {
    case "cpu": {
      const x = p.cpu.find((i) => i.id === id);
      return x ? { category: "cpu", ...x } : null;
    }
    case "gpu": {
      const x = p.gpu.find((i) => i.id === id);
      return x ? { category: "gpu", ...x } : null;
    }
    case "ram": {
      const x = p.ram.find((i) => i.id === id);
      return x ? { category: "ram", ...x } : null;
    }
    case "motherboard": {
      const x = p.motherboard.find((i) => i.id === id);
      return x ? { category: "motherboard", ...x } : null;
    }
    case "psu": {
      const x = p.psu.find((i) => i.id === id);
      return x ? { category: "psu", ...x } : null;
    }
    case "case": {
      const x = p.case.find((i) => i.id === id);
      return x ? { category: "case", ...x } : null;
    }
    case "cooler": {
      const x = p.cooler.find((i) => i.id === id);
      return x ? { category: "cooler", ...x } : null;
    }
    case "fan": {
      const x = p.fan.find((i) => i.id === id);
      return x ? { category: "fan", ...x } : null;
    }
    case "storage": {
      const x = p.storage.find((i) => i.id === id);
      return x ? { category: "storage", ...x } : null;
    }
    default: {
      const _c: never = category;
      return _c;
    }
  }
}

export type PartDetailRow = { label: string; value: string };

export function partDetailRows(part: Part): PartDetailRow[] {
  switch (part.category) {
    case "cpu":
      return [
        { label: "Нэр", value: part.name },
        { label: "Брэнд", value: part.brand },
        { label: "Сокет", value: dash(part.socket) },
        { label: "Цөм / иш", value: `${dash(part.cores)} / ${dash(part.threads)}` },
        { label: "TDP (Вт)", value: dash(part.tdpWatts) },
        { label: "Дэмжих RAM төрөл", value: joinList(part.supportedMemoryTypes) },
        { label: "Гүйцэтгэлийн оноо", value: dash(part.aggregatePerformanceScore) },
      ];
    case "gpu":
      return [
        { label: "Нэр", value: part.name },
        { label: "Брэнд", value: part.brand },
        { label: "VRAM", value: dash(part.vram) },
        { label: "Урт (мм)", value: String(part.lengthMm) },
        { label: "TDP (Вт)", value: dash(part.tdpWatts) },
        { label: "Гүйцэтгэлийн оноо", value: dash(part.aggregatePerformanceScore) },
      ];
    case "ram":
      return [
        { label: "Нэр", value: part.name },
        { label: "Төрөл", value: part.type },
        { label: "Хурд", value: part.speed },
        { label: "Багтаамж", value: part.capacity },
        { label: "Модуль", value: part.modules },
      ];
    case "motherboard":
      return [
        { label: "Нэр", value: part.name },
        { label: "Брэнд", value: part.brand },
        { label: "Сокет", value: part.socket },
        { label: "Чипсет", value: part.chipset },
        { label: "RAM төрөл", value: part.ramType },
        { label: "Хэлбэр", value: part.formFactor },
      ];
    case "psu":
      return [
        { label: "Нэр", value: part.name },
        { label: "Хүч (Вт)", value: String(part.watt) },
        { label: "Үр ашиг", value: part.efficiency },
        { label: "Хэлбэр", value: part.formFactor },
        { label: "Модуль", value: part.modular },
      ];
    case "case":
      return [
        { label: "Нэр", value: part.name },
        { label: "Хэмжээ", value: part.size },
        { label: "Дэмжих эх хавтан", value: joinList(part.supportedMotherboardSizes) },
        { label: "GPU дээд урт (мм)", value: String(part.gpuMaxLengthMm) },
        { label: "Сэнс дээд өндөр (мм)", value: String(part.coolerMaxHeightMm) },
        { label: "Радиатор (мм)", value: joinList(part.radiatorSupportMm) },
      ];
    case "cooler":
      return [
        { label: "Нэр", value: part.name },
        { label: "Төрөл", value: part.type },
        { label: "Сокетууд", value: joinList(part.supportedSockets) },
        { label: "TDP дэмжлэг (Вт)", value: String(part.tdpSupportWatts) },
        { label: "Өндөр (мм)", value: dash(part.heightMm) },
        { label: "Радиатор (мм)", value: dash(part.radiatorSizeMm) },
      ];
    case "fan":
      return [
        { label: "Нэр", value: part.name },
        { label: "Хэмжээ (мм)", value: String(part.sizeMm) },
        { label: "Холболт", value: part.connectorType },
        { label: "RGB", value: part.rgb },
        { label: "Max RPM", value: String(part.maxRpm) },
      ];
    case "storage":
      return [
        { label: "Нэр", value: part.name },
        { label: "Төрөл", value: part.type },
        { label: "Багтаамж", value: part.capacity },
        { label: "Хурд", value: part.speed },
        { label: "Хэлбэр", value: part.formFactor },
      ];
    default: {
      const _p: never = part;
      return _p;
    }
  }
}
