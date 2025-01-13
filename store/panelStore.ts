import { create } from "zustand"

type PanelType = {
  panel: boolean,
  setPanel: () => void,
}

export const usePanelStore = create<PanelType>((set) => ({
  panel: false,
  setPanel: () => set((state) => ({
    panel: !state.panel,
  }))
}))