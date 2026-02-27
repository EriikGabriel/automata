import { GridTableIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useMemo } from "react"
import { useAutomaton } from "@/store/automaton"
import { useCanvas } from "@/store/canvas"
import { Separator } from "./ui/separator"
import { Toggle } from "./ui/toggle"

export function BottomPanel() {
  const snapToGrid = useCanvas((s) => s.snapToGrid)
  const toggleSnapToGrid = useCanvas((s) => s.toggleSnapToGrid)
  const zoom = useCanvas((s) => s.zoom)

  const edges = useAutomaton((s) => s.edges)

  const alphabet = useMemo(() => {
    const alphabetSet = new Set<string>()
    for (const edge of edges) {
      const label = typeof edge.label === "string" ? edge.label.trim() : ""
      if (label) {
        for (const symbol of label.split(",")) {
          const trimmed = symbol.trim()
          if (trimmed && trimmed !== "ε") alphabetSet.add(trimmed)
        }
      }
    }
    return [...alphabetSet].sort()
  }, [edges])

  const alphabetDisplay =
    alphabet.length > 0 ? `Σ = {${alphabet.join(", ")}}` : "Σ = ∅"

  const zoomPercent = `${Math.round(zoom * 100)}%`

  return (
    <footer className="flex items-center justify-between w-full h-7 bg-slate-50 border border-slate-200 px-6 gap-4">
      <div className="flex items-center gap-4 h-full">
        <div className="flex justify-center items-center h-full gap-2">
          <div className="rounded-full size-2 bg-green-500 border border-green-400" />
          <p className="text-gray-500 text-xs">Ametista Engine Ready</p>
        </div>
        <Separator
          orientation="vertical"
          className="flex justify-self-center w-full mt-1 border h-4/6"
        />
        <Toggle
          pressed={snapToGrid}
          onPressedChange={toggleSnapToGrid}
          className="text-gray-500 hover:text-gray-500 text-xs data-pressed:bg-amethyst-100 data-pressed:text-amethyst-500 h-fit p-1 px-2 rounded"
        >
          <HugeiconsIcon icon={GridTableIcon} />
          Snap to Grid
        </Toggle>
      </div>

      <div className="flex items-center gap-4 h-full">
        <p className="text-xs text-slate-500 font-mono">{alphabetDisplay}</p>
        <Separator
          orientation="vertical"
          className="flex justify-self-center w-full mt-1 border h-4/6"
        />
        <p className="text-xs text-slate-500">Zoom: {zoomPercent}</p>
      </div>
    </footer>
  )
}
