import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS classes without style conflicts
 * @param {...(string|Object|Array)} inputs - Class names or conditional class objects
 * @returns {string} - Merged class list
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}