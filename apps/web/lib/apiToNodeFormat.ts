import { useWorkflowStore } from "@/store/workflowStore";
import { ApiWorkflowType } from "@repo/types";

export const apiToNodeData = (workflow: ApiWorkflowType) => {
  const nodes = [];

  if (workflow.Trigger) {
    nodes.push({
      id: workflow.Trigger.id,
      workflowId: workflow.Trigger.id,
      appType: workflow.Trigger.appType,
      connectionId: workflow.Trigger.connectionId,
      type: workflow.Trigger.type,
      eventType: workflow.Trigger.eventType,
      payload: workflow.Trigger.payload,
      stepNo: workflow.Trigger.stepNo,
    })
  } else {
    console.log("Trigger is null or undefined")
  }

  if (workflow.actions) {
    workflow.actions.forEach((action) => {
      nodes.push({
        id: action.id,
        workflowId: action.workflowId,
        appType: action.appType,
        connectionId: action.connectionId,
        type: action.type,
        eventType: action.eventType,
        payload: action.payload,
        stepNo: action.stepNo,
      })
    })
  } else {
    console.log("Actions is null or undefined")
  }

  if (nodes.length > 0) {
    useWorkflowStore.getState().setNodesFromApi(nodes);
    return nodes
  }
}