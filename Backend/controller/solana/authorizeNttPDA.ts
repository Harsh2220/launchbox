import {
  Connection,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
  Keypair,
  clusterApiUrl,
} from "@solana/web3.js";
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { fluenceStage } from "viem/chains";
import fs from "fs";
import path from "path";
import { getSolanaPayerKeypair } from "./payer";
import { getTokenMintKeyPair } from "./createSplToken";

export default async function authorizeTokenMint(
  tokenAddress: string,
  derivedPDA: string,
  currentMintAuthorityKeypairPath: string,
) {
  try {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const tokenPublicKey = new PublicKey(tokenAddress);
    const derivedPDAPublicKey = new PublicKey(derivedPDA);
    const payerKeyPair = getSolanaPayerKeypair();
    const currentMintAuthoruty = getTokenMintKeyPair(
      currentMintAuthorityKeypairPath,
    );
    const token = new Token(
      connection,
      tokenPublicKey,
      TOKEN_PROGRAM_ID,
      payerKeyPair,
    );

    const transaction = new Transaction().add(
      Token.createSetAuthorityInstruction(
        TOKEN_PROGRAM_ID,
        tokenPublicKey,
        derivedPDAPublicKey,
        "MintTokens",
        currentMintAuthoruty.publicKey,
        [],
      ),
    );

    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [payerKeyPair, currentMintAuthoruty],
      { commitment: "confirmed" },
    );

    console.log("signature", signature);
    return signature;
  } catch (error) {
    console.error("Error authorizing token mint:", error);
    throw error;
  }
}
