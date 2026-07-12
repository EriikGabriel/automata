import {
  ArrowRight02Icon,
  Cursor02Icon,
  Delete02Icon,
  Refresh03Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useEdgeEditing } from "@store/edge-editing"
import { useNodeEditing } from "@store/node-editing"
import { type Tool, useToolbar } from "@store/toolbar"
import { Button } from "@ui/button"
import { Kbd } from "@ui/kbd"
import { Separator } from "@ui/separator"
import { ToggleGroup, ToggleGroupItem } from "@ui/toggle-group"
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui/tooltip"
import { useEffect } from "react"

const shortcuts: Record<string, Tool> = {
  a: "select",
  s: "state",
  f: "state-final",
  t: "transition",
  d: "delete",
}

export function Toolbar() {
  const activeTool = useToolbar((s) => s.activeTool)
  const setActiveTool = useToolbar((s) => s.setActiveTool)

  const handleChange = (pressed: string[]) => {
    if (pressed.length > 0) {
      setActiveTool(pressed[pressed.length - 1] as Tool)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      if (useNodeEditing.getState().editingNodeId !== null) return
      if (useEdgeEditing.getState().editingEdgeId !== null) return

      const tool = shortcuts[e.key.toLowerCase()]
      if (tool) {
        e.preventDefault()
        setActiveTool(tool)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [setActiveTool])

  return (
    <ToggleGroup
      spacing={1}
      orientation="vertical"
      value={[activeTool]}
      onValueChange={handleChange}
      className="z-10 w-12 min-h-52 rounded-lg drop-shadow-lg absolute top-1/2 left-6 -translate-y-1/2   flex flex-col items-center gap-2 p-1 bg-white text-slate-600 *:hover:text-slate-600"
    >
      <Tooltip>
        <TooltipTrigger
          render={
            <ToggleGroupItem
              value="select"
              className="w-full h-10 data-pressed:bg-amethyst-500 data-pressed:text-white"
            />
          }
        >
          <HugeiconsIcon icon={Cursor02Icon} strokeWidth={2.5} />
        </TooltipTrigger>
        <TooltipContent side="right">
          Select — <Kbd>A</Kbd>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger
          render={
            <ToggleGroupItem
              value="state"
              className="w-full h-10 data-pressed:bg-amethyst-500 data-pressed:text-white"
            />
          }
        >
          <div className="flex items-center justify-center border-2 size-4 rounded-full border-slate-600 group-data-pressed/toggle:border-white" />
        </TooltipTrigger>
        <TooltipContent side="right">
          State — <Kbd>S</Kbd>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger
          render={
            <ToggleGroupItem
              value="state-final"
              className="w-full h-10 data-pressed:bg-amethyst-500 data-pressed:text-white"
            />
          }
        >
          <div className="flex items-center justify-center p-1 border-2 rounded-full border-slate-600 group-data-pressed/toggle:border-white">
            <div className="size-2 rounded-full bg-slate-600 group-data-pressed/toggle:bg-white" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="right">
          Final state — <Kbd>F</Kbd>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger
          render={
            <ToggleGroupItem
              value="transition"
              className="w-full h-10 data-pressed:bg-amethyst-500 data-pressed:text-white"
            />
          }
        >
          <HugeiconsIcon
            icon={ArrowRight02Icon}
            strokeWidth={2}
            className="size-5"
          />
        </TooltipTrigger>
        <TooltipContent side="right">
          Transition — <Kbd>T</Kbd>
        </TooltipContent>
      </Tooltip>

      <Separator className="border w-4/6 flex self-center" />

      <Tooltip>
        <TooltipTrigger
          render={
            <ToggleGroupItem
              value="delete"
              className="w-full h-10 data-pressed:bg-amethyst-500 data-pressed:text-white"
            />
          }
        >
          <HugeiconsIcon icon={Delete02Icon} strokeWidth={2.5} />
        </TooltipTrigger>
        <TooltipContent side="right">
          Delete — <Kbd>D</Kbd>
        </TooltipContent>
      </Tooltip>

      <Button variant="ghost" className="w-full h-10 data-pressed:text-white">
        <HugeiconsIcon icon={Refresh03Icon} strokeWidth={2.5} />
      </Button>
    </ToggleGroup>
  )
}
