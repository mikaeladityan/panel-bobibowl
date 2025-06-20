"use client";
import { usePathname } from "next/navigation";
import React from "react";
import { AuthFooterLayout } from "~/components/auth/layout/footer";
import { AuthHeaderLayout } from "~/components/auth/layout/header";
import { NavbarAuth } from "~/components/layout/navbar/auth.navbar";

export default function AuthTemplate({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const authPath: string[] = ["/login", "/register"];
    return (
        <>
            <NavbarAuth />
            <main className="min-h-[80svh] w-full sm:w-10/12 md:w-8/12 lg:w-6/12 xl:w-5/12 mx-auto flex items-center justify-center flex-col gap-y-3">
                {authPath.includes(pathname) && <AuthHeaderLayout />}
                {children}
                {authPath.includes(pathname) && <AuthFooterLayout />}
            </main>
        </>
    );
}
