"use client";
import { IconPower, IconShoppingBag, IconUser } from "@tabler/icons-react";
import { SetStateAction } from "jotai";
import { useRouter } from "next/navigation";
import React from "react";
import { ButtonLoader } from "~/components/ui/button/button.loader";
import { useLogout } from "~/hook/useAuth";
import { Menu } from "~/interface";

export const profileMenu: Array<Menu> = [
    {
        title: "My Account",
        link: "/account",
        icon: <IconUser size={24} stroke={2} />,
    },
    {
        title: "Cart",
        link: "/cart",
        icon: <IconShoppingBag size={24} stroke={2} />,
    },
];
export function ProfileMenu({
    setOpenMenu,
}: {
    setOpenMenu: React.Dispatch<SetStateAction<"NOTIFICATION" | "MESSAGE" | "PROFILE" | null>>;
}) {
    const router = useRouter();
    const { loadingLogout, handleLogout } = useLogout();
    const logout = async () => {
        await handleLogout();
    };
    return (
        <div
            onMouseEnter={() => setOpenMenu("PROFILE")}
            onMouseLeave={() => setOpenMenu(null)}
            className="absolute top-full w-full min-w-56 right-0"
        >
            <div className="w-full h-full bg-gray-100 border border-gray-300 rounded-lg shadow overflow-hidden">
                <div className="flex flex-col">
                    {profileMenu.map((menu, i) => (
                        <button
                            className="px-2 py-3 border-b border-gray-300 flex items-center justify-start gap-2 text-gray-600 cursor-pointer hover:bg-gray-300 transition-all ease-in-out duration-200 font-medium text-sm"
                            key={i}
                            type="button"
                            onClick={() => router.push(menu.link)}
                        >
                            {menu.icon} {menu.title}
                        </button>
                    ))}
                    <button
                        className="px-2 py-3 border-b border-gray-300 flex items-center justify-start gap-2 cursor-pointer bg-red hover:bg-red-200 hover:text-red transition-all ease-in-out duration-200 font-medium text-sm text-yellow"
                        type="button"
                        onClick={logout}
                    >
                        {loadingLogout ? (
                            <ButtonLoader />
                        ) : (
                            <>
                                <IconPower size={24} stroke={2} /> <span>Sign Out</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
