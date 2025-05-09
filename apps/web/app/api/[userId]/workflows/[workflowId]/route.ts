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

// Update/save data of a workflow
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
      },
      include: {
        actions: true
      }
    });

    if (!workflow) {
      return NextResponse.json({ msg: "Workflow does not exist or does not belong to the user" }, { status: 400 })
    };

    // pass prisma client in the async arrow function 
    const updatedWorkflow = await prisma.$transaction(async (prisma) => {
      await prisma.workflow.update({
        where: {
          id: workflow.id
        },
        data: {
          totalActionSteps: workflow.actions.length,
        }
      })

      if (trigger && trigger.appType !== "") {
        await prisma.trigger.update({
          where: {
            id: body.Trigger.id,
          },
          data: {
            workflowId: trigger.workflowId,
            appType: trigger.appType,
            connectionId: trigger.connectionId,
            type: "trigger",
            eventType: trigger.eventType,
            payload: trigger.payload,
            stepNo: trigger.stepNo
          }
        })
      }

      if (actions && actions.length > 0) {
        await Promise.all(
          actions.map((item) =>
            prisma.action.upsert({
              where: {
                id: item.id
              },
              update: {
                workflowId: workflow.id,
                appType: item.appType,
                connectionId: item.connectionId,
                type: "action",
                eventType: item.eventType,
                payload: item.payload,
                stepNo: item.stepNo
              },
              create: {
                workflowId: workflow.id,
                appType: item.appType,
                connectionId: item.connectionId,
                type: "action",
                eventType: item.eventType,
                payload: item.payload,
                stepNo: item.stepNo
              }
            })
          )
        )
      }
    })

    return NextResponse.json({ msg: "Successfully updated", updatedWorkflow: updatedWorkflow }, { status: 200 })
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