import { spawn, spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import {
  ensureDeploymentsDirectory,
  getDeploymentsDirectory,
  getProjectDirectory,
} from "../evm/deployNtt";
import { Keypair } from "@solana/web3.js";
import createSplToken, { writeMintKeyPair } from "./createSplToken";
import authorizeTokenMint from "./authorizeNttPDA";
import { SOLANA_PAYER_KEYPAIR } from "./constants";
import updateMigrationStatus, { StatusText } from "../../lib/updateStatus";
import { sleep } from "../../lib/utils";

type DeploySolanaNttOptions = {
  tokenName: string;
  tokenId: string;
  mode: "burning" | "locking";
  supply: string;
};

export default async function deploySolanaNtt(option: DeploySolanaNttOptions) {
  const projectDir = getProjectDirectory(option.tokenName);

  ensureDeploymentsDirectory();

  const newSplToken = await createSplToken(option.supply);

  if (!newSplToken) {
    return null;
  }
  console.log("New Deployed Token PubKey", newSplToken.tokenAddress);
  console.log("New Deployed Token MintAccount PubKey", newSplToken.mintAddress);

  const mintKeyPairPath = writeMintKeyPair(newSplToken.mintKeyPair, projectDir);

  if (!mintKeyPairPath) return;

  const nttProgramKeyPairPath = generateNttProgramKeyPair(projectDir);

  if (!nttProgramKeyPairPath) {
    return null;
  }

  console.log("NTT Program Keypair:", nttProgramKeyPairPath?.keyPairPath);

  const deriveNttAUthority = generateTokenAuthorityPDA(
    nttProgramKeyPairPath?.pubkey,
  );
  if (!deriveNttAUthority) {
    return;
  }
  console.log("NTT Program PDA:", deriveNttAUthority);

  const authorizeSig = await authorizeTokenMint(
    newSplToken?.tokenAddress,
    deriveNttAUthority,
    mintKeyPairPath,
  );

  await updateMigrationStatus(option.tokenId, StatusText.Solana.CONFIG_END);

  await sleep(4000);

  await updateMigrationStatus(option.tokenId, StatusText.Solana.DEPLOY);

  await addSolanaChainToNtt({
    managerkeyPairPath: nttProgramKeyPairPath.keyPairPath,
    tokenAddress: newSplToken.tokenAddress,
    projectDir: projectDir,
    mode: option.mode,
  });
  return {
    newTokenAddress: newSplToken.tokenAddress,
    nttPda: deriveNttAUthority,
    nttProgramKeyPair: nttProgramKeyPairPath.pubkey,
  };
}

type AddSolanaChainToNttOptions = {
  tokenAddress: string;
  managerkeyPairPath: string;
  projectDir: string;
  mode: "burning" | "locking";
};

function addSolanaChainToNtt(options: AddSolanaChainToNttOptions) {
  const payerKeypair = path.join(process.cwd(), SOLANA_PAYER_KEYPAIR);
  const addSolanaChainCommand = `
ntt add-chain Solana --latest --mode ${options.mode} --token ${options.tokenAddress} --payer ${payerKeypair} --program-key ${options.managerkeyPairPath}`;

  return new Promise((resolve, reject) => {
    const child = spawn(addSolanaChainCommand, {
      shell: true,
      stdio: ["pipe", "pipe", "pipe"],
      cwd: options.projectDir,
    });

    let stdoutData = "";
    let stderrData = "";

    const successMessage = "Added Solana to deployment.json";
    child.stdout.on("data", (data) => {
      const output = data.toString();
      stdoutData += output;
      process.stdout.write(output);
      if (output.includes(successMessage)) {
        resolve(stdoutData);
        child.kill();
      }
    });

    child.stderr.on("data", (data) => {
      const output = data.toString();
      stderrData += output;
      process.stderr.write(output);
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve(stdoutData);
      } else {
        reject(
          new Error(`Command exited with code ${code}\nStderr: ${stderrData}`),
        );
      }
    });
  });
}

function generateNttProgramKeyPair(projectDir: string) {
  console.log("Generating NTT Program Keypair...");

  const command = "solana-keygen grind --starts-with m:1";

  const child = spawnSync(command, {
    shell: true,
    stdio: "pipe",
    encoding: "utf-8",
    cwd: projectDir,
  });

  if (child.stderr) {
    console.log("[STD ERR]:e", child.stderr);
  }
  if (child.error) {
    console.error("Error executing solana-keygen:", child.error);
    return null;
  }

  const outputLines = child.stdout.split("\n");
  const keypairLine = outputLines.find((line) =>
    line.startsWith("Wrote keypair to"),
  );

  if (!keypairLine) {
    console.error("Failed to find keypair file path in command output.");
    return null;
  }

  const keypairFilePath = keypairLine.split("Wrote keypair to ")[1].trim();

  const NTTProgramPubKey = keypairFilePath.split(".")[0];

  const fullPath = projectDir + "/" + keypairFilePath;

  return {
    pubkey: NTTProgramPubKey,
    keyPairPath: fullPath,
  };
}

function generateTokenAuthorityPDA(nttManagerPubKey: string) {
  console.log("Deriving Token Authority PDA...");
  const command = `ntt solana token-authority ${nttManagerPubKey}`;
  const child = spawnSync(command, {
    shell: true,
    stdio: "pipe",
    encoding: "utf-8",
  });

  if (child.error) {
    console.error("Error executing ntt solana token-authority:", child.error);
    return null;
  }

  const outputLines = child.stdout
    .split("\n")
    .filter((line) => line.trim() !== "");

  if (outputLines.length === 0) {
    console.error("key nai mili ");
    return null;
  }

  let pubKey;
  if (
    outputLines.length > 1 &&
    outputLines[0].includes("bigint: Failed to load bindings")
  ) {
    pubKey = outputLines[outputLines.length - 1].trim();
  } else {
    pubKey = outputLines[0].trim();
  }

  if (!pubKey.match(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/)) {
    console.error("valid key nai hai");
    return null;
  }

  return pubKey;
}
