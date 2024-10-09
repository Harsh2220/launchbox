import { createPublicClient, createWalletClient, custom, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia, mainnet } from "viem/chains";
import { abi } from "./abi";
import { ERC20ByteCode } from "./constants";

export const walletClient = createWalletClient({
  chain: baseSepolia,
  transport: http(baseSepolia.rpcUrls.default.http[0]),
});

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(baseSepolia.rpcUrls.default.http[0]),
});

const privateKey = process.env.PRIVATE_KEY;
export const account = privateKeyToAccount(privateKey! as `0x{string}`);

export default async function deployERCToken(name: string, symbol: string) {
  const hash = await walletClient.deployContract({
    abi,
    account,
    args: [name, symbol, account.address],
    bytecode: ERC20ByteCode,
  });
  const receipt = await publicClient.waitForTransactionReceipt({
    hash: hash,
  });
  const deployedContractAddress = receipt.contractAddress;
  return deployedContractAddress;
}
