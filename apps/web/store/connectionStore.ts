import { ConnectionType } from "@repo/types"
import { create } from "zustand"

type ConnectionStoreType = {
  connections: ConnectionType[],
  setConnections: (connectionArray: ConnectionType[]) => void
}

export const useConnectionStore = create<ConnectionStoreType>((set) => ({
  connections: [],
  setConnections: (connectionArray) => set(() => ({
    connections: [...connectionArray]
  }))
}))