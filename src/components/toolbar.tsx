import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon, Cursor02Icon, Delete02Icon, Refresh03Icon } from "@hugeicons/core-free-icons";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";

export function Toolbar() {
  return (
    <ToggleGroup spacing={1} orientation="vertical" className="z-10 w-12 min-h-52 rounded-lg drop-shadow-lg absolute top-1/2 left-6 -translate-y-1/2   flex flex-col items-center gap-2 p-1 bg-white text-slate-600 *:hover:text-slate-600">

      <ToggleGroupItem value="a" className="w-full h-10 data-pressed:bg-amethyst-500 data-pressed:text-white">
        <HugeiconsIcon icon={Cursor02Icon} strokeWidth={2.5} />
      </ToggleGroupItem>

      <ToggleGroupItem value="b" className="w-full h-10 data-pressed:bg-amethyst-500 data-pressed:text-white">
        <div className="flex items-center justify-center border-2 size-4 rounded-full border-slate-600 group-data-pressed/toggle:border-white" />
      </ToggleGroupItem>

      <ToggleGroupItem value="c" className="w-full h-10 data-pressed:bg-amethyst-500 data-pressed:text-white">
        <div className="flex items-center justify-center p-1 border-2 rounded-full border-slate-600 group-data-pressed/toggle:border-white">
          <div className="size-2 rounded-full bg-slate-600 group-data-pressed/toggle:bg-white" />
        </div>
      </ToggleGroupItem>

      <ToggleGroupItem value="d" className="w-full h-10 data-pressed:bg-amethyst-500 data-pressed:text-white">
        <HugeiconsIcon icon={ArrowRight02Icon} strokeWidth={2} className="size-5"  />
      </ToggleGroupItem>

      <Separator className="border w-4/6 flex self-center" />

      <ToggleGroupItem value="e" className="w-full h-10 data-pressed:bg-amethyst-500 data-pressed:text-white">
        <HugeiconsIcon icon={Delete02Icon} strokeWidth={2.5}  />
      </ToggleGroupItem>

      <Button value="f" variant="ghost" className="w-full h-10 data-pressed:text-white">
        <HugeiconsIcon icon={Refresh03Icon} strokeWidth={2.5}  />
      </Button>
    </ToggleGroup>
  );
}
