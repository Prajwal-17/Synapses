import { google } from "googleapis";
import { prisma } from "./db";
import * as cron from "node-cron"
import { getRefreshTokenFromDB } from "./getRefreshTokenFromDB";
import dotenv from "dotenv"
import { listenEmailTrigger } from "./listenEmailTrigger";

dotenv.config()
const POLLING_INTERVAL = 10000;

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


    const emailFilteredWorkflows = result
      .filter((item) => item.Trigger?.eventType === "LISTEN-EMAIL")

    listenEmailTrigger(emailFilteredWorkflows)

   
    // checkEmails(emailTrigger);

    // console.dir(result, { depth: null })
    // console.log("result2", result2)

  } catch (error) {
    console.log("error ->>", error)
  }
}


async function processOutbox() {

  try {

    const pendingActions = await prisma.outbox.findMany({
      where: {
        status: "pending"
      },
      take: 2,
    })

    // console.log(pendingActions);

  } catch (error) {
    console.log(error)
  }

}

// setInterval(processOutbox, POLLING_INTERVAL);
