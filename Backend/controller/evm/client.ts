import {
  createPublicClient,
  createWalletClient,
  http,
  type WalletClient,
  type PublicClient,
} from "viem";
import {
  baseSepolia,
  optimismSepolia,
  arbitrumSepolia,
  type Chain,
} from "viem/chains";

const SupportedChains: { [key: string]: Chain } = {
  BaseSepolia: baseSepolia,
  OptimismSepolia: optimismSepolia,
  ArbitrumSepolia: arbitrumSepolia,
};

export function getClient(chainName: string): {
  walletClient: WalletClient;
  publicClient: PublicClient;
  chain: Chain;
} {
  const selectedChain = SupportedChains[chainName] as Chain;

  const walletClient = createWalletClient({
    chain: selectedChain,
    transport: http(selectedChain.rpcUrls.default.http[0]),
  });

  const publicClient = createPublicClient({
    chain: selectedChain,
    transport: http(selectedChain.rpcUrls.default.http[0]),
  });

  return { walletClient, publicClient, chain: selectedChain };
}
