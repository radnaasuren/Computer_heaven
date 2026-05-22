export type PrebuiltSpecs = {
  targetResolution?: string;
  estimatedFps?: string;
  storage?: string;
  warranty?: string;
  targetUse?: string;
};

export type PrebuiltPC = {
  _id: string;
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  currency: string;
  components: Array<{
    productId: string;
    partType: string;
    name: string;
    slug: string;
  }>;
  images: string[];
  imageUrl: string;
  specs: PrebuiltSpecs;
  tags: string[];
  inStock: boolean;
  featured: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
};

type PrebuiltApiResponse = {
  success: boolean;
  data: PrebuiltPC[];
  count?: number;
  total?: number;
  page?: number;
  pages?: number;
};

const PREBUILT_API_URL =
  process.env.NEXT_PUBLIC_PREBUILT_API_URL ??
  "http://137.184.50.11:4000/api/pre-built-pcs";

export async function fetchPrebuiltPcs(): Promise<PrebuiltPC[]> {
  const res = await fetch(PREBUILT_API_URL, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch prebuilt PCs: ${res.status}`);
  }

  const json = (await res.json()) as PrebuiltApiResponse;
  return json.data ?? [];
}
