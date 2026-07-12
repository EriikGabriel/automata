import { TooltipProvider } from "@components/ui/tooltip"
import { createRootRoute, HeadContent, Outlet } from "@tanstack/react-router"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { title: "Automata Lab" },
      {
        name: "description",
        content:
          "Finite Automata Simulator. Create state diagrams, test input strings",
      },
      {
        name: "keywords",
        content: "automata, finite automata, simulator, diagram, chain",
      },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <TooltipProvider>
      <HeadContent />
      <Outlet />
    </TooltipProvider>
  )
}
