import { prisma } from "./db";
import * as cron from "node-cron"

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
        }
      }
    });


    const result2 = result
      .filter((item) => item.Trigger?.eventType === "LISTEN-EMAIL")

    console.dir(result, { depth: null })
    console.log("result2", result2)

  } catch (error) {
    console.log(error)
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

setInterval(processOutbox, POLLING_INTERVAL);
