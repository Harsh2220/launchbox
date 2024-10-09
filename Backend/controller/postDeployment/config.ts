import { spawn } from "child_process";
import path from "path";
import { SOLANA_PAYER_KEYPAIR } from "../solana/constants";
import updateChainLimitsForMigrate from "../rateLimits/constant";
import deploySolanaNtt from "../solana/deploySolanaNtt";
import updateChainLimits from "../rateLimits/multiChainLimits";

export default async function postDeployMentConfig(projectDir: string) {
  try {
    const deploymentJsonFilePath = projectDir + "/" + "deployment.json";
    await executeNttPull(projectDir);
    updateChainLimitsForMigrate(deploymentJsonFilePath);
    await executeNttPush(projectDir);
    await executeNttPull(projectDir);
    return;
  } catch (error) {
    throw error;
  }
}

export async function postDeployMentConfigForNewToken(projectDir: string) {
  try {
    const deploymentJsonFilePath = projectDir + "/" + "deployment.json";
    await executeNttPull(projectDir);
    await updateChainLimits(deploymentJsonFilePath);
    await executeNttPush(projectDir);
    await executeNttPull(projectDir);
    return;
  } catch (error) {
    throw error;
  }
}
export function executeNttPull(projectDir: string) {
  return new Promise((resolve, reject) => {
    const nttPull = spawn("ntt", ["pull", "--yes"], { cwd: projectDir });

    nttPull.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });

    nttPull.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    nttPull.on("close", (code) => {
      if (code === 0) {
        console.log("ntt pull ");
        resolve(0);
      } else {
        reject(new Error(`ntt pull process exited with code ${code}`));
      }
    });

    nttPull.on("error", (error) => {
      reject(new Error(`Failed ntt pull: ${error.message}`));
    });
  });
}

function executeNttPush(projectDir: string) {
  return new Promise((resolve, reject) => {
    const payerKeypair = path.join(process.cwd(), SOLANA_PAYER_KEYPAIR);

    const privateKey = process.env.PRIVATE_KEY;

    const envWithKey = { ...process.env, ETH_PRIVATE_KEY: privateKey };

    const nttPush = spawn("ntt", ["push", "--payer", payerKeypair, "--yes"], {
      cwd: projectDir,
      env: envWithKey,
    });

    nttPush.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });

    nttPush.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    nttPush.on("close", (code) => {
      if (code === 0) {
        console.log("ntt pull ");
        resolve(0);
      } else {
        reject(new Error(`ntt pull process exited with code ${code}`));
      }
    });

    nttPush.on("error", (error) => {
      reject(new Error(`Failed ntt pull: ${error.message}`));
    });
  });
}
