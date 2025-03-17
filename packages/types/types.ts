import { JsonValue } from "@prisma/client/runtime/library"

export type ApiWorkflowType = {
  id: string,
  userId: string,
  totalActionSteps: number,
  Trigger: TriggerType,
  actions: ActionType[],
  lastCheckedAt?: Date,
}

export type TriggerType = {
  id: string,
  workflowId: string,
  appType: string,
  connectionId: string,
  type: string,
  eventType: string,
  payload: Record<string, any>,
  stepNo: number,
}

export type ActionType = {
  id: string,
  workflowId: string,
  appType: string,
  connectionId: string,
  type: string,
  eventType: string,
  payload: Record<string, any>,
  stepNo: number,
}

export enum NodeType {
  trigger = "trigger",
  action = "action"
}

export type WorkflowStateType = {
  nodeData: NodeDataType[],
  nodeIds: string[],
  orignalNodeData: Record<string, any>,

  addNode: () => void,
  setNodesFromApi: (nodeArray: NodeDataType[]) => void,
  updateNodeData: (stepNo: number, updatedData: Record<string, any>) => void
  getChanges: () => void,
  saveChanges: () => void,
}

export type NodeDataType = {
  id: string,
  workflowId: string,
  appType: string,
  connectionId: string,
  type: string,
  eventType: string,
  payload: Record<string, any>,
  stepNo: number,
}

export type TaskType = {
  id: string,
  userId: string,
  workflowId: string,
  stepNo: number,
  appType: string,
  connectionId: string,
  eventType: string,
  payload: EmailPayloadType
  status: string
}

export type EmailPayloadType = {
  to: string,
  from: string,
  subject: string,
  body: string,
}