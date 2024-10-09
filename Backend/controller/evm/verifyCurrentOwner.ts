import { abi } from "./abi";
import { getClient } from "./client";
import { account } from "./deployToken";
import type { EthAddress } from "./transferOwnership";

export default async function verifyCurrentOwner(
  tokenContractAddress: string,
  chainName: string,
): Promise<boolean> {
  try {
    const { chain, publicClient } = getClient(chainName);

    const owner = await publicClient.readContract({
      abi: abi,
      address: tokenContractAddress as EthAddress,
      functionName: "owner",
    });
    console.log("Current Owner", owner);
    if (account.address.toLowerCase() === owner.toLowerCase()) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error in Check Owner:", error);
    return false;
  }
}
