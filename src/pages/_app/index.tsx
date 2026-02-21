import { Canvas } from "@components/canvas"
import { Header } from "@components/header"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_app/")({
  component: App,
})

export function App() {
  return (
    <main className="min-h-dvh">
      <Header />
      <Canvas />
    </main>
  )
}
