import { GmailConnectionType } from "@repo/types"
import { create } from "zustand"

type ConnectionStoreType = {
  connections: GmailConnectionType[],
  setConnections: (connectionArray: GmailConnectionType[]) => void
}

export const useConnectionStore = create<ConnectionStoreType>((set) => ({
  connections: [],
  setConnections: (connectionArray) => set(() => ({
    connections: [...connectionArray]
  }))
}))