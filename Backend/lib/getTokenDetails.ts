import prisma from "./db";
export default async function getTokenDetails(tokenId: string) {
  try {
    const token = await prisma.alltokens.findUnique({
      where: { id: tokenId },
      include: {
        migration_status: true,
      },
    });

    if (!token) {
      return { error: "Token not found" };
    }

    return token;
  } catch (error) {
    console.error("Error fetching token details:", error);
    throw error;
  }
}
