import { cn } from "@lib/utils"
import {
  type TransitionTable as TransitionTableType,
  useAutomaton,
} from "@store/automaton"
import type { Edge } from "@xyflow/react"
import { useMemo } from "react"
import type { StateNodeType } from "./state/state-node"

function buildTransitionTable(
  nodes: StateNodeType[],
  edges: Edge[],
): TransitionTableType {
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
      (n) => n.data.variant === "initial" || n.data.variant === "initial-final",
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
}

export function TransitionTable() {
  const nodes = useAutomaton((s) => s.nodes)
  const edges = useAutomaton((s) => s.edges)

  const { states, alphabet, initial, finals, table } = useMemo(
    () => buildTransitionTable(nodes, edges),
    [nodes, edges],
  )

  const isEmpty = states.length === 0

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-6 text-sm text-slate-400">
        <p className="font-medium">No states yet</p>
        <p className="text-xs">
          Add states and transitions to see the table here.
        </p>
      </div>
    )
  }

  const hasAlphabet = alphabet.length > 0

  return (
    <div className="overflow-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-slate-50">
            <th className="border-b border-r border-slate-200 px-4 py-2.5 text-left font-bold text-slate-500 text-xs uppercase tracking-wider">
              State
            </th>
            {hasAlphabet ? (
              alphabet.map((symbol) => (
                <th
                  key={symbol}
                  className="border-b border-r border-slate-200 px-4 py-2.5 text-center font-bold text-slate-500 text-xs tracking-wider last:border-r-0"
                >
                  {symbol}
                </th>
              ))
            ) : (
              <th className="border-b border-slate-200 px-4 py-2.5 text-center font-medium text-slate-400 text-xs italic">
                No transitions defined
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {states.map((state, rowIndex) => {
            const isInitial = state === initial
            const isFinal = finals.includes(state)
            const isLast = rowIndex === states.length - 1

            return (
              <tr
                key={state}
                className={cn(
                  "transition-colors hover:bg-amethyst-50/50",
                  !isLast && "border-b border-slate-200",
                )}
              >
                <td
                  className={cn(
                    "border-r border-slate-200 px-4 py-2.5 font-semibold whitespace-nowrap",
                    !isLast && "border-b",
                  )}
                >
                  <div className="flex items-center gap-1">
                    <div className="flex items-center ">
                      {isInitial && (
                        <span
                          className="text-amethyst-500"
                          title="Initial state"
                        >
                          ➜
                        </span>
                      )}
                      {isFinal && (
                        <span className="text-amethyst-500" title="Final state">
                          *
                        </span>
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-slate-700",
                        (isInitial || isFinal) && "text-amethyst-600",
                      )}
                    >
                      {state}
                    </span>
                  </div>
                </td>
                {hasAlphabet ? (
                  alphabet.map((symbol) => {
                    const targets = table[state]?.[symbol] ?? []

                    return (
                      <td
                        key={symbol}
                        className={cn(
                          "border-r border-slate-200 px-4 py-2.5 text-center last:border-r-0",
                          !isLast && "border-b",
                        )}
                      >
                        {targets.length > 0 ? (
                          <span className="font-medium text-slate-700">
                            {targets.length === 1
                              ? targets[0]
                              : `{${targets.join(", ")}}`}
                          </span>
                        ) : (
                          <span className="text-slate-300">∅</span>
                        )}
                      </td>
                    )
                  })
                ) : (
                  <td
                    className={cn(
                      "px-4 py-2.5 text-center text-slate-300",
                      !isLast && "border-b border-slate-200",
                    )}
                  >
                    —
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
