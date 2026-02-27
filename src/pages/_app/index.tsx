import { BottomPanel } from "@components/bottom-panel"
import { Canvas } from "@components/canvas"
import { Header } from "@components/header"
import { SideMenu } from "@components/side-menu"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_app/")({
  component: App,
})

export function App() {
  return (
    <main className="min-h-dvh">
      <Header />
      <div className="flex">
        <Canvas />
        <SideMenu />
      </div>
      <BottomPanel />
    </main>
  )
}
