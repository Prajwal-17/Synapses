import { prisma } from "@repo/db/prisma";
import { type NextRequest, NextResponse } from "next/server"

export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string; workflowId: string } }
): Promise<NextResponse> {
  try {
    const { userId, workflowId } = params;
    const body = await req.json();

    const outbox = await prisma.outbox.createMany({
      data: body.filter((item: any) => item.type === "action").map((item: any) => ({
        userId: userId,
        workflowId: workflowId,
        stepNo: item.stepNo,
        eventType: item.event,
        payload: item.payload,
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