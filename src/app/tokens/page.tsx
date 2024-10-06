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
import { useConfigStore } from "@/store/configStore";
import getAllTokens from "@/utils/api/getAllTokens";
import { useQuery } from "@tanstack/react-query";
import { Search, TrendingDown, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TokensPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["all-tokens"],
    queryFn: () => getAllTokens(),
  });
  const router = useRouter();
  const { setActiveDeploymentConfig } = useConfigStore();

  if (isLoading) return;

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
              {/* <SelectItem value="price">Price</SelectItem>
              <SelectItem value="marketCap">Market Cap</SelectItem> */}
              <SelectItem value="launchDate">Launch Date</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div
        className={`grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`}
      >
        {data &&
          data?.map((token) => (
            <div
              key={token.id}
              className="border border-border rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              <div className="flex items-center mb-4">
                <img
                  src={token.image_url}
                  alt={token.token_name}
                  width={48}
                  height={48}
                  className="rounded-full mr-4 object-contain"
                />
                <div>
                  <h2 className="text-xl font-semibold">{token.token_name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {token.symbol}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Price
                </p>
                <p className="text-lg font-semibold">$0.02</p>
              </div> */}
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    24h Change
                  </p>
                  <p
                    className={`text-lg font-semibold flex items-center ${
                      true ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {true ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    )}
                    2%
                  </p>
                </div>
                {/* <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Market Cap
                </p>
                <p className="text-lg font-semibold">$1M</p>
              </div> */}
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Volume (24h)
                  </p>
                  <p className="text-lg font-semibold">$2M</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Launched on 22th Sep 2024
              </p>
              <Button
                className="w-full mt-auto"
                variant={"outline"}
                onClick={() => {
                  setActiveDeploymentConfig(token.json_config);
                  router.push(`/transfer/${token.id}`);
                }}
              >
                Swap
              </Button>
            </div>
          ))}
      </div>
    </div>
  );
}
