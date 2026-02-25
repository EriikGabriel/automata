import { cn } from "@lib/utils"
import { Handle, type Node, type NodeProps, Position } from "@xyflow/react"

type StateNodeData = {
  label: string
  variant?: "initial" | "final" | "default"
}

export type StateNodeType = Node<StateNodeData, "state">

const positions = [
  { position: Position.Top, id: "top" },
  { position: Position.Right, id: "right" },
  { position: Position.Bottom, id: "bottom" },
  { position: Position.Left, id: "left" },
]

export function StateNode({ data, selected }: NodeProps<StateNodeType>) {
  const { label, variant } = data

  return (
    <div className="group/state flex items-center justify-center">
      {variant === "initial" && (
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
          variant === "final" &&
            "flex justify-center items-center border-3 rounded-full p-0.75 transition-colors duration-150 group-hover/state:border-amethyst-400",
          variant === "final" &&
            (selected ? "border-amethyst-500" : "border-slate-300"),
        )}
      >
        <div
          className={cn(
            "bg-white border-2 size-10 rounded-full p-3 flex items-center justify-center text-xs font-bold transition-colors duration-150 group-hover/state:border-amethyst-400",
            selected
              ? "bg-amethyst-500 border-amethyst-300 text-white group-hover/state:bg-amethyst-400 group-hover/state:border-amethyst-400"
              : "bg-white border-slate-300",
            variant === "final" ? "size-9" : "",
          )}
        >
          {label}
        </div>

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
