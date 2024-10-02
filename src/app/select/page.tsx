"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, MoveRight, Plus, PlusIcon } from "lucide-react";
import ActionItem from "@/components/ActionItem";
import { Separator } from "@/components/ui/separator";

const options = [
  {
    title: "Migrate Existing Token",
    description: "Transfer your EVM token to Solana",
    icon: "🔄",
  },
  {
    title: "Launch New Token",
    description: "Create a new token on Solana and EVM chains",
    icon: "🚀",
  },
];

export default function ChooseAction() {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const router = useRouter();
  const onSubmit = () => {
    if (selectedOption === 0) {
      router.push("migrate");
      return;
    }
    router.push("migrate");
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
          <div className="rounded-2xl bg-[#1d1d1b] p-8 max-w-lg mx-auto">
            <ActionItem
              icon={<PlusIcon />}
              subtitle="Create a new token on Solana and EVM chains"
              title="Launch New Token"
              iconBgColor="purple"
            />
            <Separator
              orientation="horizontal"
              className="bg-white my-10 opacity-50 h-[0.5px] mx-auto"
            />
            <ActionItem
              icon={<ArrowRightLeft />}
              subtitle="Migrate Existing Token"
              title="Transfer your EVM token to Solana"
              iconBgColor="blue"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
