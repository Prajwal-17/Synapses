import { prisma } from "@repo/db/prisma";
import { NodeData, NodeType } from "@/store/panelDetailsStore";
import { NextRequest, NextResponse } from "next/server";

//Get Full Data of a workflow
export async function GET(
  req: NextRequest,
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
      },
      include: {
        Trigger: true,
        actions: true,
      }
    });

    if (!workflow) {
      return NextResponse.json({ msg: "Workflow does not exist" }, { status: 400 })
    }

    const nodeData: NodeData[] = []

    nodeData.push({
      stepNo: 1,
      //@ts-ignore
      nodeId: workflow.triggerId,
      //@ts-ignore
      app: workflow.Trigger?.appType,
      account: "",
      //@ts-ignore
      type: workflow.Trigger?.type,
      event: "",
      //@ts-ignore
      config: workflow.Trigger?.config,
    });

    workflow.actions.map((item) => {
      nodeData.push(

        {
          stepNo: item.stepNo,
          nodeId: item.id,
          app: item.appType,
          account: "",
          type: NodeType.action,
          event: "",
          config: item.config as Record<string, any>,
        }
      )
    })

    console.log(nodeData)
    // workflow.actions.map((item) => {
    //   console.log(item.config.to)
    // })


    return NextResponse.json({ msg: "Successfully fetched workflow details", nodeData }, { status: 200 })
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
      return NextResponse.json({ msg: "Workflow does not exist or does not belong to the user" }, { status: 400 })
    }

    const triggers = [];
    const actions = [];

    for (const step of body as NodeData[]) {
      if (step.type === "trigger") {
        triggers.push({
          where: {
            id: step.nodeId,
          },
          update: {
            workflowId: workflow.id,
            appType: step.app,
            type: step.type,
            config: step.config,
          },
          create: {
            id: step.nodeId,
            workflowId: workflow.id,
            appType: step.app,
            type: step.type,
            config: step.config,
          }
        })
      } else if (step.type === "action") {
        actions.push({
          where: {
            id: step.nodeId,
          },
          update: {
            workflowId: workflowId,
            appType: step.app,
            type: step.type,
            eventType: "",
            config: step.config,
            stepNo: step.stepNo,
          },
          create: {
            id: step.nodeId,
            workflowId: workflowId,
            appType: step.app,
            eventType: "",
            type: step.type,
            config: step.config,
            stepNo: step.stepNo,
          }
        })
      }
    }

    const updatedData = await prisma.$transaction([
      ...triggers.map((t) => prisma.trigger.upsert(t)),
      ...actions.map((a) => prisma.action.upsert(a))
    ])

    return NextResponse.json({ msg: "Successfully updated", updatedData }, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ msg: "Something went wrong" }, { status: 400 })
  }
}

//Delete a workflow
export async function DELETE() {

  try {

    return NextResponse.json({ msg: "done" }, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ msg: "Something went wrong" }, { status: 400 })
  }
}