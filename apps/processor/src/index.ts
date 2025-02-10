import { prisma } from "./db";
import * as cron from "node-cron"
import dotenv from "dotenv"
import { listenEmailTrigger } from "./listenEmailTrigger";
import { Kafka } from "kafkajs"

dotenv.config()
const POLLING_INTERVAL = 2000;

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
    const pendingActions = await prisma.outbox.findMany({
      where: {
        status: "pending"
      },
      take: 2,
    });

    console.log(pendingActions)

  } catch (error) {
    console.log(error)
  }

}

// setInterval(processOutbox, POLLING_INTERVAL);

const kafka = new Kafka({
  clientId: "test_app",
  brokers: ["kafka1:9092"]
});

const producer = kafka.producer()
const consumer = kafka.consumer({ groupId: "consumerId" })

async function main() {

  try {
    await producer.connect();

    await producer.send({
      topic: "test-topics",
      messages: [
        { value: "hello world" }
      ]
    });

    // await producer.disconnect();
    await consumer.connect();
    await consumer.subscribe({
      topic: "test-topics", fromBeginning: true,
    })

    await consumer.run({
      eachMessage: async ({ topic, message, partition }) => {
        console.log({
          offset: message.offset,
          value: message.value
        })
      }
    })


  } catch (error) {
    console.log(error)
  }
}

main()