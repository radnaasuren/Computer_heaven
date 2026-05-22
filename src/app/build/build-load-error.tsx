import Link from "next/link";

import { getPcPartsApiBaseUrl } from "@/lib/pc-parts-api";

type BuildLoadErrorProps = {
  message: string;
};

export function BuildLoadError({ message }: BuildLoadErrorProps) {
  const apiUrl = getPcPartsApiBaseUrl();

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-[#f5f6fa] px-6 py-16 font-sans text-[#2c2f38]">
      <div className="max-w-lg rounded-[18px] border border-amber-200 bg-white p-8 shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
        <h1 className="mb-2 text-xl font-semibold text-amber-900">
          Эд ангийн өгөгдөл ачаалахад алдаа гарлаа
        </h1>
        <p className="mb-4 text-sm leading-relaxed text-[#5b6270]">{message}</p>
        <p className="mb-6 text-sm text-[#7a8190]">
          PC Parts API ажиллаж байгаа эсэхийг шалгана уу:{" "}
          <code className="rounded bg-[#f3f5fb] px-1.5 py-0.5 text-xs">{apiUrl}</code>
        </p>
        <Link
          href="/"
          className="text-sm font-medium text-[#2f7df6] no-underline hover:underline"
        >
          Нүүр хуудас руу буцах
        </Link>
      </div>
    </div>
  );
}
