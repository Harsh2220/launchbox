import { Keypair } from "@solana/web3.js";
import fs from "fs";
import path from "path";
import { SOLANA_PAYER_KEYPAIR } from "./constants";

export function getSolanaPayerKeypair() {
  const secret = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), SOLANA_PAYER_KEYPAIR)).toString(),
  ) as number[];
  const secretKey = Uint8Array.from(secret);
  return Keypair.fromSecretKey(secretKey);
}
