"use client";

import { useEffect, useState } from "react";
import { IconLoader3 } from "@tabler/icons-react";
import { motion as m, AnimatePresence } from "framer-motion";
import { Brand } from "../brand";

export function ComponentLoading({ isLoading }: { isLoading: boolean }) {
    const [dots, setDots] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length >= 5 ? "" : prev + "."));
        }, 100);

        return () => clearInterval(interval);
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <m.div
                    key="loader"
                    initial={{ y: 0 }}
                    animate={{ y: 0 }}
                    exit={{ y: "-100%", transition: { duration: 0.5 } }}
                    className="fixed top-0 left-0 right-0 flex items-center justify-center w-full max-w-screen h-screen bg-gray-100 text-gray-900 z-40"
                >
                    <div className="flex flex-col items-center justify-center gap-3">
                        <div className="scale-150 mb-5">
                            <Brand />
                        </div>
                        <IconLoader3 size={40} stroke={2} className="animate-spin" />
                        <span className="font-semibold text-lg">Loading{dots}</span>
                    </div>
                </m.div>
            )}
        </AnimatePresence>
    );
}
