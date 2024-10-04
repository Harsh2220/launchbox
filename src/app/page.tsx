"use client";

import { BackgroundBeams } from "@/components/BackgroundBeams";
import { BentoDemo } from "@/components/FeaturesGrid";
import SectionBtn from "@/components/SectionBtn";
import ToolTip from "@/components/ToolTip";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const navigateToActions = () => {
    console.log("got the call");

    router.push("/select");
  };
  return (
    <div className="min-h-screen bg-primary-gradient ">
      <div className="relative pb-40">
        <BackgroundBeams />
        <ToolTip />
        <div className="text-white py-4 px-4 md:px-8 text-center">
          <h1 className="text-4xl md:text-7xl font-semibold mb-4 leading-loose font-inter">
            Migrate your tokens <br />
            from Ethereum to Solana
          </h1>
          <p className="text-gray-400 leading-loose text-[1rem] max-w-3xl mx-auto my-8 font-inter">
            Experience the future of digital transactions with our
            state-of-the-art blockchain technology. Our secure, decentralized
            platform ensures every transaction is transparent, immutable, and
            protected against fraud.
          </p>
          <button
            className="bg-white text-gray-900 font-semibold py-2 px-12 rounded-full text-md hover:bg-gray-200 transition duration-300 font-inter"
            onClick={navigateToActions}
          >
            Get Started
          </button>
        </div>
      </div>
      <div>
        <SectionBtn content="Our Features" />
        <BentoDemo />
      </div>
    </div>
  );
}
