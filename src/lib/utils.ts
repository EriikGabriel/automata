import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/*
 * Utility function to merge class names.
 *
 * @param inputs - Class values to merge.
 * @returns The merged class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
