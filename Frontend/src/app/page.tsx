"use client";

import { BackgroundBeams } from "@/components/BackgroundBeams";
import { BentoDemo } from "@/components/FeaturesGrid";
import Footer from "@/components/Footer";
import SectionBtn from "@/components/SectionBtn";
import ToolTip from "@/components/ToolTip";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const navigateToActions = () => {
    router.push("/tokens");
  };
  return (
    <div className="min-h-screen bg-primary-gradient">
      <div className="relative pb-40">
        <ToolTip />
        <div className="text-white py-4 px-4 md:px-8 text-center">
          <h1 className="text-4xl md:text-7xl font-semibold mb-4 leading-loose font-inter">
            Bring your token to Solana
          </h1>
          <p className="text-gray-400 leading-loose text-[1rem] max-w-2xl mx-auto my-8 font-inter">
            ⁠A toolkit to launch any kind of token across various chains without
            liquidity fragmentation, losing token ownership, or giving up the
            control over token supply and minting
          </p>
          <button
            className="bg-white text-gray-900 font-semibold py-2 px-12 rounded-full text-md hover:bg-gray-200 transition duration-300 font-inter"
            onClick={navigateToActions}
          >
            Explore
          </button>
        </div>
      </div>
      <BackgroundBeams />
      <div>
        <SectionBtn content="Our Features" />
        <BentoDemo />
      </div>
      <Footer />
    </div>
  );
}
