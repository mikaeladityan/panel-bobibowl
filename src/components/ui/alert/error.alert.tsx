// components/ui/alert/error-alert.tsx
"use client";

import { IconAlertCircle, IconX } from "@tabler/icons-react";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { errorAtom, setErrorAtom } from "~/store";
import { SlideInContainer } from "./section.alert";

export function ErrorAlert() {
    const error = useAtomValue(errorAtom);
    const setError = useSetAtom(setErrorAtom);
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = useCallback(() => {
        setIsClosing(true);
        setTimeout(() => {
            setError({ message: "", errors: [] });
            setIsClosing(false);
        }, 400);
    }, [setError]);
    useEffect(() => {
        if (error.message || (error.errors && error.errors.length > 0)) {
            const timer = setTimeout(() => {
                handleClose();
            }, 6000);
            return () => clearTimeout(timer);
        }
    }, [error, handleClose]);

    if (!error.message && (!error.errors || error.errors.length === 0)) return null;

    return (
        <SlideInContainer>
            <div
                className={`max-w-md w-full bg-white border border-red-200 shadow-xl rounded-xl overflow-hidden transition-all duration-400 ${
                    isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
                }`}
            >
                <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-red to-red-300 text-white">
                    <div className="flex items-center gap-2">
                        <IconAlertCircle size={20} />
                        <h3 className="font-bold">Error</h3>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-1 text-red rounded-full hover:text-red-900 transition-colors"
                    >
                        <IconX size={18} />
                    </button>
                </div>

                <div className="px-4 py-3 text-gray-700">
                    {error.errors && error.errors.length > 0 ? (
                        <ul className="space-y-2">
                            {error.errors.map((err, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <div className="text-red mt-0.5">
                                        <IconAlertCircle size={16} />
                                    </div>
                                    <span className="text-sm">{err.message}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm">{error.message}</p>
                    )}
                </div>

                {/* Progress bar */}
                <div className="h-1 w-full bg-red-100 overflow-hidden">
                    <div className="h-full bg-red animate-progress"></div>
                </div>
            </div>
        </SlideInContainer>
    );
}
