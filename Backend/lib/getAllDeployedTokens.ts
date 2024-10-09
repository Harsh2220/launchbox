import prisma from "./db";
import fs from "fs";
export default async function getAllDeployedTokens() {
  try {
    const allTokens = await prisma.alltokens.findMany();
    return allTokens;
  } catch (error) {
    console.error("Error updating migration status:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to update migration status: ${error.message}`);
    }
  }
}
