import { prisma } from "@repo/db/prisma";
import { NextRequest, NextResponse } from "next/server"

//Get all connection details
export async function GET(req: NextRequest,
  { params }: {
    params: Promise<{
      userId: string
    }>
  }) {
  try {
    const { userId } = await params;

    const connections = await prisma.connection.findMany({
      where: {
        userId: userId,
      },
    })

    const mappedConnections = connections.map(connection => ({
      id: connection.id,
      userId: connection.userId,
      appType: connection.appType,
      metaData: connection.metaData
    }))

    return NextResponse.json({ msg: "Successfully fetched connections", connections: mappedConnections }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ msg: "Something went wrong" }, { status: 400 })
  }
}

