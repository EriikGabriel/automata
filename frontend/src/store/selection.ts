import { create } from "zustand"
import { useAutomaton } from "./automaton"

export type SelectedNodeTransition = {
  edgeId: string
  label: string
  targetId: string
  targetLabel: string
}

export type SelectedNodeIncomingTransition = {
  edgeId: string
  label: string
  sourceId: string
  sourceLabel: string
}

export type SelectedNodeInfo = {
  id: string
  label: string
  variant: "initial" | "final" | "default" | "initial-final"
  outgoing: SelectedNodeTransition[]
  incoming: SelectedNodeIncomingTransition[]
}

type SelectionState = {
  selectedNodeIds: string[]
  setSelectedNodeIds: (nodeIds: string[]) => void
  addSelectedNodeId: (nodeId: string) => void
  removeSelectedNodeId: (nodeId: string) => void
  clearSelection: () => void
}

export const useSelection = create<SelectionState>((set) => ({
  selectedNodeIds: [],

  setSelectedNodeIds: (nodeIds) => set({ selectedNodeIds: nodeIds }),

  addSelectedNodeId: (nodeId) =>
    set((state) => ({
      selectedNodeIds: state.selectedNodeIds.includes(nodeId)
        ? state.selectedNodeIds
        : [...state.selectedNodeIds, nodeId],
    })),

  removeSelectedNodeId: (nodeId) =>
    set((state) => ({
      selectedNodeIds: state.selectedNodeIds.filter((id) => id !== nodeId),
    })),

  clearSelection: () => set({ selectedNodeIds: [] }),
}))

function buildNodeInfo(
  nodeId: string,
  nodes: ReturnType<typeof useAutomaton.getState>["nodes"],
  edges: ReturnType<typeof useAutomaton.getState>["edges"],
  nodeIdToLabel: Map<string, string>,
): SelectedNodeInfo | null {
  const node = nodes.find((n) => n.id === nodeId)
  if (!node) return null

  const outgoing: SelectedNodeTransition[] = edges
    .filter((e) => e.source === nodeId)
    .map((e) => ({
      edgeId: e.id,
      label: typeof e.label === "string" ? e.label : "ε",
      targetId: e.target,
      targetLabel: nodeIdToLabel.get(e.target) ?? e.target,
    }))

  const incoming: SelectedNodeIncomingTransition[] = edges
    .filter((e) => e.target === nodeId)
    .map((e) => ({
      edgeId: e.id,
      label: typeof e.label === "string" ? e.label : "ε",
      sourceId: e.source,
      sourceLabel: nodeIdToLabel.get(e.source) ?? e.source,
    }))

  return {
    id: node.id,
    label: node.data.label,
    variant: node.data.variant ?? "default",
    outgoing,
    incoming,
  }
}

/**
 * Reactive hook that returns info for all selected nodes.
 * Re-computes whenever the selection, nodes, or edges change.
 */
export function useSelectedNodesInfo(): SelectedNodeInfo[] {
  const selectedNodeIds = useSelection((s) => s.selectedNodeIds)
  const nodes = useAutomaton((s) => s.nodes)
  const edges = useAutomaton((s) => s.edges)

  if (selectedNodeIds.length === 0) return []

  const nodeIdToLabel = new Map<string, string>()
  for (const n of nodes) {
    nodeIdToLabel.set(n.id, n.data.label)
  }

  const result: SelectedNodeInfo[] = []
  for (const nodeId of selectedNodeIds) {
    const info = buildNodeInfo(nodeId, nodes, edges, nodeIdToLabel)
    if (info) result.push(info)
  }

  return result
}
