import {
  CheckmarkBadge01Icon,
  Delete02Icon,
  Login01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { getStateVariant, isFinalState, isInitialState } from "@lib/state-utils"
import { cn } from "@lib/utils"
import { useAutomaton } from "@store/automaton"
import { useNodeEditing } from "@store/node-editing"
import { useSelection } from "@store/selection"
import { useToolbar } from "@store/toolbar"
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
  Handle,
  type Node,
  type NodeProps,
  Position,
  useReactFlow,
} from "@xyflow/react"
import { useCallback, useEffect, useMemo, useRef } from "react"

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

type ArrowPosition = "left" | "right" | "diagonal"

const arrowConfigs: Record<
  ArrowPosition,
  {
    width: number
    height: number
    viewBox: string
    className: string
    linePath: string
    arrowHeadPath: string
  }
> = {
  left: {
    width: 28,
    height: 16,
    viewBox: "0 0 28 16",
    className: "absolute top-1/2 -translate-y-1/2 -left-7.5",
    linePath: "M2 8 H20",
    arrowHeadPath: "M17 3.5 L22.5 8 L17 12.5",
  },
  right: {
    width: 28,
    height: 16,
    viewBox: "0 0 28 16",
    className: "absolute top-1/2 -translate-y-1/2 -right-7.5 rotate-180",
    linePath: "M2 8 H20",
    arrowHeadPath: "M17 3.5 L22.5 8 L17 12.5",
  },
  diagonal: {
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    className: "absolute -top-5 -left-5",
    linePath: "M2 2 L18 18",
    arrowHeadPath: "M13 21 L19 19 L21 13",
  },
}

export function StateNode({ id, data, selected }: NodeProps<StateNodeType>) {
  const { label, variant } = data
  const transitionSource = useToolbar((s) => s.transitionSource)
  const isTransitionSource = transitionSource === id

  const editingNodeId = useNodeEditing((s) => s.editingNodeId)
  const stopEditing = useNodeEditing((s) => s.stopEditing)
  const updateNodeData = useAutomaton((s) => s.updateNodeData)
  const removeNode = useAutomaton((s) => s.removeNode)
  const edges = useAutomaton((s) => s.edges)

  const { setNodes } = useReactFlow()
  const setSelectedNodeIds = useSelection((s) => s.setSelectedNodeIds)

  const isEditing = editingNodeId === id
  const inputRef = useRef<HTMLInputElement>(null)

  const isInitial = isInitialState(variant)
  const isFinal = isFinalState(variant)

  const arrowPosition = useMemo<ArrowPosition>(() => {
    const hasLeftConnection = edges.some(
      (e) =>
        (e.target === id && e.targetHandle === "left") ||
        (e.source === id && e.sourceHandle === "left"),
    )

    const hasRightConnection = edges.some(
      (e) =>
        (e.target === id && e.targetHandle === "right") ||
        (e.source === id && e.sourceHandle === "right"),
    )

    if (!hasLeftConnection) return "left"
    if (!hasRightConnection) return "right"
    return "diagonal"
  }, [id, edges])

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

  const handleToggleInitial = useCallback(
    (checked: boolean) => {
      const nodes = useAutomaton.getState().nodes

      if (checked) {
        for (const node of nodes) {
          if (node.id === id) continue
          if (isInitialState(node.data.variant)) {
            const wasFinal = isFinalState(node.data.variant)
            updateNodeData(node.id, {
              variant: wasFinal ? "final" : "default",
            })
          }
        }
      }

      updateNodeData(id, {
        variant: getStateVariant(checked, isFinal),
      })
    },
    [id, isFinal, updateNodeData],
  )

  const handleToggleFinal = useCallback(
    (checked: boolean) => {
      updateNodeData(id, {
        variant: getStateVariant(isInitial, checked),
      })
    },
    [id, isInitial, updateNodeData],
  )

  const handleDeleteNode = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      console.log("Deleting node:", id)
      removeNode(id)
      useSelection.getState().removeSelectedNodeId(id)
    },
    [id, removeNode],
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selected) return

      // Shift+Q for Initial State
      if (e.shiftKey && e.key === "Q") {
        e.preventDefault()
        handleToggleInitial(!isInitial)
      }

      // Shift+E for Acceptance State
      if (e.shiftKey && e.key === "E") {
        e.preventDefault()
        handleToggleFinal(!isFinal)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selected, isInitial, isFinal, handleToggleInitial, handleToggleFinal])

  const config = arrowConfigs[arrowPosition]

  const handleContextMenuOpenChange = useCallback(
    (open: boolean) => {
      if (open && !selected) {
        setNodes((nodes) =>
          nodes.map((node) => ({
            ...node,
            selected: node.id === id,
          })),
        )
        setSelectedNodeIds([id])
      }
    },
    [id, selected, setNodes, setSelectedNodeIds],
  )

  return (
    <ContextMenu onOpenChange={handleContextMenuOpenChange}>
      <ContextMenuTrigger>
        <div className="group/state flex items-center justify-center relative">
          {isInitial && (
            <svg
              width={config.width}
              height={config.height}
              viewBox={config.viewBox}
              fill="none"
              className={config.className}
              role="img"
              aria-labelledby={`initial-arrow-title-${id}`}
            >
              <title id={`initial-arrow-title-${id}`}>
                Initial state arrow
              </title>
              <path
                d={config.linePath}
                strokeWidth="2"
                strokeLinecap="round"
                className={cn(
                  "transition-colors duration-150 group-hover/state:stroke-amethyst-400",
                  selected ? "stroke-amethyst-500" : "stroke-slate-400",
                )}
              />
              <path
                d={config.arrowHeadPath}
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
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuLabel>State Props</ContextMenuLabel>
          <ContextMenuCheckboxItem
            className="cursor-pointer"
            checked={isInitial}
            onCheckedChange={handleToggleInitial}
          >
            <HugeiconsIcon
              icon={Login01Icon}
              className="text-slate-500"
              strokeWidth={2}
            />
            Initial State
            <ContextMenuShortcut>⇧Q</ContextMenuShortcut>
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem
            className="cursor-pointer"
            checked={isFinal}
            onCheckedChange={handleToggleFinal}
          >
            <HugeiconsIcon
              icon={CheckmarkBadge01Icon}
              className="text-slate-500"
              strokeWidth={2}
            />
            Acceptance State
            <ContextMenuShortcut>⇧E</ContextMenuShortcut>
          </ContextMenuCheckboxItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuItem variant="destructive" onClick={handleDeleteNode}>
            <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
            Delete
            <ContextMenuShortcut>Backspace</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  )
}
