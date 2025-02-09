import { prisma } from "./db";

export async function getRefreshTokenFromDB(appType: string, connectionId: string) {

  try {

    if (appType === "gmail") {
      const response = await prisma.gmailConnection.findFirst({
        where: {
          id: connectionId
        }
      });

      return response
    }

  } catch (error) {

  }
}