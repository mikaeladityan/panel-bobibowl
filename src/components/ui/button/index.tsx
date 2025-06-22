import React from "react";
import { twMerge } from "tailwind-merge";

type propsButton = {
    type: HTMLButtonElement["type"];
    className?: string;
    disabled?: boolean;
    onClick?: () => void;
    children: React.ReactNode;
};
export function Button({ children, type = "button", className, disabled, onClick }: propsButton) {
    return (
        <button
            type={type}
            className={twMerge(
                "w-full px-5 bg-yellow text-red font-bold text-sm text-center py-2.5 rounded-lg uppercase flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed",
                className
            )}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    );
}
