import {
  Connection,
  Keypair,
  PublicKey,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { getSolanaPayerKeypair } from "./payer";
import fs from "fs";
import path from "path";
import BN from "bn.js";
import { getProjectDirectory } from "../evm/deployNtt";

export function writeMintKeyPair(keypair: Keypair, directory: string) {
  try {
    console.log("Writing Mint authority keypair", directory);

    const mintKeypairFilePath = directory + "/" + "mintAuthorityKeypair.json";

    fs.writeFileSync(
      mintKeypairFilePath,
      JSON.stringify(Array.from(keypair.secretKey)),
    );

    console.log(
      `Mint authority keypair (public and secret key) written to ${mintKeypairFilePath}`,
    );
    return mintKeypairFilePath;
  } catch (error) {
    console.log(error, "Write Error");
  }
}

export function getTokenMintKeyPair(path: string) {
  const secret = JSON.parse(fs.readFileSync(path).toString()) as number[];
  const secretKey = Uint8Array.from(secret);
  return Keypair.fromSecretKey(secretKey);
}

//ye SPL Token banata hai naki Token2022 vala
export default async function createSplToken(init_supply: string) {
  try {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    const payer = getSolanaPayerKeypair();

    const mintAuthority = Keypair.generate();

    const token = await Token.createMint(
      connection,
      payer,
      mintAuthority.publicKey,
      null,
      9,
      TOKEN_PROGRAM_ID,
    );

    const mintAuthorityTokenAccount =
      await token.getOrCreateAssociatedAccountInfo(mintAuthority.publicKey);

    const initialSupply = new BN(init_supply ?? "1000000000").mul(
      new BN("10").pow(new BN("9")),
    );
    console.log("Sol Supply", initialSupply);
    await token.mintTo(
      mintAuthorityTokenAccount.address,
      mintAuthority,
      [],
      initialSupply,
    );

    console.log(
      "Mint Authority Token Account:",
      mintAuthorityTokenAccount.address.toBase58(),
    );
    return {
      tokenAddress: token.publicKey.toString(),
      mintAddress: mintAuthority.publicKey.toString(),
      mintKeyPair: mintAuthority,
    };
  } catch (error) {
    console.log("Error", error);
  }
}
