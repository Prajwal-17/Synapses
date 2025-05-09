import { prisma } from "@repo/db/prisma";
import { ApiWorkflowType } from "@repo/types";
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
        name: "untitled name",
        status: false
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

//Get All Workflows
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

    const full_workflows = await prisma.workflow.findMany({
      where: {
        userId: userId
      },
      include: {
        actions: true,
        Trigger: true
      }
    });

    if (!full_workflows) {
      return NextResponse.json({ msg: "Workflow does not exist" }, { status: 400 })
    }

    // extract data for the frontend
    function fedata(workflows: ApiWorkflowType[]) {
      const segregatedWorkflow: any[] = [];
      const apps: string[] = [];

      workflows.forEach((wf) => {
        const workflowId = wf.id;
        const name = wf.name;
        const status = wf.status;
        const updatedAt = new Date(`${wf.updatedAt}`);

        const workflow_date = updatedAt.getDate();
        const workflow_month = updatedAt.toDateString().split(" ")[1];
        const workflow_year = updatedAt.getFullYear();

        if (wf.Trigger) {
          apps.push(wf.Trigger.appType);
        }

        wf.actions.forEach((action) => {
          apps.push(action.appType);
        });

        segregatedWorkflow.push({
          workflowId,
          name,
          status,
          last_modified: `${workflow_month} ${workflow_date},${workflow_year}`,
          apps: [...new Set(apps)] // using Set object lets us store only the unique values
        });
      });

      return segregatedWorkflow;
    };

    const workflows = fedata(full_workflows as ApiWorkflowType[]);
    return NextResponse.json({ msg: "Successfully fetched workflows", workflows: workflows }, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ msg: "Something went wrong" }, { status: 400 })
  }
}