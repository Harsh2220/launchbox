import type { Request, Response } from "express";
import updateMigrationStatus, { StatusText } from "../../lib/updateStatus";
import deployMultiChainToken from "./deployMultiChainToken";
import deployMultiChainNtt from "./deployMultiChainNtt";
import { sleep } from "../../lib/utils";
import deploySolanaNtt from "../solana/deploySolanaNtt";
import { postDeployMentConfigForNewToken } from "../postDeployment/config";
import { getProjectDirectory } from "./deployNtt";
import addDeploymentJsonToDB from "../../lib/addDeploymentJsonToDB";

export default async function createMultiChainNttHandler(options: {
  tokenName: string;
  token_supply: string;
  tokenSymbol: string;
  chainNames: string[];
  token_id: string;
}) {
  const { tokenName, token_supply, tokenSymbol, chainNames, token_id } =
    options;
  await updateMigrationStatus(token_id, StatusText.Evm.CONFIG_START);

  const deployedTokens = await deployMultiChainToken(
    chainNames,
    tokenName,
    tokenSymbol,
  );

  await deployMultiChainNtt({
    mode: "burning",
    tokenAddress: deployedTokens,
    tokenId: token_id,
    tokenName: tokenName,
  });

  await updateMigrationStatus(token_id, StatusText.Evm.DEPLOY_END);

  await sleep(2000);

  await updateMigrationStatus(token_id, StatusText.Solana.CONFIG_START);

  await deploySolanaNtt({
    tokenName: tokenName,
    mode: "burning",
    tokenId: token_id,
    supply: token_supply,
  });

  await updateMigrationStatus(token_id, StatusText.Solana.DEPLOY_END);

  await sleep(2000);

  await updateMigrationStatus(token_id, StatusText.POST_DEPLOY_CONFIG);

  await postDeployMentConfigForNewToken(getProjectDirectory(tokenName));

  await addDeploymentJsonToDB(
    token_id,
    getProjectDirectory(tokenName) + "/" + "deployment.json",
  );

  //Need to add transferOwnership for everychain

  await updateMigrationStatus(token_id, StatusText.POST_DEPLOY_CONFIG_END);
}
