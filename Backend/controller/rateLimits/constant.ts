import { readFileSync, writeFileSync } from "fs";

function updateChainLimitsForMigrate(filePath: string) {
  try {
    const configData = JSON.parse(readFileSync(filePath, "utf8"));

    Object.entries(configData.chains).forEach(([chainName, chainData]) => {
      if (chainData.limits) {
        if (chainName === "Solana") {
          chainData.limits.outbound = "0.000000000";
          Object.keys(chainData.limits.inbound).forEach((key) => {
            chainData.limits.inbound[key] = "1000000000.000000000";
          });
        } else {
          chainData.limits.outbound = "1000000000.000000000000000000";
          if (chainData.limits.inbound) {
            chainData.limits.inbound.Solana = "0.000000000000000000";
          } else {
            chainData.limits.inbound = { Solana: "0.000000000000000000" };
          }
        }
      }
    });

    writeFileSync(filePath, JSON.stringify(configData, null, 2));

    console.log("Limits updated successfully!");
  } catch (error) {
    if (error instanceof Error) {
      console.error("An error occurred:", error.message);
    }
  }
}

export default updateChainLimitsForMigrate;
