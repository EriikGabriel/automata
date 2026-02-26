import { useAutomaton } from "@store/automaton"
import { useEdgeEditing } from "@store/edge-editing"
import {
  BaseEdge,
  EdgeLabelRenderer,
  type EdgeProps,
  getSmoothStepPath,
} from "@xyflow/react"
import { useCallback, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export function StageTransition({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  label,
  selected,
}: EdgeProps) {
  const updateEdgeLabel = useAutomaton((s) => s.updateEdgeLabel)

  const editingEdgeId = useEdgeEditing((s) => s.editingEdgeId)
  const stopEditing = useEdgeEditing((s) => s.stopEditing)

  const isEditing = editingEdgeId === id
  const labelStr = typeof label === "string" ? label : ""
  const inputRef = useRef<HTMLInputElement>(null)
  const [hovered, setHovered] = useState(false)

  const markerId = `arrow-${id}`

  const strokeClass = cn(
    "transition-colors duration-150",
    hovered
      ? "stroke-amethyst-400"
      : selected
        ? "stroke-amethyst-500"
        : "stroke-slate-400",
  )

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  })

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
      updateEdgeLabel(id, trimmed || "ε")
      stopEditing()
    },
    [id, updateEdgeLabel, stopEditing],
  )

  const handleDoubleClick = useCallback(() => {
    useEdgeEditing.getState().startEditing(id)
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
    <g
      tabIndex={-1}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <defs>
        <marker
          id={markerId}
          markerWidth="10"
          markerHeight="10"
          viewBox="-5 -5 10 10"
          refX="0"
          refY="0"
          orient="auto-start-reverse"
          markerUnits="userSpaceOnUse"
        >
          <path
            d="M-3,-3 L0,0 L-3,3"
            fill="none"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={strokeClass}
          />
        </marker>
      </defs>
      <BaseEdge
        id={id}
        path={edgePath}
        className={cn("stroke-2!", strokeClass)}
        markerEnd={`url(#${markerId})`}
      />
      <EdgeLabelRenderer>
        <button
          type="button"
          className="nodrag nopan pointer-events-auto absolute"
          style={{
            transform: `translate(-50%, -100%) translate(${labelX}px, ${labelY - 2}px)`,
          }}
          onDoubleClick={handleDoubleClick}
        >
          {isEditing ? (
            <input
              ref={inputRef}
              key={id}
              defaultValue={labelStr}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              className="w-8 bg-transparent text-center text-tiny font-semibold text-slate-600 outline-none"
            />
          ) : (
            <span
              className={cn(
                "text-tiny! font-semibold hover:text-amethyst-400 transition-colors duration-150",
                selected ? "text-amethyst-500" : "text-slate-600",
              )}
            >
              {label}
            </span>
          )}
        </button>
      </EdgeLabelRenderer>
    </g>
  )
}
