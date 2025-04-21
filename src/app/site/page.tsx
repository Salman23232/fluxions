import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { pricingCards } from "@/lib/constants";
import clsx from "clsx";
import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="dark:bg-slate-950 dark:text-white bg-gray-300 text-slate-950 min-h-screen">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center w-full pt-36 px-4">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

        <p className="text-center text-muted-foreground text-lg z-10">
          Run your agency, in one place
        </p>

        <h1 className="text-7xl md:text-[200px] font-bold text-center bg-gradient-to-r from-blue-600 to-blue-950 bg-clip-text text-transparent z-10">
          Fluxion
        </h1>

        <div className="relative flex justify-center items-center -mt-10 md:-mt-16 z-10">
          <Image
            src="/assets/preview.png"
            alt="Fluxion app preview"
            width={1200}
            height={1200}
            className="rounded-t-2xl border-2 border-muted"
          />
          <div className="absolute inset-0 top-0 bg-gradient-to-t from-gray-950/80 to-transparent rounded-t-2xl z-20 pointer-events-none" />
        </div>
      </section>

      {/* Pricing Section */}
      <section className="flex flex-col items-center justify-center gap-4 mt-20 px-4">
        <h2 className="text-4xl text-center font-semibold text-white">Choose what fits you right</h2>
        <p className="text-center text-muted-foreground max-w-xl">
          Our straightforward pricing plans are tailored to meet your needs. If {`you're`} not ready to commit, you can get started for free.
        </p>

        <div className="flex flex-wrap justify-center gap-6 mt-8">
          {pricingCards.map((card) => {
            const isHighlighted = card.title === "Unlimited Saas";

            return (
              <Card
                key={card.title}
                className={clsx(
                  "bg-[#0a0a0a] text-white border border-[#1e1e1e] shadow-lg w-[300px] flex flex-col justify-between transition-all",
                  {
                    "border-blue-700 shadow-[0_0_20px_#3b82f6]": isHighlighted,
                  }
                )}
              >
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">{card.title}</CardTitle>
                  <CardDescription className="text-gray-600 text-sm">
                    {card.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{card.price}</span>
                    <span className="text-blue-600 text-sm">/m</span>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col items-start gap-4">
                  <div className="space-y-2">
                    {card.features.map((feature) => {
                      const isCrossed = feature.startsWith("~");
                      const cleanFeature = isCrossed ? feature.replace("~", "") : feature;

                      return (
                        <div key={feature} className="flex gap-2 items-center text-sm">
                          <Check
                            className={clsx("w-4 h-4", {
                              "text-blue-600": !isCrossed,
                              "text-gray-500 line-through": isCrossed,
                            })}
                          />
                          <p className={clsx({ "line-through text-gray-500": isCrossed })}>
                            {cleanFeature}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <Link
                    href={`/agency?plan=${card.priceId}`}
                    className={clsx(
                      "w-full text-center font-medium py-2 rounded-md transition-colors",
                      {
                        "bg-blue-800 hover:bg-blue-700 text-white": isHighlighted,
                        "bg-gray-700 text-white cursor-not-allowed": !isHighlighted,
                      }
                    )}
                  >
                    Get Started
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
