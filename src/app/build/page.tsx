import { fetchBuilderPartsCatalog } from "@/app/build/lib/fetch-builder-data";
import { BuildLoadError } from "@/app/build/build-load-error";
import { PCBuildClient } from "@/app/build/pc-build-client";

export default async function BuildPage() {
  try {
    const data = await fetchBuilderPartsCatalog();
    return <PCBuildClient data={data} />;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to load parts from API";
    return <BuildLoadError message={message} />;
  }
}
