"use client";

import React, { useState, useEffect } from "react";
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

interface MigrationStatus {
  status: string;
  message: string;
  updated_at: string;
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
  const [migrationId, setMigrationId] = useState<string | null>(null);
  const [migrationStatus, setMigrationStatus] =
    useState<MigrationStatus | null>(null);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentStep === 0) {
      try {
        const response = await fetch("/api/registerMigration", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        setMigrationId(data.migrationId);
        setCurrentStep(1);
      } catch (error) {
        console.error("Error registering migration:", error);
      }
    } else if (currentStep === 1) {
      try {
        await fetch("/api/migrate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            migrationId,
            tokenAddress: formData.tokenAddress,
            name: formData.token_name,
            hubChain: formData.hub_chain,
            isOneWay: formData.isOneWay,
          }),
        });
        setCurrentStep(2);
      } catch (error) {
        console.error("Error starting migration:", error);
      }
    }
  };

  useEffect(() => {
    const pollStatus = async () => {
      if (migrationId) {
        try {
          const response = await fetch(
            `/api/getStatus?migrationId=${migrationId}`
          );
          const data = await response.json();
          setMigrationStatus(data);
        } catch (error) {
          console.error("Error fetching status:", error);
        }
      }
    };

    const interval = setInterval(pollStatus, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [migrationId]);

  return (
    <div className="min-h-screen bg-primary-gradient">
      <div className="relative pb-40">
        <div className="text-white py-4 px-4 md:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-semibold mb-4 leading-tight font-inter">
            Migrate Your Token
          </h1>
          <div className="max-w-3xl mx-auto mt-12">
            <div className="flex justify-between mb-8">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className={`flex flex-col items-center ${
                    index <= currentStep ? "text-white" : "text-gray-500"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full ${
                      index <= currentStep ? "bg-white" : "bg-gray-700"
                    } flex items-center justify-center mb-2`}
                  >
                    <span
                      className={
                        index <= currentStep ? "text-gray-900" : "text-white"
                      }
                    >
                      {index + 1}
                    </span>
                  </div>
                  <span className="text-sm">{step}</span>
                </div>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="space-y-20">
              {currentStep === 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <input
                    type="text"
                    name="token_name"
                    placeholder="Token Name"
                    value={formData.token_name}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg bg-white bg-opacity-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="text"
                    name="symbol"
                    placeholder="Symbol"
                    value={formData.symbol}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg bg-white bg-opacity-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="text"
                    name="image_url"
                    placeholder="Image URL"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg bg-white bg-opacity-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex space-x-4">
                    <input
                      type="number"
                      name="decimals"
                      placeholder="Decimals"
                      value={formData.decimals}
                      onChange={handleInputChange}
                      className="w-1/2 p-3 rounded-lg bg-white bg-opacity-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <input
                      type="number"
                      name="init_supply"
                      placeholder="Initial Supply"
                      value={formData.init_supply}
                      onChange={handleInputChange}
                      className="w-1/2 p-3 rounded-lg bg-white bg-opacity-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="relative">
                    <select
                      name="hub_chain"
                      value={formData.hub_chain}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-lg bg-white bg-opacity-10 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Hub Chain</option>
                      {hubChains.map((chain) => (
                        <option key={chain.id} value={chain.id}>
                          {chain.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>

                  <input
                    type="text"
                    name="new_owner"
                    placeholder="New Owner Address"
                    value={formData.new_owner}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg bg-white bg-opacity-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              )}
              {currentStep === 1 && (
                <>
                  <input
                    type="text"
                    name="tokenAddress"
                    placeholder="Token Address"
                    value={formData.tokenAddress}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded bg-white bg-opacity-10 text-white"
                    required
                  />
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="isOneWay"
                      checked={formData.isOneWay}
                      onChange={handleInputChange}
                      className="form-checkbox h-5 w-5 text-white"
                    />
                    <label className="text-white">One-way Migration</label>
                  </div>
                </>
              )}
              {currentStep === 2 && (
                <div className="text-white">
                  <h2 className="text-2xl mb-4">Migration Status</h2>
                  {migrationStatus ? (
                    <>
                      <p>Status: {migrationStatus.status}</p>
                      <p>Message: {migrationStatus.message}</p>
                      <p>
                        Last Updated:{" "}
                        {new Date(migrationStatus.updated_at).toLocaleString()}
                      </p>
                    </>
                  ) : (
                    <p>Loading status...</p>
                  )}
                </div>
              )}
              {currentStep < 2 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-white text-gray-900 font-semibold py-2 px-4 rounded-full hover:bg-gray-200 transition duration-300 mt-40"
                  type="submit"
                >
                  {currentStep === 0 ? "Next" : "Start Migration"}
                </motion.button>
              )}
            </form>
            {currentStep === 2 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full mt-4 bg-white text-gray-900 font-semibold py-2 px-4 rounded-full hover:bg-gray-200 transition duration-300"
                onClick={() => router.push("/")}
              >
                Back to Home
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
