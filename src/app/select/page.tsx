"use client";

import { useRouter } from "next/navigation";
import { ArrowRightLeft, PlusIcon } from "lucide-react";
import ActionItem from "@/components/ActionItem";
import { Separator } from "@/components/ui/separator";

export default function ChooseAction() {
  const router = useRouter();
  const onMigrate = () => {
    router.push("migrate");
  };

  const onCreate = () => {
    router.push("create");
  };

  return (
    <div className="min-h-screen bg-primary-gradient mt-8">
      <div className="relative pb-40">
        <div className="text-white py-4 px-4 md:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-semibold mb-4 leading-tight font-inter">
            Choose Your Action
          </h1>
          <p className="text-gray-400 leading-loose text-[1rem] max-w-3xl mx-auto my-8 font-inter">
            Select whether you want to migrate an existing token or launch a new
            one.
          </p>
          <div
            className="rounded-2xl bg-[#1d1d1b] p-8 max-w-lg mx-auto
                shadow-[8px_8px_20px_rgba(0,0,0,0.4),8px_8px_20px_rgba(255,255,255,0.08)]
                transition-all duration-300 ease-in-out"
          >
            <ActionItem
              icon={<PlusIcon />}
              subtitle="Create a new token on Solana and EVM chains"
              title="Launch New Token"
              onClick={onCreate}
            />
            <Separator
              orientation="horizontal"
              className="bg-white my-10 opacity-50 h-[0.5px] mx-auto"
            />
            <ActionItem
              icon={<ArrowRightLeft />}
              title="Migrate Existing Token"
              subtitle="Transfer your EVM token to Solana"
              onClick={onMigrate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
