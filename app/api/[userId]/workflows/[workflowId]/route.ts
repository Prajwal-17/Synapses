import prisma from "@/lib/db";
import { NextResponse } from "next/server";

//Get Full Data of a workflow
export async function GET(
  { params }: {
    params: {
      userId: string,
      workflowId: string,
    }
  }
) {

  try {
    const { userId, workflowId } = await params;

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      }
    })

    if (!userId || !user || !workflowId) {
      return NextResponse.json({ msg: "User does not exist" }, { status: 404 })
    }

    const workflow = await prisma.workflow.findFirst({
      where: {
        id: workflowId,
      }
    });

    console.log(workflow)

    if (!workflow) {
      return NextResponse.json({ msg: "Workflow does not exist" }, { status: 400 })
    }


    return NextResponse.json({ msg: "done" }, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ msg: "Something went wrong" }, { status: 400 })
  }
}

//Update data of a workflow
export async function POST(
  req: NextResponse,
  { params }: {
    params: {
      userId: string,
      workflowId: string,
    }
  }
) {

  try {
    const { userId, workflowId } = await params;
    const body = await req.json();

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      }
    })

    if (!user) {
      return NextResponse.json({ msg: "User does not exist" }, { status: 400 })
    }

    const workflow = await prisma.workflow.findUnique({
      where: {
        id: workflowId,
      }
    })

    if (!workflow) {
      return NextResponse.json({ msg: "Workflow not found or does not belong to the user" }, { status: 400 })
    } 

    return NextResponse.json({ msg: "done" }, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ msg: "Something went wrong" }, { status: 400 })
  }
}

//Delete a workflow
export async function DELETE(req: NextResponse) {

  try {

    return NextResponse.json({ msg: "done" }, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ msg: "Something went wrong" }, { status: 400 })
  }
}