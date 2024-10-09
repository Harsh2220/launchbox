import { sleep } from "bun";
import updateMigrationStatus, { StatusText } from "../../lib/updateStatus";
import deployNtt, { getProjectDirectory } from "./deployNtt";
import verifyCurrentOwner from "./verifyCurrentOwner";
import deploySolanaNtt from "../solana/deploySolanaNtt";
import postDeployMentConfig from "../postDeployment/config";
import addDeploymentJsonToDB from "../../lib/addDeploymentJsonToDB";

export default async function handleMigrate(options: {
  migrationId: string;
  tokenAddress: string;
  name: string;
  hubChain: string;
  isOneWay: string;
  solOwnerPubKey: string;
  evmOwnerAddress: string;
}) {
  try {
    const {
      migrationId,
      tokenAddress,
      name,
      hubChain,
      isOneWay,
      solOwnerPubKey,
      evmOwnerAddress,
    } = options;

    await updateMigrationStatus(migrationId, StatusText.Evm.CONFIG_START);

    console.log("Deploying on EVM");

    const setUpNtt = await deployNtt({
      tokenName: name,
      tokenAddress: tokenAddress as `0x{string}`,
      mode: "locking",
      chainName: hubChain,
      tokenId: migrationId,
    });

    await updateMigrationStatus(migrationId, StatusText.Evm.DEPLOY_END);

    console.log("Deployed NTT On EVM");

    console.log("Deploying on Solana");

    await sleep(2000);

    await updateMigrationStatus(migrationId, StatusText.Solana.CONFIG_START);

    const solNtt = await deploySolanaNtt({
      tokenName: name,
      tokenId: migrationId,
      mode: "burning",
      supply: "1000000000",
    });

    await updateMigrationStatus(migrationId, StatusText.Solana.DEPLOY_END);

    await sleep(2000);

    await updateMigrationStatus(migrationId, StatusText.POST_DEPLOY_CONFIG);

    await postDeployMentConfig(getProjectDirectory(name));

    await addDeploymentJsonToDB(
      migrationId,
      getProjectDirectory(name) + "/" + "deployment.json",
    );
    await sleep(2000);
    // await transferOwnership(tokenAddress, evmOwnerAddress, hubChain);

    // await transferSolTokenAccountOwnership(
    //   solNtt?.newTokenAddress ?? "",
    //   solOwnerPubKey,
    // );
    //
    await updateMigrationStatus(migrationId, StatusText.POST_DEPLOY_CONFIG_END);
  } catch (error) {
    console.log(error);
  }
}
