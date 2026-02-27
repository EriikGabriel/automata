import {
  Cancel01Icon,
  CheckmarkBadge01Icon,
  Login01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useAutomaton } from "@store/automaton"
import { useSelectedNodesInfo } from "@store/selection"
import { Badge } from "@ui/badge"
import { Checkbox } from "@ui/checkbox"
import { Field, FieldLabel } from "@ui/field"
import { Input } from "@ui/input"
import { Separator } from "@ui/separator"
import { useCallback, useMemo, useState } from "react"

type TransitionRow = {
  edgeId: string
  symbol: string
  targetId: string
  targetLabel: string
  allSymbols: string[]
}

function TransitionItem({
  row,
  onUpdateSymbol,
  onRemove,
}: {
  row: TransitionRow
  onUpdateSymbol: (
    edgeId: string,
    oldSymbol: string,
    newSymbol: string,
    allSymbols: string[],
  ) => void
  onRemove: (edgeId: string, symbol: string, allSymbols: string[]) => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(row.symbol)

  const handleSave = useCallback(() => {
    const trimmed = editValue.trim()
    if (trimmed && trimmed !== row.symbol) {
      onUpdateSymbol(row.edgeId, row.symbol, trimmed, row.allSymbols)
    }
    setIsEditing(false)
  }, [editValue, row, onUpdateSymbol])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      e.stopPropagation()
      if (e.key === "Enter") {
        handleSave()
      } else if (e.key === "Escape") {
        setEditValue(row.symbol)
        setIsEditing(false)
      }
    },
    [handleSave, row.symbol],
  )

  return (
    <div className="flex items-center justify-between h-8 px-3 bg-slate-50 border border-slate-200 rounded-lg group">
      <div className="flex items-center gap-2 text-xs min-w-0">
        {isEditing ? (
          <input
            ref={(el) => el?.focus()}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            maxLength={6}
            className="w-10 bg-white border border-amethyst-300 rounded px-1 py-0.5 text-xs font-semibold text-amethyst-500 font-mono text-center outline-none focus:ring-1 focus:ring-amethyst-300"
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              setEditValue(row.symbol)
              setIsEditing(true)
            }}
            className="font-semibold text-amethyst-500 font-mono hover:bg-amethyst-50 px-1 py-0.5 rounded cursor-text transition-colors"
            title="Click to edit symbol"
          >
            {row.symbol}
          </button>
        )}
        <span className="text-slate-400">➜</span>
        <span className="font-semibold text-slate-700 font-mono truncate">
          {row.targetLabel}
        </span>
      </div>
      <button
        type="button"
        onClick={() => onRemove(row.edgeId, row.symbol, row.allSymbols)}
        className="text-slate-400 hover:text-slate-600 transition-colors opacity-0 group-hover:opacity-100"
      >
        <HugeiconsIcon
          icon={Cancel01Icon}
          className="size-3.5"
          strokeWidth={2}
        />
      </button>
    </div>
  )
}

function getVariant(isInitial: boolean, isFinal: boolean) {
  if (isInitial && isFinal) return "initial-final" as const
  if (isInitial) return "initial" as const
  if (isFinal) return "final" as const
  return "default" as const
}

export function StateOptions() {
  const selectedStates = useSelectedNodesInfo()
  const selectedState = selectedStates[0]
  const removeEdge = useAutomaton((s) => s.removeEdge)
  const updateEdgeLabel = useAutomaton((s) => s.updateEdgeLabel)
  const updateNodeData = useAutomaton((s) => s.updateNodeData)
  const edges = useAutomaton((s) => s.edges)
  const nodes = useAutomaton((s) => s.nodes)

  const isInitial =
    selectedState?.variant === "initial" ||
    selectedState?.variant === "initial-final"
  const isFinal =
    selectedState?.variant === "final" ||
    selectedState?.variant === "initial-final"

  const handleToggleInitial = useCallback(
    (checked: boolean) => {
      if (!selectedState) return

      if (checked) {
        for (const node of nodes) {
          if (node.id === selectedState.id) continue
          if (
            node.data.variant === "initial" ||
            node.data.variant === "initial-final"
          ) {
            const wasFinal = node.data.variant === "initial-final"
            updateNodeData(node.id, {
              variant: wasFinal ? "final" : "default",
            })
          }
        }
      }

      updateNodeData(selectedState.id, {
        variant: getVariant(checked, isFinal),
      })
    },
    [selectedState, isFinal, nodes, updateNodeData],
  )

  const handleToggleFinal = useCallback(
    (checked: boolean) => {
      if (!selectedState) return
      updateNodeData(selectedState.id, {
        variant: getVariant(isInitial, checked),
      })
    },
    [selectedState, isInitial, updateNodeData],
  )

  const transitions = useMemo<TransitionRow[]>(() => {
    if (!selectedState) return []

    const nodeIdToLabel = new Map<string, string>()
    for (const n of nodes) {
      nodeIdToLabel.set(n.id, n.data.label)
    }

    const rows: TransitionRow[] = []

    for (const edge of edges) {
      if (edge.source !== selectedState.id) continue

      const targetLabel = nodeIdToLabel.get(edge.target) ?? edge.target
      const label = typeof edge.label === "string" ? edge.label.trim() : ""

      const symbols = label
        ? label
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : ["ε"]

      for (const symbol of symbols) {
        rows.push({
          edgeId: edge.id,
          symbol,
          targetId: edge.target,
          targetLabel,
          allSymbols: symbols,
        })
      }
    }

    return rows
  }, [selectedState, edges, nodes])

  const handleUpdateSymbol = useCallback(
    (
      edgeId: string,
      oldSymbol: string,
      newSymbol: string,
      allSymbols: string[],
    ) => {
      const updated = allSymbols.map((s) => (s === oldSymbol ? newSymbol : s))
      const newLabel = updated.join(", ")
      updateEdgeLabel(edgeId, newLabel)
    },
    [updateEdgeLabel],
  )

  const handleRemoveSymbol = useCallback(
    (edgeId: string, symbol: string, allSymbols: string[]) => {
      if (allSymbols.length <= 1) {
        removeEdge(edgeId)
      } else {
        const remaining = allSymbols.filter((s) => s !== symbol)
        updateEdgeLabel(edgeId, remaining.join(", "))
      }
    },
    [removeEdge, updateEdgeLabel],
  )

  if (!selectedState) return null

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <h2 className="text-slate-900 font-bold">State Properties</h2>
        <Badge className="bg-amethyst-100 text-amethyst-500 border p-2 rounded">
          Active
        </Badge>
      </div>

      <Field>
        <FieldLabel
          htmlFor="state-label"
          className="uppercase text-slate-500 text-xs font-bold"
        >
          Label
        </FieldLabel>
        <Input
          id="state-label"
          className="h-11 text-xs w-full text-slate-900 bg-slate-50 border rounded-lg border-slate-200 resize-none focus-visible:ring-0 font-semibold placeholder:font-normal"
          placeholder="q0"
          defaultValue={selectedState.label}
          key={selectedState.id}
          max={4}
          maxLength={4}
          required
          onBlur={(e) => {
            const trimmed = e.currentTarget.value.trim()
            if (trimmed && trimmed !== selectedState.label) {
              updateNodeData(selectedState.id, { label: trimmed })
            }
          }}
          onKeyDown={(e) => {
            e.stopPropagation()
            if (e.key === "Enter") {
              e.currentTarget.blur()
            }
          }}
        />
      </Field>

      <Field className="flex items-center gap-2 h-11 text-xs w-full text-slate-900 bg-slate-50 border rounded-lg border-slate-200 ">
        <div className="flex items-center justify-between h-full p-3 gap-2">
          <div className="flex gap-2">
            <HugeiconsIcon
              icon={Login01Icon}
              className="text-amethyst-500"
              strokeWidth={2}
            />
            <FieldLabel
              htmlFor="initial-state"
              className="text-slate-500 font-bold"
            >
              Initial State
            </FieldLabel>
          </div>
          <Checkbox
            className="bg-white"
            id="initial-state"
            checked={isInitial}
            onCheckedChange={handleToggleInitial}
          />
        </div>
      </Field>

      <Field className="flex items-center gap-2 h-11 text-xs w-full text-slate-900 bg-slate-50 border rounded-lg border-slate-200 ">
        <div className="flex items-center justify-between h-full p-3 gap-2">
          <div className="flex gap-2">
            <HugeiconsIcon
              icon={CheckmarkBadge01Icon}
              className="text-amethyst-500"
              strokeWidth={2}
            />
            <FieldLabel
              htmlFor="accept-state"
              className="text-slate-500 font-bold"
            >
              Acceptance State
            </FieldLabel>
          </div>
          <Checkbox
            className="bg-white"
            id="accept-state"
            checked={isFinal}
            onCheckedChange={handleToggleFinal}
          />
        </div>
      </Field>

      <Separator className="my-2" />

      <div className="flex flex-col gap-3">
        <span className="uppercase text-slate-500 text-xs font-bold">
          Transitions
        </span>

        <div className="flex flex-col gap-2">
          {transitions.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-2">
              No transitions yet
            </p>
          ) : (
            transitions.map((t, index) => (
              <TransitionItem
                key={`${t.edgeId}-${t.symbol}-${index}`}
                row={t}
                onUpdateSymbol={handleUpdateSymbol}
                onRemove={handleRemoveSymbol}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
