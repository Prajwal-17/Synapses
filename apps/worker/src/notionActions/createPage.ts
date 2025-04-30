import { Notion_Create_Page_Type, TaskType } from "@repo/types"
import { getTokenFromDB } from "../tokenFncs"
import { updateOutboxAndLogs } from "../updateOutboxAndLogs"

export async function createPage(task: TaskType) {
  try {
    const connectionDetails = await getTokenFromDB(task.appType, task.connectionId)
    const payload = task.payload as Notion_Create_Page_Type

    const body = {
      parent: {
        page_id: payload.pageId
      },
      properties: {
        title: [
          {
            type: "text",
            text: {
              content: payload.title,
            },
          },
        ],
      },
      children: [
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              {
                type: "text",
                text: {
                  content: payload.content,
                },
              },
            ],
          },
        },
      ],
    }

    const response = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${connectionDetails?.accessToken}`
      },
      body: JSON.stringify(body)
    });

    await updateOutboxAndLogs({
      task,
      status: response.status >= 200 && response.status < 300 ? "completed" : "failed",
      message: response.status >= 200 && response.status < 300
        ? "Notion Page created successful"
        : `Failed to create page in Notion. Status: ${response.status}`,
    });
  } catch (error) {
    console.error("Something went wrong Notion Page Creation", error)
    await updateOutboxAndLogs({
      task,
      status: "failed",
      message: `Failed to create page in Notion. Error: ${error}`,
    });
  }
}