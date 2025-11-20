import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    hoverEffect?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, hoverEffect = true, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "bg-background-card/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 transition-all duration-300",
                    hoverEffect && "hover:scale-[1.02] hover:shadow-xl hover:shadow-accent-indigo/10 hover:border-accent-indigo/30",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);
Card.displayName = "Card";

export { Card };
