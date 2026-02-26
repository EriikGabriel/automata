import { create } from "zustand"

type NodeEditingState = {
  editingNodeId: string | null
  startEditing: (nodeId: string) => void
  stopEditing: () => void
}

export const useNodeEditing = create<NodeEditingState>((set) => ({
  editingNodeId: null,
  startEditing: (nodeId) => set({ editingNodeId: nodeId }),
  stopEditing: () => set({ editingNodeId: null }),
}))
