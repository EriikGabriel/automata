import { PlayCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useSimulate } from "@store/simulate";
import { Button } from "@ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@ui/input-group";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function SimulateInput() {
	const [draft, setDraft] = useState("");
	const setInput = useSimulate((s) => s.setInput);
	const runSimulation = useSimulate((s) => s.runSimulation);
	const result = useSimulate((s) => s.result);
	const status = useSimulate((s) => s.status);

	const loadSimulation = () => {
		if (draft.trim().length === 0) return;

		setInput(draft);
		runSimulation();
	};

	return (
		<div className="bg-white z-5 shadow-lg border-2 absolute w-1/2 h-14 left-1/2 top-5 -translate-x-1/2 rounded-lg p-2 flex gap-2">
			<InputGroup
				className={cn(
					"w-full h-full border-slate-400/50 bg-slate-200/60",
					result?.accepted
						? "bg-green-200 border-green-500"
						: "bg-red-200 border-red-500",
				)}
			>
				<InputGroupAddon>Input:</InputGroupAddon>
				<InputGroupInput
					value={draft}
					onChange={(e) => setDraft(e.target.value)}
				/>
			</InputGroup>
			<Button
				className="h-full px-5 flex items-center gap-3 font-bold"
				onClick={loadSimulation}
				disabled={status === "loading"}
			>
				<HugeiconsIcon
					icon={PlayCircle02Icon}
					strokeWidth={2}
					className="text-white size-4"
					aria-label="Load"
				/>
				{status === "loading" ? "Loading..." : "Load"}
			</Button>
		</div>
	);
}
