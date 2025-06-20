"use client";

import { IconMenu2 } from "@tabler/icons-react";
import { useState } from "react";
import { dataMenu, MenuNavbar } from "./menu.navbar";
import { Brand } from "~/components/ui/brand";
import { useRouter } from "next/navigation";

export function NavbarAuth() {
    const [openMenu, setOpenMenu] = useState(false);
    const router = useRouter();
    return (
        <header className="w-full">
            <nav className="bg-white border-b border-gray-300 px-10 py-6 flex items-center justify-between gap-5 relative">
                <Brand />

                <div className="md:flex items-center justify-end hidden">
                    {dataMenu.map((menu, i) => (
                        <button
                            onClick={() => router.push(menu.link)}
                            className="flex items-center justify-start gap-3 py-3 text-red px-5 hover:text-red hover:bg-gray-100 transition-all ease-in-out duration-300 text-sm font-medium rounded-xl"
                            key={i}
                        >
                            <i>{menu.icon}</i> <span>{menu.title}</span>
                        </button>
                    ))}
                </div>
                <button
                    onClick={() => setOpenMenu(!openMenu)}
                    className="flex md:hidden items-center justify-center w-10 h-10 rounded border border-gray-300 bg-gray-200 text-red hover:bg-gray-300 hover:scale-95 transition-all ease-in-out duration-300"
                >
                    <IconMenu2 size={25} stroke={1.5} />
                </button>
                {openMenu && <MenuNavbar />}
            </nav>
        </header>
    );
}
