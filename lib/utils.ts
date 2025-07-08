import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  } catch {
    return "N/A"
  }
}

export function calculateProgress(tasks: { completed: boolean }[]): number {
  if (tasks.length === 0) return 0
  const completed = tasks.filter((task) => task.completed).length
  return Math.round((completed / tasks.length) * 100)
}
