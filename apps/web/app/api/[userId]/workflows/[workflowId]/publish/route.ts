import { prisma } from "@repo/db/prisma";
import { ActionType } from "@repo/types";
import { type NextRequest, NextResponse } from "next/server"

export async function POST(
  req: NextRequest,
  { params }: {
    params: Promise<{
      userId: string,
      workflowId: string
    }>
  }
) {
  try {
    const { userId, workflowId } = await params;
    const body = await req.json();

    const outbox = await prisma.outbox.createMany({
      data: body.filter((item: ActionType) => item.type === "action").map((item: ActionType) => ({
        userId: userId,
        workflowId: workflowId,
        appType: item.appType,
        connectionId: item.connectionId,
        eventType: item.eventType,
        payload: item.payload,
        stepNo: item.stepNo,
        status: "pending",
      }))
    })

    if (!outbox) {
      return NextResponse.json({ msg: "could not publish" }, { status: 400 })
    }

    return NextResponse.json({ msg: "outbox created and workflow has been published" }, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ msg: "Something went wrong" }, { status: 500 })
  }
}