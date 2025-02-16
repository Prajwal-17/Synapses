import { prisma } from "./db";
import { getTokenFromDB, updateAccessToken } from "./tokenFncs";
import { google } from "googleapis";
import { ActionsType, WorkflowType } from "./types/types";

const gmail = google.gmail("v1");

export async function listenEmailTrigger(emailFilteredWorkflows: WorkflowType[]) {
  try {
    for (const workflow of emailFilteredWorkflows) {

      const nowTime = new Date().getTime();
      const triggerInterval = 15 * 60 * 1000;
      const lastCheckedAt = workflow.lastCheckedAt.getTime();

      // console.log(nowTime - lastCheckedAt >= triggerInterval)
      if (nowTime - lastCheckedAt >= triggerInterval) {

        //Connection id of the integration app associated with trigger
        const connectionId = workflow.Trigger?.connectionId;
        const appType = workflow.Trigger?.appType;

        if (connectionId && appType) {
          const connectionDetails = await getTokenFromDB(appType, connectionId);

          if (!connectionDetails) {
            console.error("No Refresh token present")
            continue;
          }

          const oauth2client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            `${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}/api/auth/google/callback`
          );
          oauth2client.setCredentials({ refresh_token: connectionDetails?.refreshToken });

          try {
            const response = await gmail.users.messages.list({
              userId: "me",
              access_token: connectionDetails?.accessToken,
              q: "is:inbox is:unread",
              maxResults: 7
            });

            const latestEmails = await getEmailMessages(response.data.messages, connectionDetails?.accessToken) || [];
            if (latestEmails.length > 0) {
              await addTasksToOutbox(workflow, latestEmails?.length)
            }

          } catch (error: any) {
            if (error.code == 401) {
              const accessToken = await oauth2client.getAccessToken();

              await updateAccessToken(connectionDetails.id, accessToken.token ?? "")

              if (accessToken.token) {
                const response = await gmail.users.messages.list({
                  userId: "me",
                  access_token: accessToken.token,
                  q: "is:inbox is:unread",
                  maxResults: 7
                });

                const latestEmails = await getEmailMessages(response.data.messages, accessToken.token) || [];
                if (latestEmails?.length > 0) {
                  await addTasksToOutbox(workflow, latestEmails?.length)
                }
              }
            } else {
              console.error("Unexpected error caused in gmail tokens")
            }
          }
        } else {
          console.error("Fields ConnectionId and appType are not present")
        }
      } else {
        continue;
      }
    }
  } catch (error) {
    console.log("Something went wrong")
  }
}

async function getEmailMessages(messagesIds: any, accessToken: string) {

  const latestEmails = []

  try {

    for (const id of messagesIds) {

      const nowTime = new Date().getTime();
      const intervalTime = 15 * 60 * 1000;

      const email = await gmail.users.messages.get({
        userId: "me",
        id: id.id,
        access_token: accessToken,
        format: "metadata"
      })

      if (email.data.internalDate) {
        const emailTime = parseInt(email.data.internalDate);

        if (nowTime - emailTime <= intervalTime) {
          latestEmails.push(email.data)
        } else {
          console.error("No latest Emails Found")
        }
      }
      return latestEmails
    }
  } catch (error) {
    console.error("Could not fetch getEmailMessages", error)
  }
}

async function addTasksToOutbox(workflow: WorkflowType, emailLength: number) {

  if (!workflow?.actions) {
    console.error(`Workflow ${workflow.id} actions are undefined, cannot add tasks to outbox.`);
    return;
  }

  if (emailLength <= 0) {
    console.log(`No new emails found for workflow ${workflow.id}, not adding any tasks.`);
    return;
  }

  try {
    const task = workflow.actions.map((item: ActionsType) => ({
      userId: workflow.userId,
      workflowId: workflow.id,
      stepNo: item.stepNo,
      appType: item.appType,
      connectionId: item.connectionId,
      eventType: item.eventType,
      payload: item.config || {},
      status: "pending"
    }));

    await prisma.outbox.createMany({
      data: task,
      skipDuplicates: false,
    });

    console.log("tasks added to outbox table")
  } catch (error) {
    console.error("Something went wrong while adding tasks", error)
  }
}