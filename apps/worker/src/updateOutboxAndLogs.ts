import { UpdateOutboxAndLogsType } from "@repo/types";
import { prisma } from "./db";

export async function updateOutboxAndLogs(data: UpdateOutboxAndLogsType) {
  try {

    await prisma.$transaction([
      prisma.outbox.update({
        where: {
          id: data.task.id,
        },
        data: {
          status: data.status,
        }
      }),

      prisma.logs.create({
        data: {
          workflowId: data.task.workflowId,
          stepNo: data.task.stepNo,
          appType: data.task.appType,
          eventType: data.task.eventType,
          connectionId: data.task.connectionId,
          message: data.message,
          status: data.status
        }
      })
    ])
  } catch (error) {
    console.log("Something went wrong while updating logs ", error)
  }
}