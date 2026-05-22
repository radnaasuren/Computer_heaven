import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ClipboardList, Monitor } from "lucide-react";
import { fetchPrebuiltPcs } from "@/lib/prebuilt";

type BuildCard = {
  id: string;
  title: string;
  specs: string;
  price: string;
  img: string;
};

function formatPrice(price: number, currency: string) {
  if (currency === "USD") {
    return `$${price.toFixed(2)}`;
  }

  return `${currency} ${price.toFixed(2)}`;
}

export default async function Home() {
  const prebuiltPcs = await fetchPrebuiltPcs();
  const builds: BuildCard[] = prebuiltPcs.slice(0, 3).map((pc) => ({
    id: pc.id,
    title: pc.name,
    specs: pc.shortDescription,
    price: formatPrice(pc.price, pc.currency),
    img:
      pc.imageUrl ||
      pc.images?.[0] ||
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600",
  }));

  return (
    <>
      {/* HERO SECTION */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-10 py-10">
        {/* LEFT */}
        <div className="max-w-xl">
          <h1 className="text-5xl font-bold mb-4 text-[#1a1a2e]">
            Build Your Perfect PC
          </h1>

          <p className="text-gray-500 mb-8 text-lg">
            Smart recommendations based on your needs
          </p>

          <div className="flex gap-4 mb-10">
            <Link href="/survey">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-xl text-base font-semibold shadow-md">
                Start Survey
              </Button>
            </Link>

            <Link href="/build">
              <Button variant="outline" className="px-8 py-6 rounded-xl text-base font-semibold border-gray-300">
                Build Manually
              </Button>
            </Link>
          </div>

          {/* SMALL CARDS */}
          <div className="flex gap-4">
            <Link href="/survey" className="block">
              <Card className="p-5 w-64 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <ClipboardList className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="font-semibold text-base">Smart Survey</div>
                </div>
                <p className="text-sm text-gray-400">
                  Answer a few questions → get build
                </p>
              </Card>
            </Link>

            <Link href="/build" className="block">
              <Card className="p-5 w-64 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Monitor className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="font-semibold text-base">PC Builder</div>
                </div>
                <p className="text-sm text-gray-400">
                  Answer a few questions → get build
                </p>
              </Card>
            </Link>
          </div>
        </div>

      {/* RIGHT IMAGE */}
<div className="w-[480px] max-w-full flex items-center justify-center">
  <img
    src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600"
    alt="PC"
    className="w-full h-[420px] object-cover object-center drop-shadow-2xl rounded-2xl"
  />
</div>
      </div>

      {/* PREBUILT FEATURED BUILDS */}
      <div className="mt-8 pb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#1a1a2e]">Featured Prebuilt PCs</h2>
          <Link href="/prebuilt" className="text-blue-600 hover:underline font-medium">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {builds.map(({ id, title, specs, price, img }) => (
            <Card
              key={id}
              className="flex flex-row items-center gap-4 p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white cursor-pointer"
            >
              <img
                alt={title}
                src={img}
                className="w-20 h-20 object-cover rounded-xl shrink-0"
              />
              <div className="flex flex-col flex-1 min-w-0">
                <div className="font-semibold text-base text-[#1a1a2e] mb-1">{title}</div>
                <div className="text-sm text-gray-400 whitespace-pre-line">{specs}</div>
                <div className="font-bold text-base text-[#1a1a2e] mt-2">{price}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}