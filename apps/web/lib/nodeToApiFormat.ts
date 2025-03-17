import { ActionType, ApiWorkflowType, NodeDataType, TriggerType } from "@repo/types";

export const nodeToApiFormat = (userId: string, workflowId: string, nodeArray: NodeDataType[]) => {
  const triggerNode = nodeArray[0]

  if (!triggerNode || !userId || !workflowId || !nodeArray) {
    console.error("Node Array is missing");
    return null;
  }

  const trigger: TriggerType = {
    id: triggerNode?.id,
    workflowId: triggerNode?.workflowId,
    appType: triggerNode?.appType,
    connectionId: triggerNode?.connectionId,
    type: triggerNode?.type,
    eventType: triggerNode?.eventType,
    payload: triggerNode?.payload,
    stepNo: triggerNode?.stepNo
  }

  const actions: ActionType[] = nodeArray
    .filter((item) => item.type === "action")
    .map((item) => ({
      id: item.id,
      workflowId: workflowId,
      appType: item.appType,
      connectionId: item.connectionId,
      type: item.type,
      eventType: item.eventType,
      payload: item.payload,
      stepNo: item.stepNo
    }))

  const workflow: ApiWorkflowType = {
    id: workflowId,
    userId: userId,
    totalActionSteps: actions.length,
    Trigger: trigger,
    actions: actions
  }
  return workflow
}