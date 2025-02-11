import { prisma } from "./db";
import * as cron from "node-cron"
import dotenv from "dotenv"
import { listenEmailTrigger } from "./listenEmailTrigger";
import { Kafka } from "kafkajs"

dotenv.config()
const POLLING_INTERVAL = 2000;

const kafka = new Kafka({
  clientId: "processor",
  brokers: ["localhost:9092"]
});

const producer = kafka.producer()

cron.schedule('*/3 * * * * *', () => {
  // getWorkflows();
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

    const emailFilteredWorkflows = result.filter((item) => item.Trigger?.eventType === "LISTEN-EMAIL")

    if (emailFilteredWorkflows.length > 0) {
      listenEmailTrigger(emailFilteredWorkflows)
    }

  } catch (error) {
    console.error("Error occured during workflow fetching", error)
  }
}

async function processOutbox() {

  try {
    console.log("Fetching pending actions")

    const pendingActions = await prisma.outbox.findMany({
      where: {
        status: "pending"
      },
      take: 20,
    });
    // console.log(pendingActions);

    if (pendingActions.length === 0) return;

    await producer.connect();

    // const messages =

    await producer.send({
      topic: "tasks",
      messages: [
        { key: "key1", value: "hello world" }
      ]
    });


  } catch (error) {
    console.log("Something went wrong in processor", error)
  }
}

setInterval(processOutbox, POLLING_INTERVAL);