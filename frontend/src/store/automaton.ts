import type { Edge } from "@xyflow/react"
import { create } from "zustand"
import type { StateNodeType } from "@/components/state/state-node"

export type TransitionTable = {
  states: string[]
  alphabet: string[]
  initial: string | null
  finals: string[]
  table: Record<string, Record<string, string[]>>
}

type AutomatonState = {
  nodes: StateNodeType[]
  edges: Edge[]

  addNode: (node: StateNodeType) => void
  removeNode: (nodeId: string) => void
  updateNodeData: (nodeId: string, data: Partial<StateNodeType["data"]>) => void
  setNodes: (
    updater: StateNodeType[] | ((nodes: StateNodeType[]) => StateNodeType[]),
  ) => void

  addEdge: (edge: Edge) => void
  removeEdge: (edgeId: string) => void
  updateEdgeLabel: (edgeId: string, label: string | undefined) => void
  setEdges: (updater: Edge[] | ((edges: Edge[]) => Edge[])) => void

  hasEdge: (source: string, target: string) => boolean
  getNextStateLabel: () => string
  getTransitionTable: () => TransitionTable
  reset: () => void
}

export const useAutomaton = create<AutomatonState>((set, get) => ({
  nodes: [],
  edges: [],

  addNode: (node) =>
    set((state) => ({
      nodes: [...state.nodes, node],
    })),

  removeNode: (nodeId) =>
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== nodeId),
      edges: state.edges.filter(
        (e) => e.source !== nodeId && e.target !== nodeId,
      ),
    })),

  updateNodeData: (nodeId, data) =>
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n,
      ),
    })),

  setNodes: (updater) =>
    set((state) => ({
      nodes: typeof updater === "function" ? updater(state.nodes) : updater,
    })),

  addEdge: (edge) =>
    set((state) => ({
      edges: [...state.edges, edge],
    })),

  removeEdge: (edgeId) =>
    set((state) => ({
      edges: state.edges.filter((e) => e.id !== edgeId),
    })),

  updateEdgeLabel: (edgeId, label) =>
    set((state) => ({
      edges: state.edges.map((e) => (e.id === edgeId ? { ...e, label } : e)),
    })),

  setEdges: (updater) =>
    set((state) => ({
      edges: typeof updater === "function" ? updater(state.edges) : updater,
    })),

  hasEdge: (source, target) =>
    get().edges.some((e) => e.source === source && e.target === target),

  getNextStateLabel: () => {
    const { nodes } = get()
    const existingNumbers = nodes
      .map((n) => {
        const match = n.data.label?.match(/^q(\d+)$/)
        return match ? Number(match[1]) : -1
      })
      .filter((n) => n >= 0)

    const nextNumber =
      existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 0

    return `q${nextNumber}`
  },

  getTransitionTable: () => {
    const { nodes, edges } = get()

    const nodeIdToLabel = new Map<string, string>()
    for (const node of nodes) {
      nodeIdToLabel.set(node.id, node.data.label)
    }

    const states = nodes
      .map((n) => n.data.label)
      .sort((a, b) => {
        const numA = a.match(/^q(\d+)$/)?.[1]
        const numB = b.match(/^q(\d+)$/)?.[1]

        if (numA != null && numB != null) return Number(numA) - Number(numB)
        return a.localeCompare(b)
      })

    const alphabetSet = new Set<string>()
    for (const edge of edges) {
      const label = typeof edge.label === "string" ? edge.label.trim() : ""
      if (label) {
        for (const symbol of label.split(",")) {
          const trimmed = symbol.trim()
          if (trimmed) alphabetSet.add(trimmed)
        }
      }
    }
    const alphabet = [...alphabetSet].sort()

    const initial =
      nodes.find(
        (n) =>
          n.data.variant === "initial" || n.data.variant === "initial-final",
      )?.data.label ?? null

    const finals = nodes
      .filter(
        (n) => n.data.variant === "final" || n.data.variant === "initial-final",
      )
      .map((n) => n.data.label)
      .sort()

    const table: Record<string, Record<string, string[]>> = {}

    for (const state of states) {
      table[state] = {}
      for (const symbol of alphabet) {
        table[state][symbol] = []
      }
    }

    for (const edge of edges) {
      const sourceLabel = nodeIdToLabel.get(edge.source)
      const targetLabel = nodeIdToLabel.get(edge.target)

      if (!sourceLabel || !targetLabel) continue

      const label = typeof edge.label === "string" ? edge.label.trim() : ""

      if (!label) continue

      const symbols = label
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)

      for (const symbol of symbols) {
        if (
          table[sourceLabel]?.[symbol] &&
          !table[sourceLabel][symbol].includes(targetLabel)
        ) {
          table[sourceLabel][symbol].push(targetLabel)
          table[sourceLabel][symbol].sort()
        }
      }
    }

    return { states, alphabet, initial, finals, table }
  },

  reset: () => set({ nodes: [], edges: [] }),
}))
