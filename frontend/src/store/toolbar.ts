import { create } from "zustand"

export type Tool = "select" | "state" | "state-final" | "transition" | "delete"

type ToolbarState = {
  activeTool: Tool
  setActiveTool: (tool: Tool) => void
  transitionSource: string | null
  setTransitionSource: (nodeId: string | null) => void
  clearTransitionSource: () => void
}

export const useToolbar = create<ToolbarState>((set) => ({
  activeTool: "select",
  setActiveTool: (tool) => set({ activeTool: tool, transitionSource: null }),
  transitionSource: null,
  setTransitionSource: (nodeId) => set({ transitionSource: nodeId }),
  clearTransitionSource: () => set({ transitionSource: null }),
}))
