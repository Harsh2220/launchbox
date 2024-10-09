import express from "express";
import deployERCToken, { account } from "./controller/evm/deployToken";
import bodyParser from "body-parser";
import deployNtt, { getProjectDirectory } from "./controller/evm/deployNtt";
import fs from "node:fs";
import path from "node:path";
import deploySolanaNtt from "./controller/solana/deploySolanaNtt";
import { getSolanaPayerKeypair } from "./controller/solana/payer";
import prisma from "./lib/db";
import getTokenDetails from "./lib/getTokenDetails";
import updateMigrationStatus, { StatusText } from "./lib/updateStatus";
import { sleep, SupportedChainNames, validateChainName } from "./lib/utils";
import { SOLANA_PAYER_KEYPAIR } from "./controller/solana/constants";
import postDeployMentConfig, {
  executeNttPull,
  postDeployMentConfigForNewToken,
} from "./controller/postDeployment/config";
import transferOwnership from "./controller/evm/transferOwnership";
import transferSolTokenAccountOwnership from "./controller/solana/transferTokenOwnerShip";
import verifyCurrentOwner from "./controller/evm/verifyCurrentOwner";
import deployMultiChainToken from "./controller/evm/deployMultiChainToken";
import deployMultiChainNtt from "./controller/evm/deployMultiChainNtt";
import updateChainLimits from "./controller/rateLimits/multiChainLimits";
import transformDeploymentData from "./lib/getTransferUIConfig";
import { fileURLToPath } from "bun";
import addDeploymentJsonToDB from "./lib/addDeploymentJsonToDB";
import getDeploymentJson from "./lib/getDeploymentJson";
import getAllDeployedTokens from "./lib/getAllDeployedTokens";
import cors from "cors";
import createMultiChainNttHandler from "./controller/evm";
import handleMigrate from "./controller/evm/handleMigrate";

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: "*",
    exposedHeaders: "*",
    credentials: true,
  }),
);

app.use(express.json());

const PORT = 8080;

app.post("/registerMigration", async (req, res) => {
  try {
    const {
      token_name,
      symbol,
      image_url,
      decimals,
      init_supply,
      hub_chain,
      new_owner,
    } = req.body;

    if (!token_name || !symbol || !decimals || !init_supply) {
      res.status(400).json({ error: "Missing required fields." });
      return;
    }

    const newMigration = await prisma.alltokens.create({
      data: {
        token_name,
        symbol,
        image_url,
        decimals,
        init_supply,
        hub_chain,
        new_owner,
      },
    });

    const addToStatusTable = await prisma.migration_status.create({
      data: {
        status: StatusText.UNINIT,
        message: "Not Initiaized",
        token_migration_id: newMigration.id,
      },
    });

    res.status(201).json({
      message: "Use The Returned ID to Poll for Migration Status",
      migrationId: newMigration.id,
    });
  } catch (error) {
    console.error("Error registering migration:", error);
    res.status(500).json({
      error: "An error occurred while registering the migration.",
    });
  }
});

app.post("/migrate", async (req, res) => {
  try {
    const {
      migrationId,
      tokenAddress,
      name,
      hubChain,
      isOneWay,
      solOwnerPubKey,
      evmOwnerAddress,
    } = req.body;

    if (!migrationId) {
      res.status(400).json({ message: "No migrationId provided" });
      return;
    }

    if (!validateChainName(hubChain)) {
      res.status(400).json({
        message: `Invalid Chain name provided, supported chain names are ${SupportedChainNames}`,
      });
      return;
    }
    const isLBAddreesOwner = await verifyCurrentOwner(tokenAddress, hubChain);

    if (!isLBAddreesOwner) {
      res.status(400).json({
        message: `You haven't transfered ownership to LaunchBox address,please transfer ownership of token to ${account.address} on ${hubChain}`,
        description:
          "We will transfer ownership back to your given address upon token deployment",
      });
      return;
    }

    handleMigrate({
      solOwnerPubKey: solOwnerPubKey,
      name: name,
      hubChain: hubChain,
      isOneWay: isOneWay,
      migrationId: migrationId,
      tokenAddress: tokenAddress,
      evmOwnerAddress: evmOwnerAddress,
    });
    res.status(202).json({
      message: "migration started",
      token_id: migrationId,
    });
  } catch (error) {
    console.log("Error ", error);
  }
});

app.get("/getStatus", async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      res.status(400).json({ error: "migrationId is required" });
      return;
    }
    const migrationIdStr = id.toString();
    const migrationStatus = await prisma.migration_status.findMany({
      where: {
        token_migration_id: migrationIdStr,
      },
      orderBy: {
        updated_at: "desc",
      },
    });
    if (!migrationStatus || migrationStatus.length === 0) {
      res.status(404).json({ error: "No status found for this migrationId" });
      return;
    }
    const lastStatus = migrationStatus[0];
    res.status(200).json(lastStatus);
  } catch (error) {
    console.error("Error fetching migration status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/registerNewToken", async (req, res) => {
  try {
    const { token_name, symbol, image_url, new_owner } = req.body;
    if (!token_name || !symbol) {
      res.status(400).json({ error: "Missing required fields." });
      return;
    }

    const newMigration = await prisma.alltokens.create({
      data: {
        token_name,
        symbol,
        image_url,
        decimals: 18,
        init_supply: 1000000000,
        hub_chain: "",
        new_owner,
      },
    });

    const addToStatusTable = await prisma.migration_status.create({
      data: {
        status: StatusText.UNINIT,
        message: "Not Initiaized",
        token_migration_id: newMigration.id,
      },
    });
    res.status(201).json({
      message: "Use The Returned ID to Poll for Migration Status",
      token_id: newMigration.id,
    });
  } catch (error) {
    console.error("Error registering migration:", error);
    res.status(500).json({
      error: "An error occurred while registering the migration.",
    });
  }
});

app.post("/createMultiChainNativeToken", async (req, res) => {
  try {
    const { tokenName, token_supply, tokenSymbol, chainNames, token_id } =
      req.body;

    if (fs.existsSync(getProjectDirectory(tokenName))) {
      res.status(400).json({ error: "Token With same name already existes" });
      return;
    }

    createMultiChainNttHandler({
      tokenName,
      token_supply,
      tokenSymbol,
      chainNames,
      token_id,
    });

    res.status(202).json({
      message: "deployment started",
      token_id: token_id,
    });
  } catch (error) {
    console.log("e", error);
    res.status(500).json({ error: "Internal Server Error", stack: error });
  }
});

app.get("/getAllTokens", async (req, res) => {
  try {
    const allTokens = await getAllDeployedTokens();
    console.log("All Token req");
    res.status(200).json(allTokens);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", stack: error });
  }
});

app.post("/getBridgeConfig", async (req, res) => {
  try {
    console.log("I am body", req.body);
    const { token_id } = req.body;
    if (!token_id) {
      res.status(400).json({
        message: "No token data found for given id",
      });
      return;
    }
    const json_config = await getDeploymentJson(token_id);
    if (!json_config) {
      res.status(503).json({
        message: "No token data found for given id",
      });
      return;
    }
    const data = await transformDeploymentData(json_config);
    console.log("da", data);
    res.status(200).json(data);
  } catch (error) {
    console.log("e", error);
    res.status(500).json({ error: "Internal Server Error", stack: error });
  }
});

app.listen(PORT, () => {
  console.log("Start");
});

app.post("/mockMigrate", async (req, res) => {
  try {
    const { token_id } = req.body;

    if (!token_id) {
      res.status(400).json({ error: "Token ID is required" });
      return;
    }
    handleMockMigrate(token_id);
    res.status(202).json({ message: "Migration completed successfully." });
  } catch (error) {
    console.error("Error fetching migration status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

async function handleMockMigrate(token_id: string) {
  await updateMigrationStatus(token_id, StatusText.Evm.CONFIG_START);
  await sleep(4000);

  await updateMigrationStatus(token_id, StatusText.Evm.CONFIG_END);
  await sleep(4000);

  await updateMigrationStatus(token_id, StatusText.Evm.DEPLOY);
  await sleep(4000);

  await updateMigrationStatus(token_id, StatusText.Evm.DEPLOY_END);
  await sleep(4000);

  await updateMigrationStatus(token_id, StatusText.Solana.CONFIG_START);
  await sleep(4000);
  await updateMigrationStatus(token_id, StatusText.Solana.CONFIG_END);
  await sleep(4000);

  await updateMigrationStatus(token_id, StatusText.Solana.DEPLOY);
  await sleep(4000);

  await updateMigrationStatus(token_id, StatusText.Solana.DEPLOY_END);
  await sleep(4000);

  await updateMigrationStatus(token_id, StatusText.POST_DEPLOY_CONFIG);
  await sleep(4000);

  await updateMigrationStatus(token_id, StatusText.POST_DEPLOY_CONFIG_END);
  await sleep(4000);
}
