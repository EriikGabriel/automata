import {
	CancelCircleIcon,
	CircleArrowReload01Icon,
	CircleArrowRight02Icon,
	CircleCheck,
	MoreHorizontalCircle02Icon,
	StatusIcon,
	TableIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@lib/utils";
import { useCanvas } from "@store/canvas";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@ui/accordion";
import { Button } from "@ui/button";
import { Separator } from "@ui/separator";

const STATUS_CONFIG = {
	Completed: { icon: CircleCheck, color: "text-green-600" },
	Processing: { icon: CircleArrowRight02Icon, color: "text-amethyst-500" },
	Pending: { icon: MoreHorizontalCircle02Icon, color: "text-slate-500" },
	Error: { icon: CancelCircleIcon, color: "text-red-600" },
} as const;

function SimulationStep({
	stepNumber,
	description,
	transition,
	status,
}: {
	stepNumber: number;
	description: string;
	transition: string;
	status: "Completed" | "Processing" | "Pending" | "Error";
}) {
	const { icon, color } = STATUS_CONFIG[status];

	return (
		<div
			className={cn(
				"p-3 w-full flex gap-3 items-center text-slate-500 bg-slate-50 border rounded-lg border-slate-300",
				status === "Processing" &&
					" bg-amethyst-100 border-amethyst-300 font-bold",
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
				</span>
				{status !== "Pending" ? (
					<p className="text-slate-900">
						Transition:{" "}
						<span className="text-slate-900 font-bold">{transition}</span>
					</p>
				) : (
					<p className="text-slate-900">Pending...</p>
				)}
			</div>
		</div>
	);
}

export function SimulationOptions() {
	const setTransitionTable = useCanvas((s) => s.setTransitionTable);
	const showTransitionTable = useCanvas((s) => s.showTransitionTable);

	return (
		<>
			<Accordion
				className="h-[85%]"
				defaultValue={["simulation-status"]}
				multiple
			>
				<AccordionItem value="simulation-status" className="py-3">
					<AccordionTrigger className="flex gap-2 items-center mb-3">
						<HugeiconsIcon
							icon={StatusIcon}
							className="size-4 text-amethyst-500"
							strokeWidth={2.5}
						/>
						<h1 className="text-slate-900 font-bold uppercase">
							Simulation Status
						</h1>
					</AccordionTrigger>
					<AccordionContent className="flex flex-col gap-3">
						<div className="p-3 w-full flex flex-col  text-amethyst-500 bg-amethyst-100 border rounded-lg border-slate-300">
							<h2 className="w-4/5 font-semibold">Current State:</h2>
							<span className="text-slate-900 text-lg font-bold">q0</span>
						</div>
						<div className="h-11 px-3 w-full flex items-center gap-3 text-amethyst-500 bg-amethyst-50 border rounded-lg border-slate-300 animate-pulse">
							<HugeiconsIcon
								icon={CircleArrowReload01Icon}
								className="size-5 text-amethyst-500"
								strokeWidth={2.5}
							/>
							<span className="w-4/5 font-semibold">Processing...</span>
						</div>
						<Separator orientation="horizontal" />
						<h2 className="uppercase text-slate-500 text-xs font-bold">
							Execution Trace
						</h2>
						<div className="flex flex-col gap-3 border-l-2 border-slate-500 border-dashed h-full pl-3">
							<SimulationStep
								status="Completed"
								stepNumber={1}
								description="Input 'a'"
								transition="q0 ➜ q1"
							/>
							<SimulationStep
								status="Processing"
								stepNumber={2}
								description="Input 'b'"
								transition="q0 ➜ q1"
							/>
							<SimulationStep
								status="Error"
								stepNumber={3}
								description="Input 'b'"
								transition="q0 ➜ q1"
							/>
							<SimulationStep
								status="Pending"
								stepNumber={4}
								description="Input 'b'"
								transition="q0 ➜ q1"
							/>
						</div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
			<Separator orientation="horizontal" className="mb-3" />
			<div className="flex flex-col justify-end py-3 h-[15%]">
				<Button
					variant="outline"
					size="lg"
					className="h-12 px-10 w-full flex items-center hover:bg-amethyst-600/10 hover:text-amethyst-600 bg-transparent text-amethyst-600  border-amethyst-600"
					onClick={() => setTransitionTable(!showTransitionTable)}
				>
					<HugeiconsIcon className="size-5" icon={TableIcon} />
					<span className="w-4/5 font-bold">View Transition Table</span>
				</Button>
			</div>
		</>
	);
}
