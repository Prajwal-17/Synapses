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

  //nodeData stores the all the nodes data received from api 
  nodeData: [initialNode],

  //stores the original node data fetched from the api, used to track changes 
  orignalNodeData: [initialNode],

  //adding a new node
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
      stepNo: state.nodeData.length + 1,
    }
    return {
      nodeData: [...state.nodeData, newNode]
    }
  }),

  //sets the node data from the api response and stores to nodedata & originalData  
  setNodesFromApi: (nodeArray: NodeDataType[]) => set((state) => {
    return {
      nodeData: nodeArray,
      orignalNodeData: nodeArray
    }
  }),

  //update a specific node data
  updateNodeData: (stepNo: number, updatedData) => set((state) => ({
    nodeData: state.nodeData.map((node: NodeDataType) =>
      node.stepNo === stepNo ? { ...node, ...updatedData } : node,
    )
  })),

  //get changes made to the node data by converting & comparing with originalNodeData
  getChanges: () => {
    const { nodeData, orignalNodeData } = get();

    return nodeData.filter((node: any, index: any) => (
      JSON.stringify(node) !== JSON.stringify(orignalNodeData[index])
    ))
  },

  saveChanges: () => set((state) => ({
    // orignalNodeData: state.nodeData
  }))

}))