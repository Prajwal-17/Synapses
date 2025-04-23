import { prisma } from "./db";

export async function getTokenFromDB(appType: string, connectionId: string) {
  try {
    if (appType && connectionId) {
      const connection = await prisma.connection.findFirst({
        where: {
          id: connectionId
        }
      });
      return connection
    } else {
      console.log("No connections for appType:", appType);
      return null
    }
  } catch (error) {
    console.error("Error in fetching refershToken", error);
    return null
  }
};

export async function updateAccessToken(connectionId: string, access_token: string) {
  try {
    if (connectionId && access_token) {
      await prisma.connection.update({
        where: {
          id: connectionId
        },
        data: {
          accessToken: access_token
        }
      })
    } else {
      console.log("Error updating access Token");
      return null
    }
  } catch (error) {
    console.error("Error updated access token");
    return null
  }
}