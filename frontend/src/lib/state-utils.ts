type StateVariant = "initial" | "final" | "default" | "initial-final"

/**
 * Checks if a state is an initial state
 */
export function isInitialState(variant?: StateVariant): boolean {
  return variant === "initial" || variant === "initial-final"
}

/**
 * Checks if a state is a final/acceptance state
 */
export function isFinalState(variant?: StateVariant): boolean {
  return variant === "final" || variant === "initial-final"
}

/**
 * Gets the variant based on initial and final flags
 */
export function getStateVariant(
  isInitial: boolean,
  isFinal: boolean,
): StateVariant {
  if (isInitial && isFinal) return "initial-final"
  if (isInitial) return "initial"
  if (isFinal) return "final"
  return "default"
}
