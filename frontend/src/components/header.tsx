import {
  ArrowHorizontalFreeIcons,
  Download01Icon,
  PlayCircle02Icon,
  Redo03Icon,
  Share08Icon,
  Sun03Icon,
  Undo03Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { type Mode, useMode } from "@store/mode"
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar"
import { Button } from "@ui/button"
import { Tabs, TabsList, TabsTrigger } from "@ui/tabs"

export function Header() {
  const { mode, setMode } = useMode()

  return (
    <header className="flex items-center justify-around h-16 py-3 px-6 bg-white drop-shadow">
      <div className="flex gap-3">
        <div className="bg-amethyst-500 rounded-lg p-2">
          <img
            src="/logo.png"
            alt="logo"
            className="size-7 saturate-0 brightness-0 invert-100"
          />
        </div>
        <div>
          <h1 className="text-lg slate-900 font-bold">Automata Lab</h1>
          <h3 className="text-tiny/relaxed text-amethyst-500 uppercase tracking-widest font-bold">
            Ametista Engine
          </h3>
        </div>
      </div>

      <Tabs value={mode} onValueChange={(value) => setMode(value as Mode)}>
        <TabsList className="h-11! bg-slate-100">
          <TabsTrigger value="automata-str" className="px-4">
            <HugeiconsIcon icon={ArrowHorizontalFreeIcons} />
            Automata/String
          </TabsTrigger>
          <TabsTrigger value="simulate" className="px-4">
            <HugeiconsIcon icon={PlayCircle02Icon} />
            Simulate
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="icon-lg"
          className="hover:bg-slate-200"
        >
          <HugeiconsIcon icon={Undo03Icon} />
        </Button>
        <Button
          variant="secondary"
          size="icon-lg"
          className="hover:bg-slate-200"
        >
          <HugeiconsIcon icon={Redo03Icon} />
        </Button>
        <Button
          variant="secondary"
          size="icon-lg"
          className="hover:bg-slate-200"
        >
          <HugeiconsIcon icon={Share08Icon} />
        </Button>
        <Button size="lg" className="px-4 font-bold">
          <HugeiconsIcon icon={Download01Icon} strokeWidth={2} />
          Export
        </Button>
      </div>

      <div className="flex gap-3 items-center">
        <Button
          variant="secondary"
          size="icon-lg"
          className="rounded-full size-10"
        >
          <HugeiconsIcon icon={Sun03Icon} strokeWidth={2} />
        </Button>
        <div className="border h-10 border-slate-100" />
        <Avatar
          size="lg"
          className="border-2 border-amethyst-200 p-0.5 flex items-center justify-center"
        >
          <AvatarImage src="https://github.com/EriikGabriel.png" />
          <AvatarFallback>AV</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
