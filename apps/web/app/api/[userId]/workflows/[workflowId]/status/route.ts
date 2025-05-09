import { prisma } from "@repo/db/prisma";
import { NextRequest, NextResponse } from "next/server"

// to update workflow status
export async function POST(
  request: NextRequest,
  { params }: {
    params: Promise<{
      workflowId: string
    }>
  }) {
  try {
    const { workflowId } = await params;
    const body = await request.json();
    const workflowStatus = body.workflowStatus;

    if (!workflowId || workflowStatus === undefined || workflowStatus === null) {
      return NextResponse.json({ msg: "No Workflow Status provided" }, { status: 400 });
    }

    //Check if all data is present before turning on the workflow

    const updatedStatus = await prisma.workflow.update({
      where: {
        id: workflowId
      },
      data: {
        status: workflowStatus
      }
    })

    if (!updatedStatus) {
      return NextResponse.json({ msg: "Could not update name" }, { status: 400 })
    }

    return NextResponse.json({ msg: "Updated Workflow name", updatedStatus }, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ msg: "Something went wrong" }, { status: 400 })
  }
}