import { DateTime } from "@auth/core/providers/kakao"

export type ApiWorkflowType = {
  id: string,
  userId: string,
  totalActionSteps: number,
  name: string,
  status: boolean,
  Trigger: TriggerType,
  actions: ActionType[],
  lastCheckedAt?: Date,
  updatedAt?: Date,
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
  orignalNodeData: NodeDataType[],
  name: string,
  setName: (value: string) => void,
  status: boolean,
  setStatus: (value: boolean) => void,
  addNode: () => void,
  setNodesFromApi: (nodeArray: NodeDataType[]) => void,
  updateNodeData: (stepNo: number, updatedData: Record<string, any>) => void
  getChanges: () => NodeDataType[],
  saveState: boolean,
  setSaveState: () => void,
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

export type ConnectionType = {
  id: string,
  userId: string,
  appType: string,
  accessToken: string,
  refreshToken: string,
  metaData: Record<string, any>,
  expiresAt: DateTime,
}
export type UpdateOutboxAndLogsType = {
  task: TaskType,
  status: string,
  message: string
}