import { create } from "zustand"

type SelectNodeStoreType = {
  selectedNode: number,
  setSelectedNode: (id: string | number) => void,
  showPanel: boolean,
  setShowPanel: (value: string) => void,
  panelStep: string,
  setPanelStep: (step: string) => void,
}

export const useSelectNodeStore = create<SelectNodeStoreType>((set) => ({
  selectedNode: 1,
  setSelectedNode: (id) => set(() => ({
    selectedNode: Number(id),
  })),
  showPanel: false,
  setShowPanel: (value) => set(() => ({
    showPanel: value === "close" ? false : true,
  })),
  panelStep: "setup",
  setPanelStep: (step) => set(() => ({
    panelStep: step,
  }))
}))