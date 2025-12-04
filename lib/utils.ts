import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatRelativeTime(date: Date | string | number | undefined | null): string {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    return formatDistanceToNow(d, { addSuffix: true });
}

export function truncate(str: string, length: number = 30): string {
    if (!str) return "";
    if (str.length <= length) return str;
    return str.slice(0, length) + "...";
}
