import React from "react";
import { twMerge } from "tailwind-merge";

export function Card({
    children,
    className,
    onMouseEnter,
    onMouseLeave,
}: {
    children: React.ReactNode;
    className?: string;
    onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
    onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
}) {
    return (
        <div
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={twMerge("p-5 bg-gray-50 border border-gray-300 rounded-lg shadow", className)}
        >
            {children}
        </div>
    );
}
