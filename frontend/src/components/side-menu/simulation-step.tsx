import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@lib/utils";
import { STATUS_CONFIG } from "./simulation-options";

export function SimulationStep({
	stepNumber,
	description,
	transition,
	status,
	isFinalStep = false,
	finalStateLabel,
}: {
	stepNumber: number;
	description: string;
	transition: string;
	status: "Completed" | "Processing" | "Pending" | "Error";
	isFinalStep?: boolean;
	finalStateLabel?: string;
}) {
	const { icon, color } = STATUS_CONFIG[status];

	return (
		<div
			className={cn(
				"p-3 w-full flex gap-3 items-center text-slate-500 bg-slate-50 border rounded-lg border-slate-300",
				isFinalStep && "ring-2 ring-amethyst-300",
				status === "Processing" && " bg-amethyst-100 border-amethyst-300",
				status === "Pending" && "opacity-50",
				status === "Error" && "bg-red-100 border-red-300",
			)}
		>
			<HugeiconsIcon
				icon={icon}
				className={cn("size-5", color)}
				strokeWidth={2.5}
			/>
			<div className="flex flex-col gap-1">
				<span
					className={cn(
						"text-slate-500 font-bold text-xs",
						status === "Processing" && "text-amethyst-500",
						status === "Error" && "text-red-500",
					)}
				>
					Step {stepNumber}: {description}
					{isFinalStep && (
						<span className="ml-2 rounded-full bg-amethyst-100 px-2 py-0.5 text-[10px] uppercase tracking-wide text-amethyst-600">
							Final
						</span>
					)}
				</span>
				{status !== "Pending" ? (
					<p className="text-slate-900">
						Transition:{" "}
						<span className="text-slate-900 font-bold">{transition}</span>
					</p>
				) : (
					<p className="text-slate-900">Pending...</p>
				)}
				{isFinalStep && finalStateLabel && (
					<p
						className={cn(
							"w-fit rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
							finalStateLabel === "Accepted"
								? "bg-green-100 text-green-700"
								: "bg-red-100 text-red-700",
						)}
					>
						{finalStateLabel}
					</p>
				)}
			</div>
		</div>
	);
}
