import fs from "fs/promises";
import { deploy } from "../deployments/HUBLB_01/sdk/__tests__/utils";
import type { Record } from "@prisma/client/runtime/react-native.js";
import type { TokenAmount } from "@solana/web3.js";
import type { JsonValue } from "@prisma/client/runtime/library";

async function fetchTokenDetails(chainName: string, tokenAddress: string) {
  return {
    symbol: "PLACEHOLDER",
    decimals: 18,
    name: "Placeholder Token",
    imageUri: "https://placeholder.com/token.png",
  };
}
function mapChainName(chain: string) {
  const chainMapping = {
    BaseSepolia: "base_sepolia",
    OptimismSepolia: "optimism_sepolia",
    ArbitrumSepolia: "arbitrum_sepolia",
    Solana: "solana",
  };
  return chainMapping[chain] || chain.toLowerCase();
}

type TokenDetails = {
  symbol: string;
  id: string;
  token_name: string;
  image_url: string | null;
  decimals: number;
  hub_chain: string | null;
  new_owner: string | null;
  json_config: JsonValue;
};

export async function transformDeploymentData(
  deploymentDataJson: TokenDetails,
) {
  try {
    const deploymentData = deploymentDataJson.json_config;

    const networks = Object.keys(deploymentData.chains) as string[];
    const tokenName = deploymentDataJson.token_name;

    if (!networks) return null;
    if (networks && networks.length === 0) return;
    const transformedData = {
      env: deploymentData.network.toLowerCase(),
      networks: networks.map(mapChainName),
      tokens: networks.map((network) => `${tokenName}${mapChainName(network)}`),
      routes: ["nttManual"],
      bridgeDefaults: {
        token: `${tokenName}${mapChainName(networks[0])}`,
      },
      nttGroups: {
        [tokenName]: {
          nttManagers: networks.map((network: string) => {
            const chainData = deploymentData.chains[network];
            return {
              chainName: mapChainName(network),
              address: chainData.manager,
              tokenKey: `${tokenName}${mapChainName(network)}`,
              transceivers: [
                {
                  address: chainData.transceivers.wormhole.address,
                  type: "wormhole",
                },
              ],
            };
          }),
        },
      },
      tokensConfig: {},
    };

    for (const network of networks) {
      const chainData = deploymentData.chains[network];
      const mappedNetwork = mapChainName(network);
      const tokenKey = `${tokenName}${mappedNetwork}`;
      const tokenDetails = {
        symbol: deploymentDataJson.symbol,
        name: deploymentDataJson.token_name,
        imageUri: deploymentDataJson.image_url,
        decimals: mappedNetwork === "solana" ? 9 : 18,
      };

      transformedData.tokensConfig[tokenKey] = {
        key: tokenKey,
        symbol: tokenDetails.symbol,
        nativeChain: mappedNetwork,
        displayName:
          network === networks[0]
            ? tokenDetails.name
            : `${tokenDetails.name} (${network})`,
        tokenId: {
          chain: mappedNetwork,
          address: chainData.token,
        },
        coinGeckoId: "test",
        icon: tokenDetails.imageUri,
        color: "#00C3D9",
        decimals: {
          [mappedNetwork]: tokenDetails.decimals,
          default: mappedNetwork === "solana" ? 9 : 18,
        },
      };

      if (mappedNetwork !== "ethereum") {
        transformedData.tokensConfig[tokenKey].decimals["ethereum"] = 18;
      }
    }

    return transformedData;
  } catch (error) {
    console.error("Error transforming deployment data:", error);
    throw error;
  }
}

export default transformDeploymentData;
