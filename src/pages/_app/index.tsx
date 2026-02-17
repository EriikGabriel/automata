import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute('/_app/')({
  component: App,
})

export function App() {
  return (
    <main className="flex justify-center items-center min-h-dvh">
      <h1>Hello World</h1>
    </main>
  )
}
