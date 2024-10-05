"use client";

import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { NetworkBase, NetworkOptimism } from "@web3icons/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookImage, DollarSign, UserRound, Wallet } from "lucide-react";
import { useAppKit } from "@reown/appkit/react";
import { useAccount } from "wagmi";
import { Slider } from "@/components/ui/slider";
import registerMigration from "@/utils/api/registerMigration";
import initiateMigrate from "@/utils/api/migrate";
import getStatus from "@/utils/api/getStatus";
import { LoadingStates } from "@/utils/constants";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";

const steps = ["Token Details", "Migration Setup", "Status"];
const hubChains = [
  { id: "BaseSepolia", name: "Base Sepolia", icon: NetworkBase },
  { id: "OptimismSepolia", name: "Optimism Sepolia", icon: NetworkOptimism },
];

interface FormData {
  token_name: string;
  symbol: string;
  image_url: string;
  decimals: string;
  init_supply: string;
  hub_chain: string;
  new_owner: string;
  tokenAddress: string;
  outboundSupply: string;
  solPubKey: string;
  isOneWay: boolean;
}

export default function Migrate() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    token_name: "",
    symbol: "",
    image_url: "",
    decimals: "",
    init_supply: "",
    hub_chain: "",
    new_owner: "",
    tokenAddress: "",
    outboundSupply: "50",
    isOneWay: false,
    solPubKey: "",
  });
  const [tokenId, setTokenId] = useState("");
  const [currentState, setCurrentState] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const { open } = useAppKit();
  const { isConnected, address } = useAccount();

  const getStateIndexFromStatusText = (statusText: string) => {
    return LoadingStates.findIndex((state) => state.text === statusText);
  };

  const pollStatus = async () => {
    try {
      console.log("here in poll status");

      const response = await getStatus(tokenId);
      console.log("resposne from get status", response);

      const newStateIndex = getStateIndexFromStatusText(response.status);

      if (newStateIndex !== -1) {
        setCurrentState(newStateIndex);

        // If we've reached the last state, stop polling
        if (newStateIndex === LoadingStates.length - 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        }
      }
    } catch (error) {
      console.log("Error polling status:", error);
    }
  };

  const startPolling = () => {
    setCurrentState(0); // Reset to initial state
    intervalRef.current = setInterval(pollStatus, 1000); // Poll every 5 seconds
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSliderChange = (name: string) => (value: number[]) => {
    const newValue = value[0].toString();
    handleInputChange({
      target: { name, value: newValue, type: "range" },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      hub_chain: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      open();
      return;
    }
    if (currentStep < 1) {
      console.log("form data", formData);
      const response = await registerMigration({
        image_url: formData.image_url,
        new_owner: address as `0x${string}`,
        symbol: formData.symbol,
        token_name: formData.token_name,
        hub_chain: formData.hub_chain,
        decimals: parseInt(formData.decimals),
        init_supply: parseInt(formData.init_supply),
      });
      console.log("tokenId", response.migrationId);
      setTokenId(response.migrationId);
      setCurrentStep(currentStep + 1);
    } else {
      // Handle final submission
      await initiateMigrate({
        evmOwnerAddress: address as `0x${string}`,
        hubChain: formData.hub_chain,
        isOneWay: true,
        migrationId: tokenId,
        name: formData.token_name,
        solOwnerPubKey: formData.solPubKey,
        tokenAddress: formData.tokenAddress,
      });
      console.log("Final form data:", formData);
      setCurrentStep(currentStep + 1);
      startPolling();
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
          Migrate your token
        </h1>
        <h1 className="text-md md:text-md font-medium mb-12 text-white text-center mt-4 opacity-60 max-w-md mx-auto">
          Make an entry into the solana ecosystem by migrating your token from
          any evm chain to solana
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
                        <Select
                          onValueChange={handleSelectChange}
                          value={formData.hub_chain}
                        >
                          <SelectTrigger className="w-full h-12 px-4 py-3 rounded-xl bg-[#2F3035] border-[#5C5C5C] border-[1px] text-[#99A3AF] placeholder-[#99A3AF] text-lg focus:outline-none focus:ring-2 focus:ring-gray-400">
                            <SelectValue placeholder="Select Hub Chain" />
                          </SelectTrigger>
                          <SelectContent className="bg-white text-gray-900">
                            {hubChains.map((chain) => (
                              <SelectItem key={chain.id} value={chain.id}>
                                {chain.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <input
                          type="text"
                          name="decimals"
                          placeholder="Decimals"
                          value={formData.decimals}
                          onChange={handleInputChange}
                          className="w-full h-12 px-4 py-3 rounded-xl bg-[#2F3035] border-[#5C5C5C] border-[1px] text-white placeholder-[#99A3AF] text-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                          required
                        />
                        <input
                          type="text"
                          name="init_supply"
                          placeholder="Initial Supply"
                          value={formData.init_supply}
                          onChange={handleInputChange}
                          className="w-full h-12 px-4 py-3 rounded-xl bg-[#2F3035] border-[#5C5C5C] border-[1px] text-white placeholder-[#99A3AF] text-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                          required
                        />
                      </div>
                    )}
                    {index === 1 && (
                      <>
                        <input
                          type="text"
                          name="tokenAddress"
                          placeholder="Token Address"
                          value={formData.tokenAddress}
                          onChange={handleInputChange}
                          className="w-full h-12 px-4 py-3 rounded-xl bg-[#2F3035] border-[#5C5C5C] border-[1px] text-white placeholder-[#99A3AF] text-lg focus:outline-none focus:ring-2 focus:ring-gray-400 mb-4"
                          required
                        />
                        <input
                          type="text"
                          name="solPubKey"
                          placeholder="Solana Public Key"
                          value={formData.solPubKey}
                          onChange={handleInputChange}
                          className="w-full h-12 px-4 py-3 rounded-xl bg-[#2F3035] border-[#5C5C5C] border-[1px] text-white placeholder-[#99A3AF] text-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                          required
                        />
                        {!formData.isOneWay && (
                          <div className="space-y-6 mt-8 mb-4">
                            <div>
                              <label
                                htmlFor="outbound-slider"
                                className="block text-md font-medium text-gray-200 mb-2"
                              >
                                <span className="font-bold">
                                  Outbound Supply
                                </span>
                                : {formData.outboundSupply}%
                              </label>
                              <Slider
                                id="outbound-slider"
                                value={[parseInt(formData.outboundSupply) || 0]}
                                onValueChange={handleSliderChange(
                                  "outboundSupply"
                                )}
                                max={100}
                                step={1}
                                className="mt-2 px-2"
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="inbound-slider"
                                className="block text-md font-medium text-gray-200 mb-2"
                              >
                                Inbound Supply:{" "}
                                {100 - parseInt(formData.outboundSupply)}%
                              </label>
                              <Slider
                                id="inbound-slider"
                                value={[
                                  100 - parseInt(formData.outboundSupply),
                                ]}
                                onValueChange={(value) =>
                                  handleSliderChange("outboundSupply")([
                                    100 - value[0],
                                  ])
                                }
                                max={100}
                                step={1}
                                className="mt-2 px-2"
                              />
                            </div>
                          </div>
                        )}
                        <div className="flex items-center space-x-2 mt-2">
                          <input
                            type="checkbox"
                            name="isOneWay"
                            checked={formData.isOneWay}
                            onChange={handleInputChange}
                            className="form-checkbox h-5 w-5 text-gray-600"
                          />
                          <label className="text-white">
                            One-way Migration
                          </label>
                        </div>
                      </>
                    )}
                    {index === 2 && (
                      <div className="text-white">
                        <MultiStepLoader
                          loadingStates={LoadingStates}
                          loading
                          loadingState={currentState}
                        />
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
              {currentStep === 1
                ? "Start Migration"
                : isConnected
                ? "Next"
                : "Connect Wallet"}
            </motion.button>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}
