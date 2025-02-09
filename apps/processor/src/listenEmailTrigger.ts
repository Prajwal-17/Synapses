import { prisma } from "./db";
import { getRefreshTokenFromDB } from "./getRefreshTokenFromDB";
import { google } from "googleapis";

type WorkflowType = {
  id: string,
  userId: string,
  totalActionSteps: number,
  lastCheckedAt: Date,
  createdAt: Date,
  Trigger: {
    id: string,
    workflowId: string,
    connectionId: string,
    appType: string,
    type: string,
    eventType: String,
    config: JSON,
    createdAt: Date,
  },
  actions: ActionsType[]
};

type ActionsType = {
  id: string,
  workflowId: string,
  appType: string,
  type: string,
  eventType: string,
  config: JSON,
  stepNo: number,
  createdAt: Date
}

const gmail = google.gmail("v1");

export async function listenEmailTrigger(emailFilteredWorkflows: WorkflowType[]) {
  try {
    for (const workflow of emailFilteredWorkflows) {

      const lastCheckedAt = workflow.lastCheckedAt.getTime();
      const nowTime = new Date().getTime();

      if (!lastCheckedAt) {
        console.log("run immediately")
      } else {

        //triggerInterval of 15min
        const triggerInterval = 15 * 60 * 1000;

        if (nowTime - lastCheckedAt >= triggerInterval) {
          console.log("15min have passed fetch email")

          // fetch accessToken and fetch email and check if how many email have arrived == 111
          // and update outbox table with tasks  
          const connectionId = workflow.Trigger?.connectionId;
          const appType = workflow.Trigger?.appType;

          if (connectionId && appType) {
            const connectionDetails = await getRefreshTokenFromDB(appType, connectionId);

            if (!connectionDetails) {
              console.log("no refresh token")
            }

            const oauth2client = new google.auth.OAuth2(
              process.env.GOOGLE_CLIENT_ID,
              process.env.GOOGLE_CLIENT_SECRET,
              `${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}/api/auth/google/callback`
            );
            oauth2client.setCredentials({ refresh_token: connectionDetails?.refreshToken });


            try {
              const emails = await gmail.users.messages.list({
                userId: "me",
                access_token: connectionDetails?.accessToken,
                q: "is:inbox is:unread",
                maxResults: 10
              });

            } catch (error: any) {

              if (error.code == 401) {
                const accessToken = await oauth2client.getAccessToken();
                console.log("accessToken---------", accessToken.token)

                /**Add db logic to store accestoken */

                if (accessToken.token) {
                  const response = await gmail.users.messages.list({
                    userId: "me",
                    access_token: accessToken.token,
                    q: "is:inbox is:unread",
                    maxResults: 2
                  });

                  // console.log(response.data.messages)
                  const latestEmails = await getEmailMessages(response.data.messages, accessToken.token);
                  // console.log(latestEmails?.length)

                  // const emaillenght = latestEmails.length();

                  await addTasksToOutbox(workflow, latestEmails?.length || 0)
                  // console.dir(emailFilteredWorkflows, { depth: null })

                  // task addTasksToOutbox
                  // console.log("latestemails", latestEmails)
                  // console.dir(response, { depth: null })
                }
              } else {
                console.warn("unexpected error caused in gmail tokens")
              }
            }
          } else {
            console.log("no connectionid & appType")
          }
        }
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
          console.log("NO latest Emails Found")
        }
      }

      return latestEmails
    }
  } catch (error) {
    console.log("something went wrong", error)
  }
}

async function addTasksToOutbox(workflow: any, emailLength: number) {

  try {


    workflow.map((item: WorkflowType) => {


      return {
        userId: item.userId,
        workflowId: item.id,
        stepNo:
      }
    })
    // workflow.filter((item: any) => item.actions)

    // for (var i = 0; i < emailLength; i++) {
    //   await prisma.outbox.createMany({
    //     data: {
    //       id: workflow.actions.map
    //     }
    //   })
    // }

  } catch (error) {
    console.log("Something went wrong while adding tasks", error)
  }
}