import { create } from "zustand";

type SidebarType = {
  isSidebarOpen: boolean,
  toggleSidebar: () => void,
}

export const useSidebarStore = create<SidebarType>((set) => ({
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({
    isSidebarOpen: !state.isSidebarOpen
  }))
}))