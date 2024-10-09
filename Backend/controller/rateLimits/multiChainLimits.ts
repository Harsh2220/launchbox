import fs from "fs";

function getTokenSupplyFormatted(decimals: number) {
  const supply = "1000000000";
  const dec = "0".repeat(decimals);
  return `${supply}.${dec}`;
}

export default function updateChainLimits(filepath: string) {
  const jsonData = fs.readFileSync(filepath, "utf8");
  const data = JSON.parse(jsonData);

  function convertToBillionReadable(decimals: number) {
    const integerPart = "1000000000";
    const fractionalPart = "0".repeat(decimals);
    return `${integerPart}.${fractionalPart}`;
  }

  Object.keys(data.chains).forEach((chainName) => {
    const chain = data.chains[chainName];

    const decimals = chainName === "Solana" ? 9 : 18;

    chain.limits.outbound = convertToBillionReadable(decimals);

    if (chain.limits.inbound) {
      Object.keys(chain.limits.inbound).forEach((inboundChain) => {
        const inboundDecimals = chainName === "Solana" ? 9 : 18;
        chain.limits.inbound[inboundChain] =
          convertToBillionReadable(inboundDecimals);
      });
    }
  });

  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));

  console.log(
    `Chain limits have been updated to 1B with correct decimals. Check ${filepath} for the result.`,
  );
}
