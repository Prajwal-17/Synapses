import { prisma } from "@repo/db/prisma";
import { NextRequest, NextResponse } from "next/server"

//Create a workflow
export async function POST(req: NextRequest,
  { params }: {
    params: Promise<{
      userId: string
    }>
  }) {

  try {
    const { userId } = await params;

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      }
    })

    if (!userId || !user) {
      return NextResponse.json({ msg: "User does not exists" }, { status: 404 })
    }

    const workflow = await prisma.workflow.create({
      data: {
        userId: userId,
        totalActionSteps: 0,
      }
    })

    if (!workflow) {
      return NextResponse.json({ msg: "Creating workflow failed!" }, { status: 400 })
    }

    return NextResponse.json({ msg: "Successfully created workflow", workflow }, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ msg: "Something went wrong" }, { status: 400 })
  }
}

//Get Workflow details 
export async function GET(req: NextRequest,
  { params }: {
    params: Promise<{
      userId: string
    }>
  }) {
  try {
    const { userId } = await params;

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      }
    })

    if (!userId || !user) {
      return NextResponse.json({ msg: "User does not exists" }, { status: 404 })
    }

    const workflow = await prisma.workflow.findFirst({
      where: {
        userId: userId
      }
    })

    if (!workflow) {
      return NextResponse.json({ msg: "Workflow does not exist" }, { status: 400 })
    }

    return NextResponse.json({ msg: "Successfully fetched workflow", workflow }, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ msg: "Something went wrong" }, { status: 400 })
  }
}