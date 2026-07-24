import { create } from "zustand";
import { useAutomaton } from "./automaton";

export type Step = {
	currentStates: string[];
	symbol: string;
	nextStates: string[];
	isInvalidTransition?: boolean;
};

export type SimulationResult = {
	accepted: boolean;
	steps: Step[];
};

type SimulateStatus = "idle" | "loading" | "success" | "error";

type SimulateState = {
	input: string;
	step: number;
	isPlaying: boolean;
	status: SimulateStatus;
	error: string | null;
	result: SimulationResult | null;
	setInput: (input: string) => void;
	setStep: (step: number) => void;
	setIsPlaying: (playing: boolean) => void;
	reset: () => void;
	runSimulation: () => Promise<void>;
};

export const useSimulate = create<SimulateState>((set) => ({
	input: "",
	step: 0,
	isPlaying: false,
	status: "idle",
	error: null,
	result: null,

	setInput: (input) =>
		set({ input, step: 0, isPlaying: false, result: null, status: "idle" }),
	setStep: (step) => set({ step }),
	setIsPlaying: (isPlaying) => set({ isPlaying }),
	reset: () =>
		set({
			input: "",
			step: 0,
			isPlaying: false,
			result: null,
			status: "idle",
			error: null,
		}),

	runSimulation: async () => {
		const { input } = useSimulate.getState();
		const { initial, finals, table } = useAutomaton
			.getState()
			.getTransitionTable();

		set({ status: "loading", error: null });

		try {
			const response = await fetch("http://localhost:3000/simulate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ input, initial, finals, table }),
			});

			if (!response.ok) {
				const { error } = await response.json();
				set({ status: "error", error: error ?? "Erro desconhecido" });
				return;
			}

			const result: SimulationResult = await response.json();

			console.debug(result);

			set({ status: "success", result, step: 0 });
		} catch {
			set({ status: "error", error: "Não foi possível conectar ao servidor" });
		}
	},
}));
