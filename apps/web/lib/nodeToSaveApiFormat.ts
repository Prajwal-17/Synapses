import { ActionType, ApiWorkflowType, NodeDataType, TriggerType } from "@repo/types";

export const nodeToSaveApiFormat = (userId: string, workflowId: string, nodeArray: NodeDataType[]) => {
  const triggerNode = nodeArray.find(node => node.type === "trigger")
  const actionNodes = nodeArray.filter(node => node.type === "action")

  const trigger: TriggerType = {
    id: triggerNode?.id || "",
    workflowId: triggerNode?.workflowId || "",
    appType: triggerNode?.appType || "",
    connectionId: triggerNode?.connectionId || "",
    type: triggerNode?.type || "",
    eventType: triggerNode?.eventType || "",
    payload: triggerNode?.payload || {},
    stepNo: triggerNode?.stepNo || 0,
  }

  const actions: ActionType[] = actionNodes.map((item) => ({
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
    name: "",
    status: false,
    totalActionSteps: actions.length,
    Trigger: trigger,
    actions: actions
  }
  return workflow
}