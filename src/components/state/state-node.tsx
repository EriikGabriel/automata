import { cn } from "@lib/utils"
import { useAutomaton } from "@store/automaton"
import { useNodeEditing } from "@store/node-editing"
import { useToolbar } from "@store/toolbar"
import { Handle, type Node, type NodeProps, Position } from "@xyflow/react"
import { useCallback, useEffect, useRef } from "react"

type StateNodeData = {
  label: string
  variant?: "initial" | "final" | "default" | "initial-final"
}

export type StateNodeType = Node<StateNodeData, "state">

const positions = [
  { position: Position.Top, id: "top" },
  { position: Position.Right, id: "right" },
  { position: Position.Bottom, id: "bottom" },
  { position: Position.Left, id: "left" },
]

export function StateNode({ id, data, selected }: NodeProps<StateNodeType>) {
  const { label, variant } = data
  const transitionSource = useToolbar((s) => s.transitionSource)
  const isTransitionSource = transitionSource === id

  const editingNodeId = useNodeEditing((s) => s.editingNodeId)
  const stopEditing = useNodeEditing((s) => s.stopEditing)
  const updateNodeData = useAutomaton((s) => s.updateNodeData)

  const isEditing = editingNodeId === id
  const inputRef = useRef<HTMLInputElement>(null)

  const isInitial = variant === "initial" || variant === "initial-final"
  const isFinal = variant === "final" || variant === "initial-final"

  useEffect(() => {
    if (isEditing) {
      requestAnimationFrame(() => {
        if (inputRef.current) {
          inputRef.current.focus()
          inputRef.current.select()
        }
      })
    }
  }, [isEditing])

  const saveLabel = useCallback(
    (value: string) => {
      const trimmed = value.trim()
      if (trimmed) {
        updateNodeData(id, { label: trimmed })
      }
      stopEditing()
    },
    [id, updateNodeData, stopEditing],
  )

  const handleDoubleClick = useCallback(() => {
    useNodeEditing.getState().startEditing(id)
  }, [id])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      e.stopPropagation()
      if (e.key === "Enter") {
        saveLabel(e.currentTarget.value)
      } else if (e.key === "Escape") {
        stopEditing()
      }
    },
    [saveLabel, stopEditing],
  )

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      saveLabel(e.currentTarget.value)
    },
    [saveLabel],
  )

  return (
    <div className="group/state flex items-center justify-center">
      {isInitial && (
        <svg
          width="28"
          height="16"
          viewBox="0 0 28 16"
          fill="none"
          className="mr-0.5"
          role="img"
          aria-labelledby="initial-arrow-title"
        >
          <title id="initial-arrow-title">Initial state arrow</title>
          <path
            d="M2 8 H20"
            strokeWidth="2"
            strokeLinecap="round"
            className={cn(
              "transition-colors duration-150 group-hover/state:stroke-amethyst-400",
              selected ? "stroke-amethyst-500" : "stroke-slate-400",
            )}
          />
          <path
            d="M17 3.5 L22.5 8 L17 12.5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            className={cn(
              "transition-colors duration-150 group-hover/state:stroke-amethyst-400",
              selected ? "stroke-amethyst-500" : "stroke-slate-400",
            )}
          />
        </svg>
      )}

      <div
        className={cn(
          "relative",
          isFinal &&
            "flex justify-center items-center border-3 rounded-full p-0.75 transition-colors duration-150 group-hover/state:border-amethyst-400",
          isFinal &&
            (selected || isTransitionSource
              ? "border-amethyst-500"
              : "border-slate-300"),
        )}
      >
        {isTransitionSource && (
          <div className="absolute -inset-1.5 rounded-full border-2 border-amethyst-400 animate-pulse pointer-events-none" />
        )}

        <button
          type="button"
          className={cn(
            "bg-white border-2 size-10 rounded-full p-3 flex items-center justify-center text-xs font-bold transition-colors duration-150 group-hover/state:border-amethyst-400",
            selected || isTransitionSource
              ? "bg-amethyst-500 border-amethyst-300 text-white group-hover/state:bg-amethyst-400 group-hover/state:border-amethyst-400"
              : "bg-white border-slate-300",
            isFinal ? "size-9" : "",
          )}
          onDoubleClick={handleDoubleClick}
        >
          {isEditing ? (
            <input
              ref={inputRef}
              defaultValue={label}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              maxLength={4}
              max={4}
              className={cn(
                "w-8 bg-transparent text-center text-xs font-bold outline-none",
                selected || isTransitionSource
                  ? "text-white placeholder:text-white/50"
                  : "text-slate-700 placeholder:text-slate-300",
              )}
            />
          ) : (
            label
          )}
        </button>

        {positions.map(({ position, id }) => (
          <Handle
            key={id}
            id={id}
            type="source"
            position={position}
            className="size-2! rounded-full! bg-slate-300! border-none! opacity-0 hover:opacity-100 transition-opacity duration-200"
          />
        ))}
      </div>
    </div>
  )
}
