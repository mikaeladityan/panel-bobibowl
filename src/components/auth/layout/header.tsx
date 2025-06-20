"use client";
import { usePathname } from "next/navigation";

export function AuthHeaderLayout() {
    const pathname = usePathname();
    return (
        <div className="flex flex-col gap-y-1 items-start justify-start w-11/12 mx-auto">
            <h1 className="font-bold text-2xl text-start">{pathname === "/login" ? "Sign In" : "Sign Up"}</h1>
            <p className="text-sm text-gray-500">Welcome! Please join our membership to get started.</p>
        </div>
    );
}
