import { prisma } from "@repo/db/prisma";
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  req: NextRequest,
  { params }: {
    params: Promise<{
      userId: string,
    }>
  }
) {
  try {
    const { userId } = await params;
    const appType = req.nextUrl.searchParams.get("app") as string

    console.log(userId)
    console.log(appType)

    const user = await prisma.user.findFirst({
      where: {
        id: userId
      }
    });

    if (!user) {
      NextResponse.json({ msg: "User not found" }, { status: 400 })
    }

    const connections = await prisma.connection.findMany({
      where: {
        userId: userId,
        appType: appType,
      },
    })

    const serializedConnections = connections.map((connection) => ({
      ...connection,
      tokenExpiry: connection.tokenExpiry.toString()
    }))

    return NextResponse.json({ msg: "Successfully fetched connections", connections: serializedConnections }, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ msg: "Something went wrong" }, { status: 400 })
  }
}