"use client";

import { useAccount, useAuth } from "~/hook/useAuth";
import { PageLoading } from "../ui/loading/page.loading";
import { Navbar } from "../layout/navbar";
import { Sidebar } from "../layout/sidebar";
import { useAtom } from "jotai";
import { sidebarAtom } from "~/store";

export function Dashboard() {
    const { isLogin } = useAuth();
    const { account, isFetchAccount, isLoadingAccount, isRefetchingAccount } = useAccount();

    const [sidebar] = useAtom(sidebarAtom);
    // Tampilkan loading saat cek session atau proses login
    if (isLoadingAccount) {
        return <PageLoading />;
    }

    // Jika sudah login, jangan render form (redirect di useAuth)
    if (!isLogin) {
        return <PageLoading />;
    }

    return (
        <div className="flex items-start w-full relative">
            {sidebar && <Sidebar account={account} />}
            <section className="w-full h-[200svh]">
                <Navbar
                    account={account}
                    isFetchingAccount={isFetchAccount}
                    isRefetchingAccount={isRefetchingAccount}
                />
                <main className="p-5">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus molestias eaque illo ex tempore
                    non a cupiditate, ratione nostrum nobis, corporis rerum eum rem vel veniam quo amet, voluptatibus
                    ducimus.
                </main>
            </section>
        </div>
    );
}
