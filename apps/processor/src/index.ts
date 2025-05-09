import { prisma } from "./db";
import * as cron from "node-cron"
import dotenv from "dotenv"
import { listenEmailTrigger } from "./listenEmailTrigger";
import { Kafka } from "kafkajs"
import { ApiWorkflowType } from "@repo/types";

dotenv.config()
const POLLING_INTERVAL = 2000;

const kafka = new Kafka({
  clientId: "processor",
  brokers: ["localhost:9092"]
});

const producer = kafka.producer()

cron.schedule('*/3 * * * * *', () => {
  getWorkflows();
})

async function getWorkflows() {

  try {
    const result = await prisma.workflow.findMany({
      include: {
        Trigger: true,
        actions: {
          orderBy: {
            stepNo: "asc",
          }
        },
      },
    });

    const emailFilteredWorkflows = result.filter((item) => item.Trigger?.eventType === "LISTEN_EMAIL")

    if (emailFilteredWorkflows.length > 0) {
      try {
        await listenEmailTrigger(emailFilteredWorkflows as ApiWorkflowType[])
      } catch (error) {
        console.error("Could not fetch email", error)
      }
    }

  } catch (error) {
    console.error("Error occured during workflow fetching", error)
  }
}

async function processOutbox() {

  try {
    console.log("Fetching pending actions")

    const actions = await prisma.outbox.findMany({
      where: {
        status: "pending"
      },
      take: 20,
    });

    if (actions.length === 0) return;

    await producer.connect();

    const messages = actions.map((item) => ({
      key: item.workflowId,
      value: JSON.stringify({
        id: item.id,
        userId: item.userId,
        workflowId: item.workflowId,
        stepNo: item.stepNo,
        appType: item.appType,
        connectionId: item.connectionId,
        eventType: item.eventType,
        payload: item.payload,
        status: item.status,
      })
    }));

    const responses = await producer.send({
      topic: "tasks",
      messages
    });

    const outboxIds = actions.map((item) => item.id)

    await prisma.outbox.updateMany({
      where: {
        id: {
          in: outboxIds,
        }
      },
      data: {
        status: "inqueue"
      }
    });

  } catch (error) {
    console.error("Something went wrong in processor", error)
  }
}

setInterval(processOutbox, POLLING_INTERVAL);