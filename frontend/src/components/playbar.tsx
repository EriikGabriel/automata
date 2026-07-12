/** biome-ignore-all lint/suspicious/noArrayIndexKey: <""> */
import {
	ArrowLeft01Icon,
	ArrowRight01Icon,
	DashboardSpeed02Icon,
	NextIcon,
	PlayCircleIcon,
	PreviousIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useSimulate } from "@store/simulate";
import { Button } from "@ui/button";
import { Progress } from "@ui/progress";
import { useEffect, useRef } from "react";

export function Playbar() {
	const input = useSimulate((s) => s.input);
	const step = useSimulate((s) => s.step);
	const setStep = useSimulate((s) => s.setStep);
	const totalSteps = input.length;

	const charRefs = useRef<(HTMLSpanElement | null)[]>([]);

	useEffect(() => {
		charRefs.current[step]?.scrollIntoView({
			block: "nearest",
			inline: "center",
		});
	}, [step]);

	const prev = () => setStep(Math.max(0, step - 1));
	const next = () => setStep(Math.min(totalSteps - 1, step + 1));
	const toStart = () => setStep(0);
	const toEnd = () => setStep(totalSteps - 1);

	return (
		<div className="bg-white border-t h-20 w-full absolute bottom-0 z-5 flex justify-center items-center px-30 gap-10">
			<div className="flex gap-3 items-center">
				<Button
					variant="ghost"
					size="icon-lg"
					className=" hover:*:text-amethyst-500"
					onClick={toStart}
				>
					<HugeiconsIcon
						icon={PreviousIcon}
						strokeWidth={2}
						className="text-slate-500 size-6"
						aria-label="Begin"
					/>
				</Button>
				<Button
					variant="ghost"
					size="icon-lg"
					className="hover:*:text-amethyst-500"
					onClick={prev}
				>
					<HugeiconsIcon
						icon={ArrowLeft01Icon}
						strokeWidth={2}
						className="text-slate-500 size-6"
						aria-label="Previous"
					/>
				</Button>
				<Button
					variant="ghost"
					size="icon-lg"
					className="hover:*:text-amethyst-500"
				>
					<HugeiconsIcon
						icon={PlayCircleIcon}
						strokeWidth={1.5}
						className="text-slate-500 hover:fill-slate-500 size-8"
						aria-label="Play"
					/>
				</Button>
				<Button
					variant="ghost"
					size="icon-lg"
					className="hover:*:text-amethyst-500"
					onClick={next}
				>
					<HugeiconsIcon
						icon={ArrowRight01Icon}
						strokeWidth={2}
						className="text-slate-500 hover:fill-slate-500 size-6"
						aria-label="Next"
					/>
				</Button>
				<Button
					variant="ghost"
					size="icon-lg"
					className="hover:*:text-amethyst-500"
					onClick={toEnd}
				>
					<HugeiconsIcon
						icon={NextIcon}
						strokeWidth={2}
						className="text-slate-500 hover:fill-slate-500 size-6"
						aria-label="End"
					/>
				</Button>
			</div>
			<div className="w-1/2 flex flex-col gap-2 items-center">
				<div className="w-full flex items-center justify-between gap-2 text-slate-500">
					<div className="flex gap-1 font-mono text-sm overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden w-[85%]">
						{input.split("").map((char, i) => (
							<button
								type="button"
								key={`${char}-${i}`}
								ref={(el) => {
									charRefs.current[i] = el;
								}}
								onClick={() => setStep(i)}
								className={
									"cursor-pointer " +
									(i === step
										? "text-amethyst-500 underline font-bold"
										: i < step
											? "text-amethyst-500"
											: "text-slate-500")
								}
							>
								{char}
							</button>
						))}
					</div>
					<small>
						Step {step + 1} of {totalSteps}
					</small>
				</div>
				<Progress
					value={(step / (totalSteps - 1)) * 100}
					className="w-full border border-slate-300 rounded"
				/>
			</div>
			<Button
				variant="secondary"
				size="lg"
				className="border border-slate-300 text-slate-500 w-40"
			>
				<HugeiconsIcon
					icon={DashboardSpeed02Icon}
					strokeWidth={1.5}
					className="text-slate-500 hover:fill-slate-500 size-6"
					aria-label="Start"
				/>
				2x Speed
			</Button>
		</div>
	);
}
