import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type FeaturedBuild = {
  name: string;
  cpu: string;
  gpu: string;
  price: string;
};

const featuredBuilds: FeaturedBuild[] = [
  { name: "Budget Gaming", cpu: "Ryzen 5", gpu: "RTX 4060", price: "$949" },
  { name: "Creator Tower", cpu: "Core Ultra 7", gpu: "RTX 4070", price: "$1,599" },
  { name: "Streaming Rig", cpu: "Ryzen 7", gpu: "RTX 4070 Super", price: "$1,849" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background px-6 py-12 text-foreground md:px-10">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">
              PC Build Configurator
            </p>
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              Start building your next desktop with `shadcn/ui`.
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
              This starter app is ready for custom configurator flows, pricing,
              and saved builds. The homepage already imports `Button`, `Card`,
              and `Input` components from `shadcn/ui`.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg">Create a build</Button>
            <Button variant="outline" size="lg">
              Browse presets
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {featuredBuilds.map((build) => (
              <Card key={build.name}>
                <CardHeader>
                  <CardTitle>{build.name}</CardTitle>
                  <CardDescription>
                    {build.cpu} + {build.gpu}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold">{build.price}</p>
                </CardContent>
                <CardFooter className="justify-between">
                  <span className="text-sm text-muted-foreground">
                    Ready to customize
                  </span>
                  <Button variant="ghost">Select</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Notify Me</CardTitle>
            <CardDescription>
              Collect leads for custom builds, stock drops, or new launch
              bundles.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">
                Email
              </label>
              <Input id="email" type="email" placeholder="builder@example.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="focus">
                Build focus
              </label>
              <Input id="focus" placeholder="Gaming, streaming, or workstation" />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Join waitlist</Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
