import {
  AnchorPointIcon,
  CodeIcon,
  Copy01Icon,
  MagicWand01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ui/accordion"
import { Badge } from "@ui/badge"
import { Button } from "@ui/button"
import { Field, FieldLabel } from "@ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select"
import { Textarea } from "@ui/textarea"

export function GeneralOptions() {
  return (
    <Accordion defaultValue={["generate-regex", "generate-automata"]} multiple>
      <AccordionItem value="generate-regex" className="py-3">
        <AccordionTrigger className="flex gap-2 items-center mb-3">
          <HugeiconsIcon
            icon={CodeIcon}
            className="size-4 text-amethyst-500"
            strokeWidth={2.5}
          />
          <h2 className="text-slate-900 font-bold uppercase">
            Generated Regex
          </h2>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-3">
          <Button
            size="lg"
            className="h-12 px-10 w-full flex items-center hover:bg-amethyst-600/80 transition-all shadow shadow-amethyst-400"
          >
            <HugeiconsIcon className="size-5" icon={MagicWand01Icon} />
            <span className="w-4/5 font-bold">Generate Regex</span>
          </Button>
          <div className="h-11 px-3 text-xs w-full flex items-center justify-between text-amethyst-500 bg-slate-50 border rounded-lg border-slate-200">
            <span className="w-4/5 font-semibold font-mono">a*b(a|b)*</span>
            <Button
              size="icon-lg"
              className="text-slate-400 hover:text-slate-500"
              variant="link"
            >
              <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} />
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="generate-automata" className="py-3">
        <AccordionTrigger className="flex gap-2 items-center mb-3">
          <HugeiconsIcon
            icon={AnchorPointIcon}
            className="size-4 text-amethyst-500"
            strokeWidth={2.5}
          />
          <h2 className="text-slate-900 font-bold uppercase">
            Generated Automata
          </h2>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-3">
          <Field className="relative">
            <FieldLabel
              htmlFor="regex-value"
              className="uppercase text-slate-500 text-xs font-bold"
            >
              Regular Expression
            </FieldLabel>
            <Textarea
              id="regex-value"
              className="h-32 px-3 pt-3 text-xs w-full text-gray-500 bg-slate-50 border rounded-lg border-slate-200 resize-none focus-visible:ring-0 font-semibold font-mono placeholder:font-normal"
              placeholder="e.g. (a|b)*abb"
              required
            />
            <div>
              <Badge className="font-bold rounded-sm text-tiny bg-amethyst-100 text-amethyst-500 uppercase absolute bottom-4 right-5 z-10 pointer-events-none">
                Regex
              </Badge>
            </div>
          </Field>

          <Field>
            <FieldLabel
              htmlFor="automata-model-type"
              className="uppercase text-slate-500 text-xs font-bold"
            >
              Automata Model Type
            </FieldLabel>
            <Select id="automata-model-type" defaultValue="DFA">
              <SelectTrigger className="w-45 text-slate-500 bg-slate-50">
                <SelectValue placeholder="Model Type" />
              </SelectTrigger>
              <SelectContent className="text-slate-500 text-xs">
                <SelectGroup>
                  <SelectItem value="DFA">DFA (Deterministic)</SelectItem>
                  <SelectItem value="NFA">NFA (Non Deterministic)</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          <div className="flex flex-col gap-3 pt-3 ">
            <h2 className="uppercase text-slate-500 text-xs font-bold">
              Advanced Rules
            </h2>
            <div className="grid grid-cols-2 grid-rows-2 align-middle text-slate-500 text-xs font-mono">
              <p>Alphabet (Σ)</p>
              <span className="bg-slate-100 border border-slate-200 h-fit p-1 rounded">
                {"{a, b}"}
              </span>
              <p>Epsilon (ε) moves</p>
              <p className="bg-slate-100 border border-slate-200 h-fit p-1 rounded">
                {String(true)}
              </p>
            </div>
          </div>

          <Button
            size="lg"
            className="h-12 px-10 w-full flex items-center hover:bg-amethyst-600/80 transition-all shadow shadow-amethyst-400"
          >
            <HugeiconsIcon className="size-5" icon={MagicWand01Icon} />
            <span className="w-4/5 font-bold">Generate Automata</span>
          </Button>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
