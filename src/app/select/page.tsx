"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

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
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 mt-12">
            {options.map((option, index) => (
              <motion.div
                key={index}
                className={`bg-white bg-opacity-10 p-8 rounded-xl cursor-pointer transition-all duration-300 w-[30rem] border-white  ${
                  selectedOption === index
                    ? "border-2"
                    : "border-[1px] border-opacity-20"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedOption(index)}
              >
                <div className="text-4xl mb-4">{option.icon}</div>
                <h2 className="text-2xl font-semibold mb-2">{option.title}</h2>
                <p className="text-gray-400">{option.description}</p>
              </motion.div>
            ))}
          </div>
          {selectedOption !== null && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-16 bg-white text-gray-900 font-semibold py-2 px-12 rounded-full text-md hover:bg-gray-200 transition duration-300 font-inter"
              onClick={onSubmit}
            >
              Continue
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
