import { waitForTransactionReceipt, writeContract } from "viem/actions";
import { getClient } from "./client";
import { abi } from "./abi";
import { account } from "./deployToken";

export type EthAddress = `0x${string}`;

export default async function transferOwnership(
  tokenContractAddress: EthAddress,
  newOwnerAddress: EthAddress,
  chainName: string,
) {
  try {
    const { publicClient, walletClient, chain } = getClient(chainName);

    const txnHash = await writeContract(walletClient, {
      abi: abi,
      address: tokenContractAddress,
      chain: chain,
      account: account,
      functionName: "transferOwnership",
      args: [newOwnerAddress],
    });

    const receipt = await waitForTransactionReceipt(publicClient, {
      hash: txnHash,
    });

    console.log("Transferred Ownership to", newOwnerAddress);
    return txnHash;
  } catch (error) {
    console.error("Error transferring ownership:", error);
    return null;
  }
}
