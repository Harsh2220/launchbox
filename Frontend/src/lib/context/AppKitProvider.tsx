"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { mainnet, baseSepolia } from "@reown/appkit/networks";
import React, { type ReactNode } from "react";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";
import { projectId, wagmiAdapter } from "../walletconfig";

// Set up queryClient
const queryClient = new QueryClient();

if (!projectId) {
  throw new Error("Project ID is not defined");
}

const metadata = {
  name: "LaunchBox",
  description: "Your entry to solana",
  url: "https://launchbox.xyz", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [baseSepolia],
  defaultNetwork: mainnet,
  metadata: metadata,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});

function AppKitProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies
  );

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export default AppKitProvider;
