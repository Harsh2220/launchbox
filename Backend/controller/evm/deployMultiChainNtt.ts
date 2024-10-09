import { execSync, spawn, spawnSync, type StdioOptions } from "child_process";
import process from "process";
import path from "path";
import fs from "fs";
import updateMigrationStatus, { StatusText } from "../../lib/updateStatus";
import { sleep } from "../../lib/utils";
import updateChainLimits from "../rateLimits/constant";
import postDeployMentConfig, { executeNttPull } from "../postDeployment/config";
import {
  ensureDeploymentsDirectory,
  executeAddEVMChainCommand,
  getDeploymentsDirectory,
  getProjectDirectory,
  IO_OPTIONS,
} from "./deployNtt";

type DeployMultiChainNttOptions = {
  tokenAddress: { [chainName: string]: string };
  tokenName: string;
  tokenId: string;
  mode: "burning" | "locking";
};

export default async function deployMultiChainNtt(
  options: DeployMultiChainNttOptions,
) {
  ensureDeploymentsDirectory();

  const projectDir = getProjectDirectory(options.tokenName);

  try {
    console.log("Creating new NTT Project For MultiChain Token");

    const createNewNttCommand = `ntt new ${projectDir}`;

    const child = spawnSync(createNewNttCommand, {
      stdio: IO_OPTIONS,
      shell: true,
      cwd: getDeploymentsDirectory(),
    });

    if (child.error) {
      throw new Error(`Failed to create NTT project: ${child.error.message}`);
    }

    const privateKey = process.env.PRIVATE_KEY;

    const envWithKey = { ...process.env, ETH_PRIVATE_KEY: privateKey };

    const initNttEnvironmentCommand = "ntt init Testnet";

    const nttInitEnvProcess = spawnSync(initNttEnvironmentCommand, {
      shell: true,
      stdio: IO_OPTIONS,
      env: envWithKey,
      cwd: projectDir,
    });

    if (nttInitEnvProcess.error) {
      throw new Error(
        `Failed to initialize NTT environment: ${nttInitEnvProcess.error.message}`,
      );
    }

    await updateMigrationStatus(options.tokenId, StatusText.Evm.CONFIG_END);

    await sleep(3000);

    await updateMigrationStatus(options.tokenId, StatusText.Evm.DEPLOY);

    for (const [chainName, tokenAddress] of Object.entries(
      options.tokenAddress,
    )) {
      console.log("Executing Ntt add chain");
      await executeAddEVMChainCommand({
        chainName,
        tokenAddress,
        tokenName: options.tokenName,
        mode: options.mode,
        projectDir: projectDir,
      });
    }
    await executeNttPull(projectDir);
    console.log("Multi-chain NTT deployment completed successfully.");
  } catch (error) {
    console.error("Error during deployment:", error);
  }
}
