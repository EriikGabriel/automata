import { create } from "zustand"

export type Mode = "automata-str" | "simulate"

type ModeState = {
  mode: Mode
  setMode: (mode: Mode) => void
}

export const useMode = create<ModeState>((set) => ({
  mode: "automata-str",
  setMode: (mode) => set({ mode }),
}))
