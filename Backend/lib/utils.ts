export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const SupportedChainNames = [
  "BaseSepolia",
  "Solana",
  "OptimismSepolia",
  "ArbitrumSepolia",
];
export function validateChainName(chainName: string): boolean {
  return SupportedChainNames.includes(chainName);
}
