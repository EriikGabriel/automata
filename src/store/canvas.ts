import { create } from "zustand"

type CanvasState = {
  snapToGrid: boolean
  toggleSnapToGrid: () => void
  setSnapToGrid: (snap: boolean) => void

  zoom: number
  setZoom: (zoom: number) => void
}

export const useCanvas = create<CanvasState>((set) => ({
  snapToGrid: false,
  toggleSnapToGrid: () => set((state) => ({ snapToGrid: !state.snapToGrid })),
  setSnapToGrid: (snap) => set({ snapToGrid: snap }),

  zoom: 1,
  setZoom: (zoom) => set({ zoom }),
}))
