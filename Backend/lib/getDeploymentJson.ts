import prisma from "./db";
import fs from "fs";
export default async function getDeploymentJson(token_id: string) {
  try {
    const jsonUpdate = await prisma.alltokens.findUnique({
      where: {
        id: token_id,
      },
    });
    console.log(jsonUpdate);
    return jsonUpdate;
  } catch (error) {
    console.error("Error updating migration status:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to update migration status: ${error.message}`);
    }
  }
}
