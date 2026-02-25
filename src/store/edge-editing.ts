import { create } from "zustand"

type EdgeEditingState = {
  editingEdgeId: string | null
  startEditing: (edgeId: string) => void
  stopEditing: () => void
}

export const useEdgeEditing = create<EdgeEditingState>((set) => ({
  editingEdgeId: null,
  startEditing: (edgeId) => set({ editingEdgeId: edgeId }),
  stopEditing: () => set({ editingEdgeId: null }),
}))
