import prisma from "./db";
import fs from "fs";
export default async function addDeploymentJsonToDB(
  token_id: string,
  deploymentJsonPath: string,
) {
  try {
    const deploymentJson = fs.readFileSync(deploymentJsonPath, "utf8");
    const data = JSON.parse(deploymentJson);
    const jsonUpdate = await prisma.alltokens.update({
      data: {
        json_config: data,
      },
      where: {
        id: token_id,
      },
    });

    return jsonUpdate;
  } catch (error) {
    console.error("Error updating migration status:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to update migration status: ${error.message}`);
    }
  }
}
