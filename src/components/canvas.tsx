import { useAutomaton } from "@store/automaton"
import { useCanvas } from "@store/canvas"
import { useEdgeEditing } from "@store/edge-editing"
import { useSelection } from "@store/selection"
import { useToolbar } from "@store/toolbar"
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  type Connection,
  ConnectionMode,
  Controls,
  type DefaultEdgeOptions,
  type Edge,
  type EdgeChange,
  type IsValidConnection,
  type Node,
  type NodeChange,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Viewport,
} from "@xyflow/react"
import { type MouseEvent, useCallback } from "react"
import { StageTransition, StateNode, type StateNodeType } from "./state"

import "@xyflow/react/dist/style.css"
import { cn } from "@/lib/utils"
import { Toolbar } from "./toolbar"
import { TransitionTable } from "./transition-table"

const nodeTypes = {
  state: StateNode,
}

const edgeTypes = {
  transition: StageTransition,
}

const defaultEdgeOptions: DefaultEdgeOptions = {
  type: "transition",
}

function CanvasInner() {
  const nodes = useAutomaton((s) => s.nodes)
  const edges = useAutomaton((s) => s.edges)
  const setNodes = useAutomaton((s) => s.setNodes)
  const setEdges = useAutomaton((s) => s.setEdges)
  const removeNode = useAutomaton((s) => s.removeNode)
  const removeEdge = useAutomaton((s) => s.removeEdge)
  const hasEdge = useAutomaton((s) => s.hasEdge)
  const getNextStateLabel = useAutomaton((s) => s.getNextStateLabel)

  const startEditing = useEdgeEditing((s) => s.startEditing)
  const activeTool = useToolbar((s) => s.activeTool)
  const setActiveTool = useToolbar((s) => s.setActiveTool)
  const setTransitionSource = useToolbar((s) => s.setTransitionSource)
  const clearTransitionSource = useToolbar((s) => s.clearTransitionSource)

  const snapToGrid = useCanvas((s) => s.snapToGrid)
  const setZoom = useCanvas((s) => s.setZoom)

  const setSelectedNodeIds = useSelection((s) => s.setSelectedNodeIds)

  const { screenToFlowPosition } = useReactFlow()

  const onViewportChange = useCallback(
    (viewport: Viewport) => {
      setZoom(viewport.zoom)
    },
    [setZoom],
  )

  const onNodesChange = useCallback(
    (changes: NodeChange<StateNodeType>[]) => {
      setNodes((nds) => {
        const updated = applyNodeChanges(changes, nds)

        const hasSelectionChange = changes.some((c) => c.type === "select")
        if (hasSelectionChange) {
          const selectedIds = updated.filter((n) => n.selected).map((n) => n.id)
          setSelectedNodeIds(selectedIds)
        }

        return updated
      })
    },
    [setNodes, setSelectedNodeIds],
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange<Edge>[]) => {
      setEdges((eds) => applyEdgeChanges(changes, eds))
    },
    [setEdges],
  )

  const isValidConnection: IsValidConnection = useCallback(
    (connection) => {
      const source = connection.source
      const target = connection.target
      const sourceHandle = connection.sourceHandle ?? null
      const targetHandle = connection.targetHandle ?? null

      const isDuplicate = edges.some(
        (edge) =>
          edge.source === source &&
          edge.target === target &&
          (edge.sourceHandle ?? null) === sourceHandle &&
          (edge.targetHandle ?? null) === targetHandle,
      )

      return !isDuplicate
    },
    [edges],
  )

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdgeId = `e${params.source}-${params.target}-${Date.now()}`
      setEdges((eds) => addEdge({ ...params, id: newEdgeId }, eds))
      startEditing(newEdgeId)
    },
    [setEdges, startEditing],
  )

  const onEdgeDoubleClick = useCallback(
    (_event: MouseEvent, edge: Edge) => {
      startEditing(edge.id)
    },
    [startEditing],
  )

  const onNodeClick = useCallback(
    (_event: MouseEvent, node: Node) => {
      if (activeTool === "delete") {
        removeNode(node.id)
        useSelection.getState().removeSelectedNodeId(node.id)
        return
      }

      if (activeTool === "transition") {
        const sourceId = useToolbar.getState().transitionSource

        if (!sourceId) {
          setTransitionSource(node.id)
          return
        }

        const targetId = node.id

        if (!hasEdge(sourceId, targetId)) {
          const newEdgeId = `e${sourceId}-${targetId}-${Date.now()}`
          setEdges((eds) =>
            addEdge({ id: newEdgeId, source: sourceId, target: targetId }, eds),
          )
          startEditing(newEdgeId)
        }

        clearTransitionSource()
        setActiveTool("select")
      }
    },
    [
      activeTool,
      removeNode,
      setEdges,
      setTransitionSource,
      clearTransitionSource,
      startEditing,
      hasEdge,
      setActiveTool,
    ],
  )

  const onEdgeClick = useCallback(
    (_event: MouseEvent, edge: Edge) => {
      if (activeTool === "delete") {
        removeEdge(edge.id)
      }
    },
    [activeTool, removeEdge],
  )

  const onPaneClick = useCallback(
    (event: MouseEvent) => {
      if (activeTool === "transition") {
        clearTransitionSource()
        return
      }

      if (activeTool !== "state" && activeTool !== "state-final") {
        return
      }

      const position = screenToFlowPosition({
        x: event.clientX - 40,
        y: event.clientY - 40,
      })

      const isFirstNode = nodes.length === 0
      const variant = isFirstNode
        ? activeTool === "state-final"
          ? "initial-final"
          : "initial"
        : activeTool === "state-final"
          ? "final"
          : "default"
      const label = getNextStateLabel()
      const newId = `node-${label}-${Date.now()}`

      const newNode: StateNodeType = {
        id: newId,
        type: "state",
        position,
        data: { label, variant },
      }

      setNodes((nds) => [...nds, newNode])
      setActiveTool("select")
    },
    [
      activeTool,
      nodes.length,
      screenToFlowPosition,
      setNodes,
      setActiveTool,
      clearTransitionSource,
      getNextStateLabel,
    ],
  )

  const panOnDrag = activeTool === "select"
  const nodesDraggable = activeTool === "select"
  const nodesConnectable =
    activeTool === "select" || activeTool === "transition"
  const elementsSelectable =
    activeTool === "select" ||
    activeTool === "delete" ||
    activeTool === "transition"

  const showTransitionTable = false

  return (
    <div
      className={cn(
        "h-[calc(100vh-64px-28px)] w-4/5",
        activeTool === "select" ? "cursor-grab" : "cursor-default",
        activeTool.match(/state/) ? "cursor-crosshair" : "cursor-default",
      )}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeDoubleClick={onEdgeDoubleClick}
        onPaneClick={onPaneClick}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onViewportChange={onViewportChange}
        isValidConnection={isValidConnection}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionMode={ConnectionMode.Loose}
        deleteKeyCode="Backspace"
        panOnDrag={panOnDrag}
        nodesDraggable={nodesDraggable}
        nodesConnectable={nodesConnectable}
        elementsSelectable={elementsSelectable}
        snapToGrid={snapToGrid}
        snapGrid={[20, 20]}
        fitView
      >
        <Toolbar />
        {showTransitionTable && <TransitionTablePanel />}
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  )
}

function TransitionTablePanel() {
  return (
    <div className="z-10 absolute bottom-6 right-6 w-80 max-h-72 overflow-auto rounded-lg drop-shadow-lg">
      <TransitionTable />
    </div>
  )
}

export function Canvas() {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  )
}
