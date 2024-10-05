"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  NetworkBase,
  NetworkOptimism,
  NetworkArbitrumOne,
  NetworkSolana,
} from "@web3icons/react";
import { BookImage, DollarSign, UserRound, Wallet } from "lucide-react";
import { useAppKit } from "@reown/appkit/react";
import { useAccount } from "wagmi";
import { Checkbox } from "@/components/ui/checkbox";
import registerNewToken from "@/utils/api/registerNewToken";
import { log } from "console";
import CreateMultichainToken from "@/utils/api/createMultichainToken";

const steps = ["Token Details", "Deployment Chains", "Confirmation"];
const deploymentChains = [
  { id: "OptimismSepolia", name: "Optimism Sepolia", icon: NetworkOptimism },
  {
    id: "ArbitrumSepolia",
    name: "Arbitrum Sepolia",
    icon: NetworkArbitrumOne,
  },
  { id: "BaseSepolia", name: "Base Sepolia", icon: NetworkBase },
  // { id: "Solana", name: "Solana", icon: NetworkSolana },
];

interface FormData {
  token_name: string;
  symbol: string;
  image_url: string;
  decimals: string;
  init_supply: string;
  deployment_chains: string[];
}

export default function LaunchMultiChainToken() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    token_name: "",
    symbol: "",
    image_url: "",
    decimals: "",
    init_supply: "",
    deployment_chains: [],
  });
  const router = useRouter();

  const { open } = useAppKit();
  const { isConnected, address } = useAccount();
  const [tokenId, setTokenId] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChainSelection = (chainId: string) => {
    console.log("got this chain", chainId);

    setFormData((prev) => {
      const updatedChains = prev.deployment_chains.includes(chainId)
        ? prev.deployment_chains.filter((id) => id !== chainId)
        : [...prev.deployment_chains, chainId];
      return { ...prev, deployment_chains: updatedChains };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      open();
      return;
    }
    if (currentStep === 0) {
      console.log("form data", formData);
      const response = await registerNewToken({
        image_url: formData.image_url,
        new_owner: address as `0x${string}`,
        symbol: formData.symbol,
        token_name: formData.token_name,
      });
      console.log("tokenId", response.token_id);
      setTokenId(response.token_id);

      setCurrentStep(currentStep + 1);
    } else if (currentStep === 1) {
      console.log("tokenId", tokenId);
      console.log("chains", formData.deployment_chains);

      CreateMultichainToken({
        token_id: tokenId,
        chainNames: formData.deployment_chains,
        tokenName: formData.token_name,
        tokenSymbol: formData.symbol,
      });
      setCurrentStep(currentStep + 1);
    } else {
      // Handle final submission
      console.log("Final form data:", formData);
      // Implement your submission logic here
    }
  };

  const fadeVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const fadeTransition = {
    duration: 0.5,
    ease: [0.4, 0.0, 0.2, 1],
  };

  return (
    <div className="min-h-screen bg-primary-grad">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-semibold text-white text-center mt-4">
          Launch Multi-Chain Native Token
        </h1>
        <h1 className="text-md md:text-md font-medium mb-12 text-white text-center mt-4 opacity-60 max-w-md mx-auto">
          Create and deploy your token across multiple chains simultaneously
        </h1>
        <ol className="relative border-l border-gray-600 space-y-12">
          {steps.map((step, index) => (
            <li key={step} className="mb-10 ml-6">
              <span
                className={`absolute flex items-center justify-center w-10 h-10 rounded-full -left-5 ring-8 ring-gray-900 ${
                  index <= currentStep
                    ? "bg-white text-gray-900"
                    : "bg-gray-700 text-gray-400"
                }`}
              >
                {index + 1}
              </span>
              <h3
                className={`text-lg font-semibold ml-4 pt-1 ${
                  index <= currentStep ? "text-white" : "text-gray-500"
                }`}
              >
                {step}
              </h3>
              <AnimatePresence mode="wait">
                {index === currentStep && (
                  <motion.div
                    key={index}
                    initial="hidden"
                    animate="visible"
                    variants={fadeVariants}
                    transition={fadeTransition}
                    className="p-4 rounded-lg shadow-xl"
                  >
                    {index === 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                          <input
                            type="text"
                            name="token_name"
                            placeholder="Token Name"
                            value={formData.token_name}
                            onChange={handleInputChange}
                            required
                            className="w-full h-12 px-4 py-3 rounded-xl bg-[#2F3035] border-[#5C5C5C] border-[1px] text-white placeholder-[#99A3AF] text-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                          />
                          <UserRound className="absolute right-6 top-3 h-6 w-6 text-[#99A3AF]" />
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            name="symbol"
                            placeholder="Symbol"
                            value={formData.symbol}
                            onChange={handleInputChange}
                            className="w-full h-12 px-4 py-3 rounded-xl bg-[#2F3035] border-[#5C5C5C] border-[1px] text-white placeholder-[#99A3AF] text-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                            required
                          />
                          <DollarSign className="absolute right-6 top-3 h-6 w-6 text-[#99A3AF]" />
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            name="image_url"
                            placeholder="Image URL"
                            value={formData.image_url}
                            onChange={handleInputChange}
                            className="w-full h-12 px-4 py-3 rounded-xl bg-[#2F3035] border-[#5C5C5C] border-[1px] text-white placeholder-[#99A3AF] text-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                          />
                          <BookImage className="absolute right-6 top-3 h-6 w-6 text-[#99A3AF]" />
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            name="init_supply"
                            placeholder="Initial Supply"
                            value={formData.init_supply}
                            onChange={handleInputChange}
                            className="w-full h-12 px-4 py-3 rounded-xl bg-[#2F3035] border-[#5C5C5C] border-[1px] text-white placeholder-[#99A3AF] text-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                            required
                          />
                          <Wallet className="absolute right-6 top-3 h-6 w-6 text-[#99A3AF]" />
                        </div>
                      </div>
                    )}
                    {index === 1 && (
                      <div className="space-y-4">
                        {deploymentChains.map((chain) => (
                          <div
                            key={chain.id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={chain.id}
                              checked={formData.deployment_chains.includes(
                                chain.id
                              )}
                              onCheckedChange={() =>
                                handleChainSelection(chain.id)
                              }
                            />
                            {<chain.icon />}
                            <label
                              htmlFor={chain.id}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white"
                            >
                              {chain.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                    {index === 2 && (
                      <div className="text-white">
                        <h2 className="text-xl mb-4">Launch Summary</h2>
                        <ul className="list-disc list-inside space-y-2">
                          <li>Token Name: {formData.token_name}</li>
                          <li>Symbol: {formData.symbol}</li>
                          <li>Initial Supply: {formData.init_supply}</li>
                          <li>
                            Deployment Chains:{" "}
                            {formData.deployment_chains.join(", ")}
                          </li>
                        </ul>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex justify-between">
          {currentStep > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-700 text-white font-semibold py-2 px-6 rounded-full hover:bg-gray-600 transition duration-300"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Back
            </motion.button>
          )}
          {currentStep < 2 ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-100 text-gray-900 font-semibold py-2 px-6 rounded-full hover:bg-white transition duration-300 ml-auto"
              onClick={handleSubmit}
            >
              {isConnected ? "Next" : "Connect Wallet"}
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-100 text-gray-900 font-semibold py-2 px-6 rounded-full hover:bg-white transition duration-300 ml-auto"
              onClick={() => {
                // Handle final submission
                console.log("Final submission:", formData);
                router.push("/");
              }}
            >
              Launch Token
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
