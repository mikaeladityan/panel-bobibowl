import React from "react";
import { twMerge } from "tailwind-merge";

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={twMerge("p-5 bg-gray-50 border border-gray-300 rounded-lg shadow", className)}>{children}</div>
    );
}
