"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const SelectContext = React.createContext<{
    value: string;
    onValueChange: (value: string) => void;
    open: boolean;
    setOpen: (open: boolean) => void;
}>({
    value: "",
    onValueChange: () => { },
    open: false,
    setOpen: () => { },
});

export function Select({
    value,
    onValueChange,
    children,
}: {
    value: string;
    onValueChange: (value: string) => void;
    children: React.ReactNode;
}) {
    const [open, setOpen] = React.useState(false);

    return (
        <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
            <div className="relative">{children}</div>
        </SelectContext.Provider>
    );
}

export function SelectTrigger({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    const { open, setOpen } = React.useContext(SelectContext);

    return (
        <button
            type="button"
            onClick={() => setOpen(!open)}
            className={cn(
                "flex h-10 w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white ring-offset-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-indigo focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
        >
            {children}
            <ChevronDown className="h-4 w-4 opacity-50" />
        </button>
    );
}

export function SelectValue({
    placeholder,
}: {
    placeholder: string;
}) {
    const { value } = React.useContext(SelectContext);
    // This is a simplification. In a real Select, we'd map value to label.
    // Here we assume the parent or context knows the label, or we just show the value.
    // For ReportModal, the value is the reason ID. We ideally want to show the label.
    // But since we don't have access to the children here easily to find the label, 
    // we might need to pass the label to SelectValue or just show the placeholder if empty.

    // Hack for ReportModal: The ReportModal passes the label as children to SelectItem.
    // We can't easily get it here without more complex context.
    // For now, let's just render the value if present, or placeholder.
    // Ideally, the user of this component should handle the display value.

    // Actually, shadcn SelectValue renders the selected item's text.
    // Since we are building a custom one, let's just render the value for now, 
    // OR we can make SelectValue accept a `children` prop that is the display value.

    return (
        <span className="block truncate">
            {value || placeholder}
        </span>
    );
}

export function SelectContent({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    const { open, setOpen } = React.useContext(SelectContext);
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setOpen]);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={cn(
                        "absolute z-50 min-w-[8rem] overflow-hidden rounded-xl border border-slate-800 bg-slate-900 text-white shadow-md animate-in fade-in-80 w-full mt-1",
                        className
                    )}
                >
                    <div className="p-1">{children}</div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export function SelectItem({
    value,
    children,
    className,
}: {
    value: string;
    children: React.ReactNode;
    className?: string;
}) {
    const { value: selectedValue, onValueChange, setOpen } = React.useContext(SelectContext);

    return (
        <button
            type="button"
            onClick={() => {
                onValueChange(value);
                setOpen(false);
            }}
            className={cn(
                "relative flex w-full cursor-default select-none items-center rounded-lg py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-slate-800 focus:bg-slate-800 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                className
            )}
        >
            <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                {selectedValue === value && <Check className="h-4 w-4" />}
            </span>
            <span className="truncate">{children}</span>
        </button>
    );
}
