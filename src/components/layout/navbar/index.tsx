import {
    IconBell,
    IconMenu2,
    IconMessage,
    IconX,
    IconHome,
    IconChevronRight,
    IconLoader3,
    IconChevronLeft,
} from "@tabler/icons-react";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { AccountResDTO } from "~/interface/account";
import { ProfileMenu } from "./menu/profile.menu";

import { useAtom } from "jotai";
import { sidebarAtom } from "~/store";
import { TextLoading } from "~/components/ui/loading/text.loading";
import { usePathname } from "next/navigation";
import Link from "next/link";

type PropsNavbar = {
    account?: AccountResDTO;
    isFetchingAccount: boolean;
    isRefetchingAccount: boolean;
};

export function Navbar({ account, isFetchingAccount, isRefetchingAccount }: PropsNavbar) {
    const [activeMenu, setActiveMenu] = useState<"NOTIFICATION" | "MESSAGE" | "PROFILE" | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useAtom(sidebarAtom);
    const pathname = usePathname();

    // Refs to detect outside clicks
    const notificationRef = useRef<HTMLDivElement>(null);
    const messageRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setActiveMenu((prev) => (prev === "NOTIFICATION" ? null : prev));
            }
            if (messageRef.current && !messageRef.current.contains(event.target as Node)) {
                setActiveMenu((prev) => (prev === "MESSAGE" ? null : prev));
            }
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setActiveMenu((prev) => (prev === "PROFILE" ? null : prev));
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Toggle menu open/close
    const toggleMenu = (menu: "NOTIFICATION" | "MESSAGE" | "PROFILE") => {
        setActiveMenu((prev) => (prev === menu ? null : menu));
    };

    // Get display name
    const getDisplayName = () => {
        if (account?.user.firstName) {
            return `${account.user.firstName} ${account.user.lastName || ""}`.trim();
        }
        return account?.email.split("@")[0] || "";
    };

    // Build breadcrumbs from URL
    const generateBreadcrumbs = () => {
        const pathSegments = pathname.split("?")[0].split("/").filter(Boolean);
        const pathLabels: Record<string, string> = {
            admin: "Dashboard",
            products: "Products",
            services: "Services",
            categories: "Categories",
            components: "Components",
            reports: "Reports",
            create: "Create New",
            edit: "Edit",
            users: "Users",
            settings: "Settings",
            orders: "Orders",
            customers: "Customers",
            analytics: "Analytics",
        };

        const breadcrumbs = pathSegments.reduce<{ href: string; label: string; isCurrent: boolean }[]>(
            (acc, segment, idx) => {
                if (/^\d+$/.test(segment)) return acc;
                const href = `/${pathSegments.slice(0, idx + 1).join("/")}`;
                const label = pathLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
                acc.push({ href, label, isCurrent: idx === pathSegments.length - 1 });
                return acc;
            },
            []
        );

        return breadcrumbs;
    };

    const breadcrumbs = generateBreadcrumbs();

    // Notification dropdown
    const NotificationMenu = () => (
        <div className="absolute -right-20 xl:right-0 top-full mt-2 w-80 bg-white shadow-xl rounded-lg z-50 border border-gray-200">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-bold text-gray-800">Notifications</h3>
                <button onClick={() => setActiveMenu(null)} className="text-gray-500 hover:text-gray-700">
                    <IconX size={18} />
                </button>
            </div>
            <div className="max-h-80 overflow-y-auto">
                {[1, 2, 3].map((item) => (
                    <div key={item} className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-start gap-3">
                            <div className="bg-blue-100 p-2 rounded-full">
                                <IconBell size={20} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">New Notification</p>
                                <p className="text-gray-600 text-sm mt-1">You have a new message from the team</p>
                                <span className="text-xs text-gray-500 mt-1 block">2 hours ago</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-3 text-center bg-gray-50">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View All Notifications
                </button>
            </div>
        </div>
    );

    // Message dropdown
    const MessageMenu = () => (
        <div className="absolute -right-full xl:right-0 top-full mt-2 w-80 bg-white shadow-xl rounded-lg z-50 border border-gray-200">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-bold text-gray-800">Messages</h3>
                <button onClick={() => setActiveMenu(null)} className="text-gray-500 hover:text-gray-700">
                    <IconX size={18} />
                </button>
            </div>
            <div className="max-h-80 overflow-y-auto">
                {[1, 2, 3].map((item) => (
                    <div key={item} className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-start gap-3">
                            <div className="bg-green-100 p-2 rounded-full">
                                <IconMessage size={20} className="text-green-600" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">New Message</p>
                                <p className="text-gray-600 text-sm mt-1">Your team has an update for you</p>
                                <span className="text-xs text-gray-500 mt-1 block">1 day ago</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-3 text-center bg-gray-50">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View All Messages</button>
            </div>
        </div>
    );

    return (
        <>
            {/* Main Navbar */}
            <nav className="flex items-center justify-between gap-4 bg-white p-4 md:p-6 py-4 border-b border-gray-200 shadow-sm">
                {/* Left section: sidebar toggle and greeting */}
                <div className="flex items-center gap-3 md:gap-5">
                    <button type="button" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        {isSidebarOpen ? (
                            <IconChevronLeft size={25} stroke={2} className="text-red" />
                        ) : (
                            <IconMenu2 size={25} stroke={2} className="text-red" />
                        )}
                    </button>
                    <h6 className="text-red hidden md:block font-bold text-lg md:text-xl">
                        Hi,
                        <span className="capitalize ml-1">
                            {isFetchingAccount || isRefetchingAccount ? <TextLoading /> : getDisplayName()}
                        </span>
                    </h6>
                </div>

                {/* Right section: icons and profile */}
                <div className="flex items-center gap-x-3 md:gap-x-4">
                    {/* Notifications */}
                    <div className="relative" ref={notificationRef}>
                        <button
                            type="button"
                            onClick={() => toggleMenu("NOTIFICATION")}
                            className={`p-2 rounded-full ${
                                activeMenu === "NOTIFICATION"
                                    ? "bg-blue-100 text-blue-600"
                                    : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            <div className="relative">
                                <IconBell size={24} stroke={1.5} />
                                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                            </div>
                        </button>
                        {activeMenu === "NOTIFICATION" && <NotificationMenu />}
                    </div>

                    {/* Messages */}
                    <div className="relative" ref={messageRef}>
                        <button
                            type="button"
                            onClick={() => toggleMenu("MESSAGE")}
                            className={`p-2 rounded-full ${
                                activeMenu === "MESSAGE"
                                    ? "bg-green-100 text-green-600"
                                    : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            <div className="relative">
                                <IconMessage size={24} stroke={1.5} />
                                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                            </div>
                        </button>
                        {activeMenu === "MESSAGE" && <MessageMenu />}
                    </div>

                    <div className="w-px bg-gray-200 h-6 md:h-8" />

                    {/* Profile */}
                    <div className="relative" ref={profileRef}>
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleMenu("PROFILE")}>
                            <div className="relative w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-gray-200">
                                {isFetchingAccount || isRefetchingAccount ? (
                                    <IconLoader3 size={40} className="animate-spin" stroke={2} />
                                ) : (
                                    <Image
                                        src={
                                            account?.user.photo === "blank.png"
                                                ? "/blank.png"
                                                : account?.user.photo || "/blank.png"
                                        }
                                        alt={`Profile of ${getDisplayName()}`}
                                        className="object-cover object-center"
                                        fill
                                        sizes="(max-width: 768px) 40px, 50px"
                                    />
                                )}
                            </div>

                            <h5 className="font-semibold text-gray-800 hidden lg:block truncate max-w-[120px]">
                                {getDisplayName()}
                            </h5>
                        </div>

                        {activeMenu === "PROFILE" && (
                            <div className="absolute right-0 top-full mt-2 z-50">
                                <ProfileMenu setOpenMenu={setActiveMenu} />
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Breadcrumbs */}
            <div className="bg-gray-50 px-4 md:px-6 py-3 border-b border-gray-200">
                <div className="flex items-center text-sm">
                    <Link
                        href="/"
                        className="flex items-center text-gray-500 hover:text-primary transition-colors duration-200"
                    >
                        <IconHome size={16} stroke={1.5} className="mr-1.5 sm:inline hidden" />
                        <span>Home</span>
                    </Link>

                    {breadcrumbs.map((crumb, idx) => (
                        <span key={idx} className="flex items-center">
                            <IconChevronRight size={16} stroke={1.5} className="mx-2 text-gray-400" />
                            {crumb.isCurrent ? (
                                <span className="text-primary font-medium">{crumb.label}</span>
                            ) : (
                                <Link
                                    href={crumb.href}
                                    className="text-gray-500 hover:text-primary transition-colors duration-200"
                                >
                                    {crumb.label}
                                </Link>
                            )}
                        </span>
                    ))}
                </div>
            </div>
        </>
    );
}
