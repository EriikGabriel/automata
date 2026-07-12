import { PlayCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@ui/input-group";
import { useState } from "react";
import { useSimulate } from "@/store/simulate";

export function SimulateInput() {
	const [draft, setDraft] = useState("");
	const setInput = useSimulate((s) => s.setInput);

	const loadSimulation = () => {
		if (draft.trim().length === 0) return;

		setInput(draft);
	};

	return (
		<div className="bg-white z-5 shadow absolute w-1/2 h-14 left-1/2 top-5 -translate-x-1/2 rounded p-2 flex gap-2">
			<InputGroup className="w-full h-full border-slate-400/50 bg-slate-200/60">
				<InputGroupAddon>Input:</InputGroupAddon>
				<InputGroupInput
					value={draft}
					onChange={(e) => setDraft(e.target.value)}
				/>
			</InputGroup>
			<Button
				className="h-full px-5 flex items-center gap-3 font-bold"
				onClick={loadSimulation}
			>
				<HugeiconsIcon
					icon={PlayCircle02Icon}
					strokeWidth={2}
					className="text-white size-4"
					aria-label="Load"
				/>
				Load
			</Button>
		</div>
	);
}
