import { useMode } from "@store/mode"
import { useSelection } from "@store/selection"
import { GeneralOptions } from "./general-options"
import { SimulationOptions } from "./simulation-options"
import { StateOptions } from "./state-options"

export function SideMenu() {
  const selectedStates = useSelection((s) => s.selectedNodeIds)
  const mode = useMode((s) => s.mode)

  return (
    <aside className="h-[calc(100vh-64px-28px)] w-1/5 bg-white border-l border-slate-200 text-white p-4">
      {mode === "automata-str" ? (
        selectedStates.length > 0 ? (
          <StateOptions />
        ) : (
          <GeneralOptions />
        )
      ) : (
        <SimulationOptions />
      )}
    </aside>
  )
}
