"use client";

import { IconArticle, IconHome2, IconLogin2 } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu } from "~/interface";

export const dataMenu: Array<Menu> = [
    {
        title: "Home",
        link: process.env.NEXT_PUBLIC_HOME!,
        icon: <IconHome2 size={24} stroke={2} />,
    },
    // {
    //     title: "Cara Kerja",
    //     link: "/care-kerja",
    //     icon: <IconQuestionMark size={24} stroke={2} />,
    // },
    // {
    //     title: "Keranjang",
    //     link: "/cart",
    //     icon: <IconShoppingBag size={24} stroke={2} />,
    // },
    {
        title: "Artikel",
        link: "/artikel",
        icon: <IconArticle size={24} stroke={2} />,
    },
];

export function MenuNavbar() {
    const router = useRouter();
    const pathname = usePathname();
    return (
        <div className="absolute block md:hidden w-full mx-auto left-0 right-0 h-auto top-full bg-white rounded-b-xl border border-gray-300 shadow z-10 overflow-hidden">
            <div className="flex flex-col">
                {dataMenu.map((menu, i) => (
                    <button
                        onClick={() => router.push(menu.link)}
                        className="flex items-center justify-start gap-3 py-3 border-b border-gray-300 hover:text-red hover:bg-gray-200 transition-all ease-in-out duration-300 px-8 text-sm font-medium"
                        key={i}
                    >
                        <i>{menu.icon}</i> <span>{menu.title}</span>
                    </button>
                ))}

                <Link
                    href={pathname === "/login" ? "/register" : "/login"}
                    className="flex items-center justify-start gap-3 py-3 border-b border-gray-300 bg-red text-gray-300 px-8 text-sm font-semibold"
                >
                    <IconLogin2 size={24} stroke={2} />
                    {pathname === "/login" ? "Daftar" : "Masuk"}
                </Link>
            </div>
        </div>
    );
}
