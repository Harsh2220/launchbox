import { Coins, PlusCircle, Route, Share2Icon } from "lucide-react";

import { AnimatedBeamMultipleOutputDemo } from "@/components/ui/animated-beam-multiple-outputs";
import { AnimatedListDemo } from "@/components/ui/animated-list-demo";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import Marquee from "@/components/ui/marquee";
import { cn } from "@/lib/utils";
import { AnimatedBeamSingleDemo } from "./ui/animated-beam-single-output";

const features = [
  {
    Icon: (
      <PlusCircle className="h-12 w-12 origin-left transform-gpu text-neutral-700 transition-all duration-300 ease-in-out group-hover:scale-75" />
    ),
    name: "Minting New Tokens",
    description:
      "Create and launch new tokens directly on the Solana blockchain regardless of your project's native chain",
    href: "#",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-1",
    background: (
      <Marquee
        pauseOnHover
        className="absolute top-10 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] "
      >
        {[
          { name: "Create Token", body: "Design and configure your new token" },
          { name: "Set Parameters", body: "Define supply, name, and symbol" },
          { name: "Deploy", body: "Launch your token on Solana" },
          {
            name: "Manage",
            body: "Monitor and control your token post-launch",
          },
        ].map((f, idx) => (
          <figure
            key={idx}
            className={cn(
              "relative w-32 cursor-pointer overflow-hidden rounded-xl border p-4",
              "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
              "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
              "transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none"
            )}
          >
            <div className="flex flex-row items-center gap-2">
              <div className="flex flex-col">
                <figcaption className="text-sm font-medium dark:text-white ">
                  {f.name}
                </figcaption>
              </div>
            </div>
            <blockquote className="mt-2 text-xs">{f.body}</blockquote>
          </figure>
        ))}
      </Marquee>
    ),
  },
  {
    Icon: (
      <Route className="h-12 w-12 origin-left transform-gpu text-neutral-700 transition-all duration-300 ease-in-out group-hover:scale-75" />
    ),
    name: "Native Bridge",
    description:
      "Your token is now native to multiple chains, & it can travel natively across them",
    href: "#",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-2",
    background: (
      <AnimatedListDemo className="absolute right-2 top-4 h-[300px] w-full border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105" />
    ),
  },
  {
    Icon: (
      <Share2Icon className="h-12 w-12 origin-left transform-gpu text-neutral-700 transition-all duration-300 ease-in-out group-hover:scale-75" />
    ),
    name: "Migrations",
    description: "Migrate any EVM token to Solana",
    href: "#",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-2",
    background: (
      <AnimatedBeamMultipleOutputDemo className="absolute right-2 top-4 h-[300px] border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105" />
    ),
  },
  {
    Icon: (
      <Coins className="h-12 w-12 origin-left transform-gpu text-neutral-700 transition-all duration-300 ease-in-out group-hover:scale-75" />
    ),
    name: "Entry to solana",
    description: "Seamlessly deploy your EVM tokens to Solana",
    href: "#",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-1",
    background: <AnimatedBeamSingleDemo />,
  },
];

export function BentoDemo() {
  return (
    <BentoGrid className="max-w-5xl mx-auto py-8">
      {features.map((feature, idx) => (
        <BentoCard key={idx} {...feature} />
      ))}
    </BentoGrid>
  );
}
