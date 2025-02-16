import { google } from "googleapis";
import { Kafka } from "kafkajs";
import dotenv from "dotenv"
import { getTokenFromDB } from "./tokenFncs";

dotenv.config()
type TaskType = {
  id: string,
  userId: string,
  workflowId: string,
  stepNo: number,
  appType: string,
  connectionId: string,
  eventType: string,
  payload: PayloadType
  status: string
}

type PayloadType = {
  to: string,
  from: string,
  subject: string,
  body: string,
}

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
          // console.log("task ", message)

          if (task.eventType === "send_email") {
            await sendEmail(task);
          } else {
            console.log("Event type not matched")
          }
        } catch (error) {
          console.log("Something went wrong in worker", error)
        }
      }
    })

  } catch (error) {
    console.log("Something went wrong in worker", error)
  }
}

main()
/**
 * create and oauth client 
 * get access/refresh token 
 * if not else create one 
 * send email 
 * handle success and failure 
 * update db 
*/

async function sendEmail(task: TaskType) {
  try {
    // console.log("inside sendEmail function", task)

    const connectionDetails = await getTokenFromDB(task.appType, task.connectionId)

    // console.log(connectionDetails)

    const oauth2client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}/api/auth/google/callback`
    );
    oauth2client.setCredentials({
      refresh_token: connectionDetails?.refreshToken,
    });
    // const accessToken = await oauth2client.getAccessToken();
    // console.log("--------------", accessToken);
    // console.log("--------------", connectionDetails?.refreshToken)

    const gmail = google.gmail({ version: "v1", auth: oauth2client })

    const createEmail = ({ to, from, subject, body }: PayloadType) => {
      const email = [
        `To: ${task.payload.to}`,
        `From: ${task.payload.from}`,
        `Subject: ${task.payload.subject}`,
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=utf-8',
        '',
        `${task.payload.body}`
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

    console.log("raw email", email)

    if (email) {
      const response = await gmail.users.messages.send({
        userId: "me",
        requestBody: {
          raw: email,
        }
      });
      console.log("response ------------------>", response)
    } else {
      console.log("no email")
    }


  } catch (error) {
    console.log("Something went wrong sendEmail", error)
  }
}