// components/ui/alert/slide-container.tsx
"use client";

import { useEffect, useState } from "react";

export const SlideInContainer = ({ children }: { children: React.ReactNode }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger animation after component mounts
        const timer = setTimeout(() => setIsVisible(true), 10);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            className={`fixed top-4 right-4 z-50 transition-all duration-500 ease-out ${
                isVisible ? "translate-x-0 opacity-100" : "translate-x-[120%] opacity-0"
            }`}
        >
            {children}
        </div>
    );
};
