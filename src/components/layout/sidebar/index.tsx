"use client";
import {
    IconCategoryPlus,
    IconGift,
    IconHeartHandshake,
    IconHome2,
    IconSpeakerphone,
    IconX,
    IconLogout,
    IconSettings,
    IconLockAccess,
    IconUsers,
} from "@tabler/icons-react";
import { useSetAtom } from "jotai";
import { usePathname, useRouter } from "next/navigation";
import { Brand } from "~/components/ui/brand";
import { Menu } from "~/interface";
import { sidebarAtom } from "~/store";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AccountResDTO } from "~/interface/account";

const sidebarMenu: Menu[] = [
    {
        icon: <IconHome2 size={28} stroke={1.5} />,
        title: "Home",
        link: "/",
    },
    {
        icon: <IconGift size={28} stroke={1.5} />,
        title: "Menu",
        link: "/admin/menus",
    },
    {
        icon: <IconSpeakerphone size={28} stroke={1.5} />,
        title: "Promotion",
        link: "/admin/promotions",
    },
    {
        icon: <IconHeartHandshake size={28} stroke={1.5} />,
        title: "Types",
        link: "/admin/types",
    },
    {
        icon: <IconCategoryPlus size={28} stroke={1.5} />,
        title: "Categories",
        link: "/admin/categories",
    },
    {
        icon: <IconUsers size={28} stroke={1.5} />,
        title: "Users",
        link: "/admin/users",
    },
    {
        icon: <IconLockAccess size={28} stroke={1.5} />,
        title: "Reports",
        link: "/admin/reports",
    },
];

export function Sidebar({ account }: { account: AccountResDTO | undefined }) {
    const router = useRouter();
    const pathname = usePathname();
    const setSidebar = useSetAtom(sidebarAtom);
    const [activeLink, setActiveLink] = useState("");
    const [isClosing, setIsClosing] = useState(false);

    // Set active link based on current path
    useEffect(() => {
        setActiveLink(pathname);
    }, [pathname]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setSidebar(false);
            setIsClosing(false);
        }, 300);
    };

    const navigate = (link: string) => {
        router.push(link);
        if (window.innerWidth < 1280) {
            handleClose();
        }
    };
    const getUserName = () => {
        if (account?.user.firstName) {
            return `${account.user.firstName}`;
        }
        return account?.email.split("@")[0];
    };

    return (
        <motion.aside
            initial={{ x: "-100%" }}
            animate={isClosing ? { x: "-100%" } : { x: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="w-80 xl:w-4/12 bg-gradient-to-b from-gray-300 to-white flex flex-col fixed xl:sticky top-0 left-0 h-screen overflow-y-auto overflow-x-hidden z-20 shadow-xl"
        >
            {/* Close Button */}
            <button
                onClick={handleClose}
                className="xl:hidden absolute top-5 right-5 bg-red/20 hover:bg-red/30 rounded-full flex items-center justify-center w-10 h-10 transition-all duration-300"
            >
                <IconX className="text-red" size={24} />
            </button>

            {/* Header */}
            <div className="bg-transparent w-full flex flex-col items-center px-5 py-8">
                <Brand />

                {/* User Profile Card */}
                <div className="w-full bg-red/10 backdrop-blur-sm rounded-xl p-4 mt-5 flex items-center gap-4 border border-red/20">
                    <div className="bg-red/20 border-2 border-red/30 rounded-full w-12 h-12 flex items-center justify-center">
                        <span className="text-red font-bold text-lg">U</span>
                    </div>
                    <div>
                        <h3 className="text-red font-semibold capitalize">{getUserName()}</h3>
                        <p className="text-red/80 text-sm">{account?.role}</p>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <div className="flex-1 flex flex-col p-4 gap-1 mt-2">
                {sidebarMenu.map((menu, i) => (
                    <motion.button
                        key={i}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(menu.link)}
                        type="button"
                        disabled={menu.title === "Reports"}
                        className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:scale-100 ${
                            activeLink === menu.link ? "bg-red text-white shadow-lg" : "text-red/90 hover:bg-red/10"
                        }`}
                    >
                        <div className={`${activeLink === menu.link ? "text-white" : "text-red"}`}>{menu.icon}</div>
                        <span className="font-medium text-lg">{menu.title}</span>
                    </motion.button>
                ))}
            </div>

            {/* Footer Section */}
            <div className="p-4 border-t border-red/20 mt-auto">
                <button
                    onClick={() => navigate("/admin/settings")}
                    className="w-full flex items-center gap-4 px-5 py-3 rounded-xl text-red/90 hover:bg-red/10 transition-all duration-300"
                >
                    <IconSettings size={24} stroke={1.5} />
                    <span className="font-medium">Pengaturan</span>
                </button>

                <button
                    onClick={() => navigate("/logout")}
                    className="w-full flex items-center gap-4 px-5 py-3 rounded-xl text-red/90 hover:bg-red-500/20 hover:text-red-100 transition-all duration-300"
                >
                    <IconLogout size={24} stroke={1.5} />
                    <span className="font-medium">Keluar</span>
                </button>
            </div>
        </motion.aside>
    );
}
