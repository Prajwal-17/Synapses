import { prisma } from "@repo/db/prisma";
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const appType = req.nextUrl.searchParams.get("app") as string
    const userId = req.nextUrl.searchParams.get("userId") as string;

    const connections = await prisma.connection.findMany({
      where: {
        userId: userId,
        appType: appType,
      },
    })

    if (!connections) {
      NextResponse.json({ msg: "Connections not found" }, { status: 400 })
    }

    const mappedConnections = connections.map(connection => ({
      id: connection.id,
      userId: connection.userId,
      appType: connection.appType,
      metaData: connection.metaData
    }))

    return NextResponse.json({ msg: "Successfully fetched connections", connections: mappedConnections }, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ msg: "Something went wrong" }, { status: 400 })
  }
}