import {
  Connection,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
  clusterApiUrl,
} from "@solana/web3.js";
import { Token, TOKEN_PROGRAM_ID, type AuthorityType } from "@solana/spl-token";
import { getSolanaPayerKeypair } from "./payer";

export default async function transferSolTokenAccountOwnership(
  tokenAccountAddress: string,
  newOwnerPubKey: string,
) {
  try {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    const tokenAccountPublicKey = new PublicKey(tokenAccountAddress);
    const newOwnerPublicKey = new PublicKey(newOwnerPubKey);

    const payerKeyPair = getSolanaPayerKeypair();

    const token = new Token(
      connection,
      tokenAccountPublicKey,
      TOKEN_PROGRAM_ID,
      payerKeyPair,
    );

    const transaction = new Transaction().add(
      Token.createSetAuthorityInstruction(
        TOKEN_PROGRAM_ID,
        tokenAccountPublicKey,
        newOwnerPublicKey,
        "AccountOwner",
        payerKeyPair.publicKey,
        [],
      ),
    );

    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [payerKeyPair],
      { commitment: "confirmed" },
    );

    console.log("Token account ownership transferred, signature:", signature);
    return signature;
  } catch (error) {
    console.error("Error transferring token account ownership:", error);
    throw error;
  }
}
