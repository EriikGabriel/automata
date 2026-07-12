type TransitionTable = Record<string, Record<string, string[]>>

export type Step = {
  currentStates: string[]
  symbol: string
  nextStates: string[]
}

export type SimulationResult = {
  accepted: boolean
  steps: Step[]
}

/** Returns all states reachable from the given states via ε-transitions only. */
function epsilonClosure(states: string[], table: TransitionTable): string[] {
  const closure = new Set(states)

  for (const state of closure) {
    const epsilonTargets = table[state]?.["ε"] ?? table[state]?.["e"] ?? []

    for (const next of epsilonTargets) {
      closure.add(next)
    }
  }

  return [...closure]
}

/** Returns the set of states reachable from the given states via a symbol transition. */
function move(
  states: string[],
  symbol: string,
  table: TransitionTable,
): string[] {
  return [...new Set(states.flatMap((state) => table[state]?.[symbol] ?? []))]
}

/** Simulates an AFND over the given input and returns each step and the acceptance result. */
export function simulate(
  input: string,
  initial: string,
  finals: string[],
  table: TransitionTable,
): SimulationResult {
  const steps: Step[] = []

  let currentStates = epsilonClosure([initial], table)

  for (const symbol of input) {
    const reachable = move(currentStates, symbol, table)
    const nextStates = epsilonClosure(reachable, table)

    steps.push({ currentStates, symbol, nextStates })
    currentStates = nextStates
  }

  const accepted = currentStates.some((state) => finals.includes(state))

  return { accepted, steps }
}
