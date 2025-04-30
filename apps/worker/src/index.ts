import { Kafka } from "kafkajs";
import dotenv from "dotenv"
import { sendEmail } from "./gmailActions/sendEmail";
import { TaskType } from "@repo/types";
import { draftEmail } from "./gmailActions/draftEmail";
import { createPage } from "./notionActions/createPage";
import { addComment } from "./notionActions/addComment";

dotenv.config()

const kafka = new Kafka({
  clientId: "worker",
  brokers: ["localhost:9092"]
});

const consumer = kafka.consumer({ groupId: "task-consumer" });

async function main() {
  try {
    await consumer.connect();
    await consumer.subscribe({
      topic: "tasks",
      fromBeginning: true,
    })

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const task = JSON.parse(message.value?.toString() || "");
          await handleTask(task);
        } catch (error) {
          console.error("Error processing a task in worker", error)
        }
      }
    })
  } catch (error) {
    console.error("Something went wrong in worker", error)
  }
}

async function handleTask(task: TaskType) {
  const handler = eventHandlers[task.eventType];
  if (handler) {
    await handler(task);
  } else {
    console.warn("No handler for event type", task.eventType)
  }
}

// Add event handlers
const eventHandlers: Record<string, (task: TaskType) => Promise<void>> = {
  SEND_EMAIL: sendEmail,
  DRAFT_EMAIL: draftEmail,
  CREATE_PAGE: createPage,
  ADD_COMMENT: addComment
};

main()