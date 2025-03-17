import { create } from "zustand"
import { v4 as uuidv4 } from 'uuid';
import { NodeDataType, NodeType, TriggerType, WorkflowStateType } from "@repo/types";

const initialNode: TriggerType = {
  id: uuidv4(),
  workflowId: "",
  appType: "",
  connectionId: "",
  type: NodeType.trigger,
  eventType: "",
  payload: {},
  stepNo: 1,
}

export const useWorkflowStore = create<WorkflowStateType>((set, get) => ({
  nodeData: [initialNode],
  nodeIds: [],

  orignalNodeData: [],
  addNode: () => set((state) => {
    const newNodeId = uuidv4();
    const newNode = {
      id: newNodeId,
      workflowId: "",
      appType: "",
      connectionId: "",
      type: NodeType.action,
      eventType: "",
      payload: {},
      stepNo: state.nodeIds.length + 1,
    }
    return {
      nodeData: [...state.nodeData, newNode]
    }
  }),

  setNodesFromApi: (nodeArray: NodeDataType[]) => set((state) => {
    return {
      nodeData: nodeArray,
      orignalNodes: nodeArray
    }
  }),

  updateNodeData: (stepNo: number, updatedData) => set((state) => ({
    nodeData: state.nodeData.map((node: NodeDataType) =>
      node.stepNo === stepNo ? { ...node, ...updatedData } : node,
    )
  })),

  getChanges: () => {
    const { nodeData, orignalNodeData } = get();

    return nodeData.filter((step: any, index: any) => (
      JSON.stringify(step) !== JSON.stringify(orignalNodeData[index])
    ))
  },

  saveChanges: () => set((state) => ({
    // orignalNodeData: state.nodeData
  }))

}))