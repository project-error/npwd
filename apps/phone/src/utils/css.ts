import {clsx, type ClassValue} from "clsx";
import {twMerge} from "tailwind-merge";

export const classNames = (...classes: string[]) => classes.filter(Boolean).join(' ');

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}