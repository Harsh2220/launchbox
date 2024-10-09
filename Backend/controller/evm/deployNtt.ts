import { execSync, spawn, spawnSync, type StdioOptions } from "child_process";
import process from "process";
import path from "path";
import fs from "fs";
import updateMigrationStatus, { StatusText } from "../../lib/updateStatus";
import { sleep } from "../../lib/utils";
import updateChainLimits from "../rateLimits/constant";
import postDeployMentConfig from "../postDeployment/config";

type NttDeployoptions = {
  chainName: string;
  tokenAddress: string;
  tokenName: string;
  mode: "locking" | "burning";
  tokenId: string;
};

export function getProjectDirectory(tokenName: string) {
  const projectDir = path.join(
    process.cwd(),
    "deployments",
    tokenName + "LB_01",
  );
  return projectDir;
}

export function getDeploymentsDirectory() {
  const deploymentsDir = path.join(process.cwd(), "deployments");
  return deploymentsDir;
}

export function ensureDeploymentsDirectory() {
  if (!fs.existsSync(path.join(process.cwd(), "deployments"))) {
    fs.mkdirSync(path.join(process.cwd(), "deployments"), { recursive: true });
  }
}

export const IO_OPTIONS: StdioOptions = ["pipe", "pipe", "pipe"];

export default async function deployNtt(option: NttDeployoptions) {
  ensureDeploymentsDirectory();

  const projectDir = getProjectDirectory(option.tokenName);

  try {
    console.log("Creating new NTT Project...");

    const createNewNttCommand = `ntt new ${projectDir}`;

    const child = spawnSync(createNewNttCommand, {
      stdio: IO_OPTIONS,
      shell: true,
      cwd: getDeploymentsDirectory(),
    });

    const privateKey = process.env.PRIVATE_KEY;

    const envWithKey = { ...process.env, ETH_PRIVATE_KEY: privateKey };

    const initNttEnvironmentCommand = "ntt init Testnet";

    const nttInitEnvProcess = spawnSync(initNttEnvironmentCommand, {
      shell: true,
      stdio: IO_OPTIONS,
      env: envWithKey,
      cwd: projectDir,
    });

    await updateMigrationStatus(option.tokenId, StatusText.Evm.CONFIG_END);

    await sleep(3000);

    await updateMigrationStatus(option.tokenId, StatusText.Evm.DEPLOY);

    await executeAddEVMChainCommand({
      chainName: option.chainName,
      tokenAddress: option.tokenAddress,
      tokenName: option.tokenName,
      mode: "locking",
      projectDir: projectDir,
    });
  } catch (error) {
    console.error(error);
  }
}

type NttAddChainOptions = {
  chainName: string;
  tokenAddress: string;
  tokenName: string;
  mode: "locking" | "burning";
  projectDir: string;
};

export function executeAddEVMChainCommand(option: NttAddChainOptions) {
  const addChainCommand = `ntt add-chain ${option.chainName} --latest --mode ${option.mode} --token ${option.tokenAddress} --skip-verify`;
  console.log("CMD,", addChainCommand);

  const privateKey = process.env.PRIVATE_KEY;

  const envWithKey = { ...process.env, ETH_PRIVATE_KEY: privateKey };

  return new Promise((resolve, reject) => {
    const child = spawn(addChainCommand, {
      shell: true,
      stdio: ["pipe", "pipe", "pipe"],
      env: { ...process.env, ETH_PRIVATE_KEY: privateKey },
      cwd: option.projectDir,
    });

    let stdoutData = "";
    let stderrData = "";

    child.stdout.on("data", (data) => {
      const output = data.toString();
      stdoutData += output;
      process.stdout.write(output);

      if (
        output.includes(
          "Do you want to proceed with the deployment without simulation? [y/n]",
        )
      ) {
        child.stdin.write("y\n");
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
