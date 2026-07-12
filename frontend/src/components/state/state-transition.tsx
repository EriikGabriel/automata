import {
  Delete02Icon,
  MoreHorizontalCircle01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { cn } from "@lib/utils"
import { useAutomaton } from "@store/automaton"
import { useEdgeEditing } from "@store/edge-editing"
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@ui/context-menu"
import {
  BaseEdge,
  EdgeLabelRenderer,
  type EdgeProps,
  getSmoothStepPath,
  useReactFlow,
} from "@xyflow/react"
import { useCallback, useEffect, useRef, useState } from "react"

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
  const removeEdge = useAutomaton((s) => s.removeEdge)

  const editingEdgeId = useEdgeEditing((s) => s.editingEdgeId)
  const stopEditing = useEdgeEditing((s) => s.stopEditing)

  const { setEdges } = useReactFlow()

  const isEditing = editingEdgeId === id
  const labelStr = typeof label === "string" ? label : ""
  const isEmpty = !labelStr.trim() || labelStr.trim() === "ε"
  const isEpsilon = labelStr.trim() === "ε"

  const inputRef = useRef<HTMLInputElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const [hovered, setHovered] = useState(false)
  const [contextMenuOpen, setContextMenuOpen] = useState(false)

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

  const handleContextMenuOpenChange = useCallback(
    (open: boolean) => {
      setContextMenuOpen(open)
      if (open && !selected) {
        setEdges((edges) =>
          edges.map((edge) => ({
            ...edge,
            selected: edge.id === id,
          })),
        )
      }
    },
    [id, selected, setEdges],
  )

  const handleEdgeContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      if (!selected) {
        setEdges((edges) =>
          edges.map((edge) => ({
            ...edge,
            selected: edge.id === id,
          })),
        )
      }

      if (buttonRef.current) {
        const event = new MouseEvent("contextmenu", {
          bubbles: true,
          cancelable: true,
          view: window,
          clientX: e.clientX,
          clientY: e.clientY,
        })
        buttonRef.current.dispatchEvent(event)
      }
    },
    [id, selected, setEdges],
  )

  const handleDeleteEdge = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      console.log("Deleting edge:", id)
      removeEdge(id)
    },
    [id, removeEdge],
  )

  const handleToggleEpsilon = useCallback(
    (checked: boolean) => {
      if (checked) {
        updateEdgeLabel(id, "ε")
      } else {
        updateEdgeLabel(id, "a")
      }
    },
    [id, updateEdgeLabel],
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selected) return

      // Shift+E for Empty Transition (epsilon)
      if (e.shiftKey && e.key === "E") {
        e.preventDefault()
        handleToggleEpsilon(!isEpsilon)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selected, isEpsilon, handleToggleEpsilon])

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: SVG element needs context menu for edge interaction
    <g
      tabIndex={-1}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onContextMenu={handleEdgeContextMenu}
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
        style={isEmpty ? { strokeDasharray: "6 3" } : undefined}
        markerEnd={`url(#${markerId})`}
      />
      <EdgeLabelRenderer>
        <ContextMenu
          open={contextMenuOpen}
          onOpenChange={handleContextMenuOpenChange}
        >
          <ContextMenuTrigger>
            <button
              ref={buttonRef}
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
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuGroup>
              <ContextMenuLabel>Transition</ContextMenuLabel>
              <ContextMenuCheckboxItem
                className="cursor-pointer"
                checked={isEpsilon}
                onCheckedChange={handleToggleEpsilon}
              >
                <HugeiconsIcon
                  icon={MoreHorizontalCircle01Icon}
                  className="text-slate-500"
                  strokeWidth={2}
                />
                Empty Transition (ε)
                <ContextMenuShortcut>⇧E</ContextMenuShortcut>
              </ContextMenuCheckboxItem>
            </ContextMenuGroup>
            <ContextMenuSeparator />
            <ContextMenuGroup>
              <ContextMenuItem variant="destructive" onClick={handleDeleteEdge}>
                <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                Delete
                <ContextMenuShortcut>Backspace</ContextMenuShortcut>
              </ContextMenuItem>
            </ContextMenuGroup>
          </ContextMenuContent>
        </ContextMenu>
      </EdgeLabelRenderer>
    </g>
  )
}
