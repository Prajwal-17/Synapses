import { create } from "zustand"
import { useSelectNodeStore } from "./selectNodeStore"

// type PanelType = {
//   panel: boolean,
//   setPanel: () => void,
// }

// export const usePanelStore = create<PanelType>((set) => ({
//   panel: false,
//   setPanel: () => set((state) => ({
//     panel: !state.panel,
//   }))
// }))

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

type PanelDetails = {
  nodeData: NodeData[],
  setNodeData: (data: any) => void,
}

const initialData: NodeData[] = [{
  stepNo: 1,
  nodeId: "sakldfjasldfk",
  app: "gmail",
  account: "askdfjasldkf",
  type: NodeType.trigger,
  event: "create",
  config: {
    to: "me itself",
    cc: "rahul",
  }
},
  // {
  //   stepNo: 2,
  //   nodeId: "sakldfjasldfk",
  //   app: "github",
  //   account: "askdfjasldkf",
  //   type: NodeType.trigger,
  //   event: "create",
  //   config: {}
  // }
]

// const selectedNode = useSelectNodeStore((state) => state.selectedNode)
// const setSelectedNode = useSelectNodeStore((state) => state.setSelectedNode)

export const usePanelDetails = create<PanelDetails>((set) => ({
  nodeData: initialData,
  setNodeData: (data) => set((state) => ({
    nodeData: [...state.nodeData, {
      stepNo: state.nodeData.length + 1,
      nodeId: "sldkfjsd",
      app: "notion",
      account: "",
      type: NodeType.action,
      event: "create",
      config: {},
    }]
  }))
}))