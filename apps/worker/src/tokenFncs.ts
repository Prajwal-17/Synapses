import { prisma } from "./db";

export async function getTokenFromDB(appType: string, connectionId: string) {

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
    console.error("Error in fetching refershToken", error)
  }
};

export async function updateAccessToken(connectionId: string, access_token: string) {
  try {
    await prisma.gmailConnection.update({
      where: {
        id: connectionId
      },
      data: {
        accessToken: access_token
      }
    })
  } catch (error) {
    console.error("Error updated access token ", access_token)
  }
}