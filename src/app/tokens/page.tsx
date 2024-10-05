"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";

const tokens = [
  {
    id: 1,
    name: "Token A",
    symbol: "TKA",
    price: 0.5,
    priceChange: 5.2,
    marketCap: 1000000,
    launchDate: "2023-01-15",
    volume: 500000,
    image:
      "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/ethereum-eth-icon.png",
  },
  {
    id: 2,
    name: "Token B",
    symbol: "TKB",
    price: 1.2,
    priceChange: -2.8,
    marketCap: 5000000,
    launchDate: "2023-02-20",
    volume: 1500000,
    image: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
  },
  {
    id: 3,
    name: "Token C",
    symbol: "TKC",
    price: 0.8,
    priceChange: 1.5,
    marketCap: 3000000,
    launchDate: "2023-03-10",
    volume: 800000,
    image: "https://cryptologos.cc/logos/cardano-ada-logo.png",
  },
  {
    id: 4,
    name: "Token D",
    symbol: "TKD",
    price: 2.5,
    priceChange: -0.7,
    marketCap: 10000000,
    launchDate: "2023-04-05",
    volume: 2000000,
    image: "https://cryptologos.cc/logos/solana-sol-logo.png",
  },
  {
    id: 5,
    name: "Token E",
    symbol: "TKE",
    price: 0.3,
    priceChange: 10.1,
    marketCap: 500000,
    launchDate: "2023-05-12",
    volume: 300000,
    image: "https://cryptologos.cc/logos/polkadot-new-dot-logo.png",
  },
  {
    id: 6,
    name: "Token F",
    symbol: "TKF",
    price: 1.8,
    priceChange: -1.2,
    marketCap: 7000000,
    launchDate: "2023-06-18",
    volume: 1200000,
    image: "https://cryptologos.cc/logos/chainlink-link-logo.png",
  },
];

export default function TokensPage() {
  const [isGridView, setIsGridView] = useState(true);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Launched Tokens</h1>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input type="text" placeholder="Search tokens" className="pl-10" />
        </div>
        <div className="flex items-center gap-4">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="marketCap">Market Cap</SelectItem>
              <SelectItem value="launchDate">Launch Date</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div
        className={`grid gap-6 ${
          isGridView
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "grid-cols-1"
        }`}
      >
        {tokens.map((token) => (
          <div
            key={token.id}
            className="border border-border rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 flex flex-col"
          >
            <div className="flex items-center mb-4">
              <img
                src={token.image}
                alt={token.name}
                width={48}
                height={48}
                className="rounded-full mr-4 object-contain"
              />
              <div>
                <h2 className="text-xl font-semibold">{token.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {token.symbol}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Price
                </p>
                <p className="text-lg font-semibold">
                  ${token.price.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  24h Change
                </p>
                <p
                  className={`text-lg font-semibold flex items-center ${
                    token.priceChange >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {token.priceChange >= 0 ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  {token.priceChange.toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Market Cap
                </p>
                <p className="text-lg font-semibold">
                  ${token.marketCap.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Volume (24h)
                </p>
                <p className="text-lg font-semibold">
                  ${token.volume.toLocaleString()}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Launched on {token.launchDate}
            </p>
            <Button className="w-full mt-auto" variant={"outline"}>
              Swap
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
