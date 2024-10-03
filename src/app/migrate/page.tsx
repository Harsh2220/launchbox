"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { NetworkBase, NetworkOptimism } from "@web3icons/react";

const steps = ["Token Details", "Migration Setup", "Confirmation"];
const hubChains = [
  { id: "base-sepolia", name: "Base Sepolia", icon: NetworkBase },
  { id: "optimism-sepolia", name: "Optimism Sepolia", icon: NetworkOptimism },
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
    isOneWay: false,
  });
  const router = useRouter();

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      // Handle final submission
      console.log("Final form data:", formData);
      // Implement your submission logic here
    }
  };

  return (
    <div className="min-h-screen bg-primary-grad">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-semibold mb-12 text-white text-center">
          Migrate Your Token
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
              {index === currentStep && (
                <div className="p-4 bg-gray-800 bg-opacity-50 rounded-lg shadow-xl">
                  {index === 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="token_name"
                        placeholder="Token Name"
                        value={formData.token_name}
                        onChange={handleInputChange}
                        className="w-full p-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        required
                      />
                      <input
                        type="text"
                        name="symbol"
                        placeholder="Symbol"
                        value={formData.symbol}
                        onChange={handleInputChange}
                        className="w-full p-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        required
                      />
                      <input
                        type="text"
                        name="image_url"
                        placeholder="Image URL"
                        value={formData.image_url}
                        onChange={handleInputChange}
                        className="w-full p-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
                      />

                      <select
                        name="hub_chain"
                        value={formData.hub_chain}
                        onChange={handleInputChange}
                        className="w-full p-3 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        required
                      >
                        <option value="">Select Hub Chain</option>
                        {hubChains.map((chain) => (
                          <option key={chain.id} value={chain.id}>
                            {chain.name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        name="new_owner"
                        placeholder="New Owner Address"
                        value={formData.new_owner}
                        onChange={handleInputChange}
                        className="w-full p-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
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
                        className="w-full p-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 mb-4"
                        required
                      />
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="isOneWay"
                          checked={formData.isOneWay}
                          onChange={handleInputChange}
                          className="form-checkbox h-5 w-5 text-gray-600"
                        />
                        <label className="text-white">One-way Migration</label>
                      </div>
                    </>
                  )}
                  {index === 2 && (
                    <div className="text-white">
                      <h2 className="text-xl mb-4">Migration Summary</h2>
                      <ul className="list-disc list-inside space-y-2">
                        <li>Token Name: {formData.token_name}</li>
                        <li>Symbol: {formData.symbol}</li>
                        <li>Hub Chain: {formData.hub_chain}</li>
                        <li>Token Address: {formData.tokenAddress}</li>
                        <li>
                          One-way Migration: {formData.isOneWay ? "Yes" : "No"}
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              )}
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
              {currentStep === 1 ? "Start Migration" : "Next"}
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-100 text-gray-900 font-semibold py-2 px-6 rounded-full hover:bg-white transition duration-300 ml-auto"
              onClick={() => {
                // Handle final submission
                console.log("Final submission:", formData);
                // Implement your submission logic here
                router.push("/");
              }}
            >
              Confirm Migration
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
