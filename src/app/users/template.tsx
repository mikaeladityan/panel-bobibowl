"use client";

import { useAccount, useRole } from "~/hook/useAuth";
import { useAtom } from "jotai";
import { sidebarAtom } from "~/store";
import { PageLoading } from "~/components/ui/loading/page.loading";
import React from "react";
import { Sidebar } from "~/components/layout/sidebar";
import { Navbar } from "~/components/layout/navbar";

export default function UsersTemplate({ children }: { children: React.ReactNode }) {
    // const { isLogin } = useAuth();
    useRole(["OWNER", "DEVELOPER", "SUPER_ADMIN"]);
    const { account, isFetchAccount, isLoadingAccount, isRefetchingAccount } = useAccount();

    const [sidebar] = useAtom(sidebarAtom);
    // Tampilkan loading saat cek session atau proses login
    if (isLoadingAccount) {
        return <PageLoading />;
    }

    return (
        <div className="flex items-start w-full relative">
            {sidebar && <Sidebar account={account} />}
            <div className="w-full min-h-svh bg-gray-200">
                <Navbar
                    account={account}
                    isFetchingAccount={isFetchAccount}
                    isRefetchingAccount={isRefetchingAccount}
                />
                <main className="p-5">{children}</main>
            </div>
        </div>
    );
}
