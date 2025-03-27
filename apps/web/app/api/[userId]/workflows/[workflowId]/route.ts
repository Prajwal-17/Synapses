import { prisma } from "@repo/db/prisma";
import { ActionType, ApiWorkflowType, TriggerType } from "@repo/types";
import { NextRequest, NextResponse } from "next/server";

//Get Full Data of a workflow
export async function GET(
  req: NextRequest,
  { params }: {
    params: Promise<{
      userId: string,
      workflowId: string,
    }>
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
    return NextResponse.json({ msg: "Successfully fetched workflow details", workflow }, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ msg: "Something went wrong" }, { status: 400 })
  }
}

//Update data of a workflow
export async function POST(
  req: NextRequest,
  { params }: {
    params: Promise<{
      userId: string,
      workflowId: string,
    }>
  }
) {
  try {
    const { userId, workflowId } = await params;
    const body: ApiWorkflowType = await req.json();
    const trigger: TriggerType = body.Trigger;
    const actions: ActionType[] = body.actions;

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
    });

    if (!workflow) {
      return NextResponse.json({ msg: "Workflow does not exist or does not belong to the user" }, { status: 400 })
    };

    const updatedWorkflow = await prisma.$transaction([
      prisma.workflow.update({
        where: { id: workflow.id },
        data: {
          userId: workflow.userId,
          totalActionSteps: body.totalActionSteps,
        }
      }),
      prisma.trigger.upsert({
        where: { workflowId: workflow.id },
        update: {
          appType: trigger.appType,
          connectionId: trigger.connectionId,
          type: "trigger",
          eventType: trigger.eventType,
          payload: trigger.payload,
          stepNo: trigger.stepNo
        },
        create: {
          workflowId: workflow.id,
          appType: trigger.appType,
          connectionId: trigger.connectionId,
          type: "trigger",
          eventType: trigger.eventType,
          payload: trigger.payload,
          stepNo: trigger.stepNo
        }
      }),
      ...actions.map((action: ActionType) =>
        prisma.action.upsert({
          where: { id: action.id },
          update: {
            workflowId: workflow.id,
            appType: action.appType,
            connectionId: action.connectionId,
            type: "action",
            eventType: action.type,
            payload: action.payload,
            stepNo: action.stepNo,
          },
          create: {
            workflowId: workflow.id,
            appType: action.appType,
            connectionId: action.connectionId,
            type: "action",
            eventType: action.type,
            payload: action.payload,
            stepNo: action.stepNo,
          },
        }
        ))
    ])
    return NextResponse.json({ msg: "Successfully updated", updatedWorkflow }, { status: 200 })
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