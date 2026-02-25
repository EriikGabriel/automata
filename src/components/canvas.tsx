import { useEdgeEditing } from "@store/edge-editing"
import {
  addEdge,
  Background,
  type Connection,
  ConnectionMode,
  Controls,
  type DefaultEdgeOptions,
  type Edge,
  type IsValidConnection,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react"
import { type MouseEvent, useCallback } from "react"
import { StageTransition, StateNode, type StateNodeType } from "./state"

import "@xyflow/react/dist/style.css"
import { Toolbar } from "./toolbar"

const nodeTypes = {
  state: StateNode,
}

const edgeTypes = {
  transition: StageTransition,
}

const initialNodes: StateNodeType[] = [
  {
    id: "1",
    type: "state",
    position: { x: 0, y: 0 },
    data: { label: "q0", variant: "initial" },
  },
  {
    id: "2",
    type: "state",
    position: { x: 150, y: 0 },
    data: { label: "q1", variant: "default" },
  },
  {
    id: "3",
    type: "state",
    position: { x: 300, y: 0 },
    data: { label: "q2", variant: "final" },
  },
]

const defaultEdgeOptions: DefaultEdgeOptions = {
  type: "transition",
}

const initialEdges: Edge[] = []

export function Canvas() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const startEditing = useEdgeEditing((s) => s.startEditing)

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

  return (
    <div className="h-[calc(100vh-64px)]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeDoubleClick={onEdgeDoubleClick}
        isValidConnection={isValidConnection}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionMode={ConnectionMode.Loose}
        deleteKeyCode="Backspace"
        fitView
      >
        <Toolbar />
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  )
}
