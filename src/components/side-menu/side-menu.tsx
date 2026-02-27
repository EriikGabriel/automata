import { useSelection } from "@store/selection"
import { GeneralOptions } from "./general-options"
import { StateOptions } from "./state-options"

export function SideMenu() {
  const selectedStates = useSelection((s) => s.selectedNodeIds)

  return (
    <aside className="h-[calc(100vh-64px-28px)] w-1/5 bg-white border-l border-slate-200 text-white p-4">
      {selectedStates.length === 0 ? <GeneralOptions /> : <StateOptions />}
    </aside>
  )
}
