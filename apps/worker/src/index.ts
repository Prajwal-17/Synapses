import { google } from "googleapis";
import { Kafka } from "kafkajs";
import dotenv from "dotenv"
import { getTokenFromDB } from "./tokenFncs";
import { prisma } from "./db";
import { EmailPayloadType, TaskType } from "@repo/types";

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

          if (task.eventType === "SEND_EMAIL") {
            await sendEmail(task);
          } else {
            console.log("Event type not matched")
          }
        } catch (error) {
          console.error("Something went wrong in worker", error)
        }
      }
    })
  } catch (error) {
    console.error("Something went wrong in worker", error)
  }
}

main()

async function sendEmail(task: TaskType) {
  try {
    const connectionDetails = await getTokenFromDB(task.appType, task.connectionId)

    const oauth2client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      `${process.env.GMAIL_CLIENT_ID}/api/auth/google/callback`
    );
    oauth2client.setCredentials({
      refresh_token: connectionDetails?.refreshToken,
    });

    const gmail = google.gmail({ version: "v1", auth: oauth2client })

    const createEmail = ({ to, from, subject, body }: EmailPayloadType) => {
      const email = [
        `To: ${to}`,
        `From: ${from}`,
        `Subject: ${subject}`,
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=utf-8',
        '',
        `${body}`
      ].join('\r\n');

      return Buffer.from(email, "utf-8")
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    }

    const email = createEmail({
      to: `${task.payload.to}`,
      from: `${task.payload.from}`,
      subject: `${task.payload.subject}`,
      body: `${task.payload.body}`,
    })

    if (email) {
      const response = await gmail.users.messages.send({
        userId: "me",
        requestBody: {
          raw: email,
        }
      });

      if (response) {
        await prisma.outbox.update({
          where: {
            id: task.id,
          },
          data: {
            status: "completed"
          }
        })
      } else {
        await prisma.outbox.update({
          where: {
            id: task.id,
          },
          data: {
            status: "failed"
          }
        })
      }
      console.log("response ------------------>", response)
    } else {
      console.log("No email")
    }
  } catch (error) {
    console.error("Something went wrong sendEmail", error)
  }
}