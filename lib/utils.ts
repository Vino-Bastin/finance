import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertAmountToMilliunit(amount: number): number {
  return Math.round(amount * 1000);
}

export function convertMilliunitToAmount(milliunit: number): number {
  return milliunit / 1000;
}
