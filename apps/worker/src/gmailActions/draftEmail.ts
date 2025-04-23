import { EmailPayloadType, TaskType } from "@repo/types";
import { prisma } from "../db";
import { getTokenFromDB } from "../tokenFncs";
import { google } from "googleapis";
import { updateOutboxAndLogs } from "../updateOutboxAndLogs";

export async function draftEmail(task: TaskType) {
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

    const draftEmail = createEmail({
      to: `${task.payload.to}`,
      from: `${task.payload.from}`,
      subject: `${task.payload.subject}`,
      body: `${task.payload.body}`,
    })

    const response = await gmail.users.drafts.create({
      userId: "me",
      requestBody: {
        message: {
          raw: draftEmail
        }
      }
    })

    await updateOutboxAndLogs({
      task,
      status: response.status >= 200 && response.status < 300 ? "completed" : "failed",
      message: response.status >= 200 && response.status < 300
        ? "Action executed Successfull"
        : `Failed to create draft via Gmail. Status: ${response.status}`,
    });
  } catch (error) {
    console.log("Error while creating draft gmail")
    await updateOutboxAndLogs({
      task,
      status: "failed",
      message: `Failed to create draft via Gmail. Error: ${error}`,
    });
  }
}