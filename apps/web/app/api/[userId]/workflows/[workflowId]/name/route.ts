import { prisma } from "@repo/db/prisma";
import { NextRequest, NextResponse } from "next/server"

// to update workflow name 
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
    const workflowName = body.workflowName;

    if (!workflowId || !workflowName) {
      return NextResponse.json({ msg: "No Workflow Name exits" }, { status: 400 })
    }

    const updatedName = await prisma.workflow.update({
      where: {
        id: workflowId
      },
      data: {
        name: workflowName
      }
    })

    if (!updatedName) {
      return NextResponse.json({ msg: "Could not update name" }, { status: 400 })
    }

    return NextResponse.json({ msg: "Updated Workflow name", updatedName }, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ msg: "Something went wrong" }, { status: 400 })
  }
}