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
import { useCanvas } from "@store/canvas";
import { useSimulate } from "@store/simulate";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@ui/accordion";
import { Button } from "@ui/button";
import { Separator } from "@ui/separator";
import { cn } from "@/lib/utils";
import { SimulationStep } from "./simulation-step";

export const STATUS_CONFIG = {
	Completed: { icon: CircleCheck, color: "text-green-600" },
	Processing: { icon: CircleArrowRight02Icon, color: "text-amethyst-500" },
	Pending: { icon: MoreHorizontalCircle02Icon, color: "text-slate-500" },
	Error: { icon: CancelCircleIcon, color: "text-red-600" },
} as const;

type TraceStatus = keyof typeof STATUS_CONFIG;
type TraceStep = {
	currentStates: string[];
	symbol: string;
	nextStates: string[];
	isInvalidTransition?: boolean;
};

function getTraceStatus(
	stepIndex: number,
	currentStepIndex: number,
	lastStepIndex: number,
	invalidStepIndex: number,
): TraceStatus {
	if (invalidStepIndex >= 0) {
		if (stepIndex === invalidStepIndex) return "Error";

		return stepIndex < invalidStepIndex ? "Completed" : "Pending";
	}

	if (stepIndex < currentStepIndex || currentStepIndex === lastStepIndex)
		return "Completed";

	if (stepIndex === currentStepIndex) return "Processing";

	return "Pending";
}

function getTraceDescription(step: TraceStep): string {
	return step.symbol === "END" ? "Final state" : `Input '${step.symbol}'`;
}

function getTraceTransition(step: TraceStep): string {
	if (step.isInvalidTransition) return "Invalid";
	if (step.symbol === "END") return step.currentStates.join(", ");
	return `${step.currentStates.join(", ")} ➜ ${step.nextStates.join(", ")}`;
}

function getResultLabel(accepted: boolean, hasInvalidTransition: boolean) {
	if (accepted) return "Accepted";
	return hasInvalidTransition ? "Rejected (Invalid)" : "Rejected";
}

export function SimulationOptions() {
	const setTransitionTable = useCanvas((s) => s.setTransitionTable);
	const showTransitionTable = useCanvas((s) => s.showTransitionTable);
	const simulateResult = useSimulate((s) => s.result);
	const simulateStep = useSimulate((s) => s.step);

	const steps: TraceStep[] = simulateResult?.steps ?? [];
	const currentStep = steps[simulateStep];
	const invalidStepIndex = steps.findIndex((step) => step.isInvalidTransition);
	const hasInvalidTransition = invalidStepIndex >= 0;
	const displaySteps = hasInvalidTransition
		? steps.slice(0, invalidStepIndex + 1)
		: steps;
	const lastStepIndex = displaySteps.length - 1;
	const finalStateLabel = getResultLabel(
		simulateResult?.accepted ?? false,
		hasInvalidTransition,
	);
	const executionStatus =
		simulateStep < lastStepIndex ? "Processing" : "Completed";

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
						<div className="p-3 w-full flex flex-col gap-1 text-amethyst-500 bg-amethyst-100 border rounded-lg border-slate-300">
							<div className="flex flex-1">
								<h2 className="w-4/5 font-semibold">Current States:</h2>
								{simulateResult && simulateStep === lastStepIndex && (
									<span
										className={
											"w-1/2 text-center rounded-full px-2 py-0.5 text-tiny font-bold uppercase tracking-wide " +
											(simulateResult.accepted && !hasInvalidTransition
												? "bg-green-100 text-green-700"
												: "bg-red-100 text-red-700")
										}
									>
										{finalStateLabel}
									</span>
								)}
							</div>
							<span className="text-slate-900 text-lg font-bold">
								{currentStep?.currentStates?.join(", ")}
							</span>
						</div>
						<div
							className={cn(
								"h-11 px-3 w-full flex items-center gap-3 text-amethyst-500 bg-amethyst-50 border rounded-lg border-slate-300 ",
								executionStatus === "Processing" && "animate-pulse",
							)}
						>
							<HugeiconsIcon
								icon={CircleArrowReload01Icon}
								className="text-amethyst-500 size-5"
								strokeWidth={2.5}
							/>
							<span className="w-4/5 font-semibold">{executionStatus}</span>
						</div>
						<Separator orientation="horizontal" />
						<h2 className="uppercase text-slate-500 text-xs font-bold">
							Execution Trace
						</h2>
						<div className="flex flex-col gap-3 border-l-2 border-slate-500 border-dashed h-full pl-3">
							{displaySteps.map((step, i) => (
								<div
									key={`${step.symbol}-${i}`}
									className="flex flex-col gap-2"
								>
									<SimulationStep
										status={getTraceStatus(
											i,
											simulateStep,
											lastStepIndex,
											invalidStepIndex,
										)}
										stepNumber={i + 1}
										description={getTraceDescription(step as TraceStep)}
										transition={getTraceTransition(step as TraceStep)}
									/>
								</div>
							))}
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
