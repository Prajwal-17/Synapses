import { Notion_Add_Comment_Type, TaskType } from "@repo/types";
import { getTokenFromDB } from "../tokenFncs";
import { updateOutboxAndLogs } from "../updateOutboxAndLogs";

export async function addComment(task: TaskType) {

  try {
    const connectionDetails = await getTokenFromDB(task.appType, task.connectionId)
    const payload = task.payload as Notion_Add_Comment_Type;

    const body = {
      "parent": {
        "page_id": payload.pageId
      },
      "rich_text": [
        {
          "text": {
            "content": payload.comment
          }
        }
      ]
    }
    const response = await fetch("https://api.notion.com/v1/comments", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${connectionDetails?.accessToken}`,
        "Notion-Version": "2022-06-28"
      },
      body: JSON.stringify(body)
    })

    await updateOutboxAndLogs({
      task,
      status: response.status >= 200 && response.status < 300 ? "completed" : "failed",
      message: response.status >= 200 && response.status < 300
        ? "Notion Comment created successfully"
        : `Failed to create comment in Notion. Status: ${response.status}`,
    });
  } catch (error) {
    console.error("Something went wrong Notion Comment Creation", error)
    await updateOutboxAndLogs({
      task,
      status: "failed",
      message: `Failed to create comment in Notion. Error: ${error}`,
    });
  }
}