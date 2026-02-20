import { Header } from "@components/header"
import { useMode } from "@store/mode"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_app/")({
  component: App,
})

export function App() {
  const { mode } = useMode()

  return (
    <main className="min-h-dvh">
      <Header />
      {mode}
    </main>
  )
}
