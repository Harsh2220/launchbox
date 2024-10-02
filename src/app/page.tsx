"use client";

import { BackgroundBeams } from "@/components/BackgroundBeams";
import { BentoDemo } from "@/components/FeaturesGrid";
import Navbar from "@/components/Navbar";
import SectionBtn from "@/components/SectionBtn";
import ToolTip from "@/components/ToolTip";
import Link from "next/link";

export default function Home() {
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
          <Link href={"/select"}>
            <button className="bg-white text-gray-900 font-semibold py-2 px-12 rounded-full text-md hover:bg-gray-200 transition duration-300 font-inter">
              Get Started
            </button>
          </Link>
        </div>
      </div>
      <div>
        <SectionBtn content="Our Features" />
        <BentoDemo />
      </div>
    </div>
  );
}
