import { create } from "zustand"
import { v4 as uuidv4 } from 'uuid';

enum NodeType {
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
  setNodeData: () => void,
  updateNodeData: (nodeId: string, updatedData: Partial<NodeData>) => void,
}
export const usePanelDetails = create<PanelDetails>((set) => ({
  nodeData: initialData,
  setNodeData: () => set((state) => ({
    nodeData: [...state.nodeData, {
      stepNo: state.nodeData.length + 1,
      nodeId: uuidv4(),
      app: "",
      account: "",
      type: NodeType.action,
      event: "",
      config: {},
    }]
  })),
  updateNodeData: (nodeId, updatedData) => set((state) => ({
    nodeData: state.nodeData.map((item) =>
      item.nodeId === nodeId ? { ...item, ...updatedData } : item,
    )
  })),
}))