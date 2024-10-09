import type { StringMappingType } from "typescript";
import { abi } from "./abi";
import { getClient } from "./client";
import { ERC20ByteCode } from "./constants";
import { account } from "./deployToken";

export default async function deployMultiChainToken(
  chainNames: string[],
  name: string,
  symbol: string,
): Promise<{ [chainName: string]: string }> {
  const deployedAddresses: { [chainName: string]: string } = {};

  for (const chainName of chainNames) {
    try {
      const { walletClient, publicClient, chain } = getClient(chainName);
      console.log("Starting Token Deployment on ", chainName);
      const hash = await walletClient.deployContract({
        abi,
        account,
        chain: chain,
        args: [name, symbol, account.address],
        bytecode: ERC20ByteCode,
      });
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: hash,
      });

      const deployedContractAddress = receipt.contractAddress;
      console.log(`Deployment on ${chainName}:${deployedContractAddress}`);
      if (deployedContractAddress) {
        deployedAddresses[chainName] = deployedContractAddress;
      }
    } catch (error) {
      console.error(`Error deploying token on ${chainName}:`, error);
      throw error;
    }
  }

  return deployedAddresses;
}
