import { create } from "zustand"
import { v4 as uuidv4 } from 'uuid';

export enum NodeType {
  trigger = "trigger",
  action = "action"
}

export type NodeData = {
  stepNo: number,
  nodeId: string,
  app: string,
  account: string,
  type: NodeType,
  event: string,
  config: Record<string, any>,
}

export const initialData: NodeData[] = [{
  stepNo: 1,
  nodeId: uuidv4(),
  app: "",
  account: "",
  type: NodeType.trigger,
  event: "",
  config: {}
}]

type PanelDetails = {
  nodeData: NodeData[],
  originalData: NodeData[],
  setNodeData: () => void,
  updateNodeData: (nodeId: string, updatedData: Partial<NodeData>) => void,
  initialWorkflowUpdate: (data: NodeData[]) => void,
  getChanges: () => void,
  saveChanges: () => void,
}
export const usePanelDetails = create<PanelDetails>((set, get) => ({
  nodeData: initialData,
  originalData: initialData,

  setNodeData: () => set((state) => {
    const newNode = {
      stepNo: state.nodeData.length + 1,
      nodeId: uuidv4(),
      app: "",
      account: "",
      type: NodeType.action,
      event: "",
      config: {},
    };

    return {
      nodeData: [...state.nodeData, newNode],
      originalData: [...state.originalData, newNode]
    }
  }),

  updateNodeData: (nodeId, updatedData) => set((state) => ({
    nodeData: state.nodeData.map((item) =>
      item.nodeId === nodeId ? { ...item, ...updatedData } : item,
    )
  })),

  initialWorkflowUpdate: (data) => set((state) => {

    // state.nodeData.splice(0);

    console.log("zustand nodedata", state.nodeData)
    console.log("zustand data", data)
    // const value = data.

    return {
      nodeData: [...data],
      originalData: [...data]
    }
  }),

  // nodeData: [...state.nodeData, data],
  // originalData: [...state.nodeData, data]
  getChanges: () => {
    const { nodeData, originalData } = get();

    return nodeData.filter((step, index) => (
      JSON.stringify(step) !== JSON.stringify(originalData[index])
    ))
  },

  saveChanges: () => set((state) => ({
    originalData: state.nodeData
  }))

}))