import { Gmail_Send_Mail_Type, TaskType } from "@repo/types";
import { getTokenFromDB } from "../tokenFncs";
import { google } from "googleapis";
import { updateOutboxAndLogs } from "../updateOutboxAndLogs";

export async function sendEmail(task: TaskType) {
  try {
    const connectionDetails = await getTokenFromDB(task.appType, task.connectionId)
    const payload = task.payload as Gmail_Send_Mail_Type;

    const oauth2client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      `${process.env.GMAIL_CLIENT_ID}/api/auth/google/callback`
    );
    oauth2client.setCredentials({
      refresh_token: connectionDetails?.refreshToken,
    });

    const gmail = google.gmail({ version: "v1", auth: oauth2client })

    const createEmail = ({ to, from, subject, body }: Gmail_Send_Mail_Type) => {
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
      to: `${payload.to}`,
      from: `${payload.from}`,
      subject: `${payload.subject}`,
      body: `${payload.body}`,
    })

    const response = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: email,
      }
    });

    await updateOutboxAndLogs({
      task,
      status: response.status >= 200 && response.status < 300 ? "completed" : "failed",
      message: response.status >= 200 && response.status < 300
        ? "Action executed Successfull"
        : `Failed to send email via Gmail. Status: ${response.status}`,
    });
  } catch (error) {
    console.error("Something went wrong sendEmail", error)
    await updateOutboxAndLogs({
      task,
      status: "failed",
      message: `Failed to send email via Gmail. Error: ${error}`,
    });
  }
}