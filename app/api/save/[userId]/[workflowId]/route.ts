import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest, { params }: { params: { userId: string, workflowId: string } }) {
  try {
    const body = await req.json();
    const { userId, workflowId } = await params
    console.log("data fron fe ", JSON.parse(body))

    //  1.find workflow and update  
    // const updatedData = await prisma.workflow.update({
    //   where: {
    //     id: workflowId,
    //   },
    //   data: {
    //     id: workflowId,
    //     userId: userId,
    //     totalActionSteps: 4,
    //     triggerId: "df54b186-c553-4ec4-a7cd-e56627d45c45",
    //     actions: {
    //       create: [
    //         body.nodeData.map((item: any) => ({
    //           id: item.nodeId,
    //           triggerId: "df54b186-c553-4ec4-a7cd-e56627d45c67",
    //           workflowId: workflowId,
    //           appType: item.app,
    //           config: item.config,
    //           stepNo: item.stepNo,
    //         }
    //         ))
    //       ]

    //     }
    //   }
    // })

    // if (!updatedData) {
    //   return NextResponse.json({ msg: "not updated" }, { status: 400 })
    // }
    // console.log(updatedData)
    // console.log("body", body.nodeData)
    // console.log(userId, workflowId)
    // const action = body.body
    // console.log(action)


    return NextResponse.json({ msg: "done" }, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ msg: "Something went wrong" }, { status: 400 })
  }
}