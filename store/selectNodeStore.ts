import { create } from "zustand"

type SelectNodeStoreType = {
  selectedNode: number,
  panel: boolean,
  setPanel: () => void,
  setSelectedNode: (id: string | number) => void,
}                               

export const useSelectNodeStore = create<SelectNodeStoreType>((set) => ({
  selectedNode: 1,
  panel: false,
  setPanel: () => set((state) =>({
    panel: !state.panel,
  })
    // {
    // if (Number(id) === state.selectedNode) {
    //   return { panel: true };
    // } else {
    //   return state;
    // }
    // }  
  ),
  setSelectedNode: (id) => set(() => ({
    selectedNode: Number(id),
  }))
}))