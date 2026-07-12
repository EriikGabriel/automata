import { create } from "zustand";

type SimulateState = {
	input: string;
	step: number;
	setInput: (input: string) => void;
	setStep: (step: number) => void;
};

export const useSimulate = create<SimulateState>((set) => ({
	input: "",
	step: 0,
	setInput: (input) => set({ input, step: 0 }),
	setStep: (step) => set({ step }),
}));
