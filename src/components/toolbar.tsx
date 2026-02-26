import {
  ArrowRight02Icon,
  Cursor02Icon,
  Delete02Icon,
  Refresh03Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { type Tool, useToolbar } from "@store/toolbar"
import { Button } from "@ui/button"
import { Separator } from "@ui/separator"
import { ToggleGroup, ToggleGroupItem } from "@ui/toggle-group"

export function Toolbar() {
  const activeTool = useToolbar((s) => s.activeTool)
  const setActiveTool = useToolbar((s) => s.setActiveTool)

  const handleChange = (pressed: string[]) => {
    if (pressed.length > 0) {
      setActiveTool(pressed[pressed.length - 1] as Tool)
    }
  }

  return (
    <ToggleGroup
      spacing={1}
      orientation="vertical"
      value={[activeTool]}
      onValueChange={handleChange}
      className="z-10 w-12 min-h-52 rounded-lg drop-shadow-lg absolute top-1/2 left-6 -translate-y-1/2   flex flex-col items-center gap-2 p-1 bg-white text-slate-600 *:hover:text-slate-600"
    >
      <ToggleGroupItem
        value="select"
        className="w-full h-10 data-pressed:bg-amethyst-500 data-pressed:text-white"
      >
        <HugeiconsIcon icon={Cursor02Icon} strokeWidth={2.5} />
      </ToggleGroupItem>

      <ToggleGroupItem
        value="state"
        className="w-full h-10 data-pressed:bg-amethyst-500 data-pressed:text-white"
      >
        <div className="flex items-center justify-center border-2 size-4 rounded-full border-slate-600 group-data-pressed/toggle:border-white" />
      </ToggleGroupItem>

      <ToggleGroupItem
        value="state-final"
        className="w-full h-10 data-pressed:bg-amethyst-500 data-pressed:text-white"
      >
        <div className="flex items-center justify-center p-1 border-2 rounded-full border-slate-600 group-data-pressed/toggle:border-white">
          <div className="size-2 rounded-full bg-slate-600 group-data-pressed/toggle:bg-white" />
        </div>
      </ToggleGroupItem>

      <ToggleGroupItem
        value="transition"
        className="w-full h-10 data-pressed:bg-amethyst-500 data-pressed:text-white"
      >
        <HugeiconsIcon
          icon={ArrowRight02Icon}
          strokeWidth={2}
          className="size-5"
        />
      </ToggleGroupItem>

      <Separator className="border w-4/6 flex self-center" />

      <ToggleGroupItem
        value="delete"
        className="w-full h-10 data-pressed:bg-amethyst-500 data-pressed:text-white"
      >
        <HugeiconsIcon icon={Delete02Icon} strokeWidth={2.5} />
      </ToggleGroupItem>

      <Button variant="ghost" className="w-full h-10 data-pressed:text-white">
        <HugeiconsIcon icon={Refresh03Icon} strokeWidth={2.5} />
      </Button>
    </ToggleGroup>
  )
}
