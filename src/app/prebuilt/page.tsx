import PrebuiltPageClient from "./PrebuiltPageClient";
import { fetchPrebuiltPcs } from "@/lib/prebuilt";

export default async function PrebuiltPage() {
  const pcs = await fetchPrebuiltPcs();

  return <PrebuiltPageClient initialPcs={pcs} />;
}
