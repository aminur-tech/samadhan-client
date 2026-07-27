import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS classes conditionally without style conflicts.
 *
 * @param inputs - Array of class names, objects, or conditional class arrays
 * @returns Clean, deduplicated Tailwind CSS class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}