import { prisma } from "@repo/db/prisma";
import { NextRequest, NextResponse } from "next/server"

// Get connection details
export async function GET(req: NextRequest) {
  try {
    const appType = req.nextUrl.searchParams.get("app") as string
    const userId = req.nextUrl.searchParams.get("userId") as string;

    let connections;

    if (appType === "Gmail") {
      connections = await prisma.gmailConnection.findMany({
        where: {
          userId: userId,
          appType: "Gmail",
        },
      })
    } else {
      NextResponse.json({ msg: "Connections not found" }, { status: 400 })
    }

    if (!connections || connections.length === 0) {
      return NextResponse.json({ msg: "No connections found" }, { status: 404 });
    }

    const mappedConnections = connections.map(connection => ({
      id: connection.id,
      userId: connection.userId,
      appType: connection.appType,
    }))

    return NextResponse.json({ msg: "Successfully fetched connections", connections: mappedConnections }, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ msg: "Something went wrong" }, { status: 400 })
  }
}