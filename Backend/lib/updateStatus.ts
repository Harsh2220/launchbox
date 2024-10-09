import prisma from "./db";

export const StatusText = {
  UNINIT: "Not Started",
  Evm: {
    CONFIG_START: "EVM Configuration Started",
    CONFIG_END: "EVM Configured.",
    DEPLOY: "Deploying Contracts",
    DEPLOY_END: "Deployed Contracts",
  },
  Solana: {
    CONFIG_START: "Solana Configuration Started",
    CONFIG_END: "Solana Configured.",
    DEPLOY: "Deploying Programs",
    DEPLOY_END: "Deployed Programs",
  },
  POST_DEPLOY_CONFIG: "Post deployent config",
  POST_DEPLOY_CONFIG_END: "Post deployent configured",
};

export default async function updateMigrationStatus(
  tokenMigrationId: string,
  status: string,
  message?: string,
) {
  try {
    const newMigrationStatus = await prisma.migration_status.create({
      data: {
        token_migration_id: tokenMigrationId,
        status: status,
        message: message || "",
      },
    });

    return newMigrationStatus;
  } catch (error) {
    console.error("Error updating migration status:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to update migration status: ${error.message}`);
    }
  }
}
