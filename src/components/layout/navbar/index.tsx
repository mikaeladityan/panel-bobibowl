"use client";
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
    account: AccountResDTO | undefined;
    isFetchingAccount: boolean;
    isRefetchingAccount: boolean;
};

export function Navbar({ account, isFetchingAccount, isRefetchingAccount }: PropsNavbar) {
    const [openMenu, setOpenMenu] = useState<"NOTIFICATION" | "MESSAGE" | "PROFILE" | null>(null);
    const [sidebar, setSidebar] = useAtom(sidebarAtom);
    const pathname = usePathname();

    // Ref untuk mendeteksi klik di luar menu
    const notificationRef = useRef<HTMLDivElement>(null);
    const messageRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    // Menutup menu ketika klik di luar area menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setOpenMenu((prev) => (prev === "NOTIFICATION" ? null : prev));
            }
            if (messageRef.current && !messageRef.current.contains(event.target as Node)) {
                setOpenMenu((prev) => (prev === "MESSAGE" ? null : prev));
            }
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setOpenMenu((prev) => (prev === "PROFILE" ? null : prev));
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Fungsi untuk membuka/tutup menu
    const toggleMenu = (menu: "NOTIFICATION" | "MESSAGE" | "PROFILE") => {
        setOpenMenu((prev) => (prev === menu ? null : menu));
    };

    // Fungsi untuk menampilkan nama pengguna
    const getUserName = () => {
        if (account?.user.firstName) {
            return `${account.user.firstName} ${account.user.lastName || ""}`;
        }
        return account?.email.split("@")[0];
    };

    // Fungsi untuk membuat breadcrumb dari pathname
    const generateBreadcrumbs = () => {
        // Hapus query string jika ada
        const pathWithoutQuery = pathname.split("?")[0];
        const pathArray = pathWithoutQuery.split("/");
        pathArray.shift(); // Hapus elemen pertama yang kosong

        // Mapping untuk nama yang lebih user-friendly
        const pathMap: Record<string, string> = {
            admin: "Dashboard",
            products: "Produk",
            services: "Layanan",
            categories: "Kategori",
            components: "Komponen",
            reports: "Laporan",
            create: "Create New",
            edit: "Edit",
            users: "Users",
            settings: "Settiing",
            orders: "Pesanan",
            customers: "Pelanggan",
            analytics: "Analitik",
        };

        const breadcrumbs = [];
        let cumulativePath = "";

        for (let i = 0; i < pathArray.length; i++) {
            const segment = pathArray[i];
            if (!segment) continue;

            cumulativePath += `/${segment}`;

            // Skip segment yang berupa ID (hanya angka)
            if (/^\d+$/.test(segment)) continue;

            // Gunakan mapping jika tersedia, atau kapitalisasi
            const title = pathMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

            breadcrumbs.push({
                href: cumulativePath,
                title,
                isCurrent: i === pathArray.length - 1,
            });
        }

        return breadcrumbs;
    };

    const breadcrumbs = generateBreadcrumbs();

    // Komponen dropdown notifikasi
    const NotificationMenu = () => (
        <div className="absolute -right-20 xl:right-0 top-full mt-2 w-80 bg-white shadow-xl rounded-lg z-50 border border-gray-200">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-bold text-gray-800">Pemberitahuan</h3>
                <button onClick={() => setOpenMenu(null)} className="text-gray-500 hover:text-gray-700">
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
                                <p className="font-medium text-gray-800">Pemberitahuan Baru</p>
                                <p className="text-gray-600 text-sm mt-1">Anda memiliki pesan baru dari tim</p>
                                <span className="text-xs text-gray-500 mt-1 block">2 jam yang lalu</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-3 text-center bg-gray-50">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Lihat Semua Pemberitahuan
                </button>
            </div>
        </div>
    );

    // Komponen dropdown pesan
    const MessageMenu = () => (
        <div className="absolute -right-full xl:right-0 top-full mt-2 w-80 bg-white shadow-xl rounded-lg z-50 border border-gray-200">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-bold text-gray-800">Pesan</h3>
                <button onClick={() => setOpenMenu(null)} className="text-gray-500 hover:text-gray-700">
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
                                <p className="font-medium text-gray-800">Pesan Baru</p>
                                <p className="text-gray-600 text-sm mt-1">Tim Anda memiliki pembaruan untuk Anda</p>
                                <span className="text-xs text-gray-500 mt-1 block">1 hari yang lalu</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-3 text-center bg-gray-50">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Lihat Semua Pesan</button>
            </div>
        </div>
    );

    return (
        <>
            {/* Navbar Utama */}
            <nav className="flex items-center justify-between gap-4 bg-white p-4 md:p-6 py-4 border-b border-gray-200 shadow-sm">
                {/* Bagian kiri - Tombol sidebar dan sapaan */}
                <div className="flex items-center justify-start gap-3 md:gap-5">
                    <button type="button" onClick={() => setSidebar(!sidebar)}>
                        {sidebar ? (
                            <IconChevronLeft size={25} stroke={2} className="text-red" />
                        ) : (
                            <IconMenu2 size={25} stroke={2} className="text-red" />
                        )}
                    </button>
                    <h6 className="text-red hidden md:block font-bold text-lg md:text-xl">
                        Hi,{" "}
                        <span className="capitalize">
                            {isFetchingAccount || isRefetchingAccount ? <TextLoading /> : getUserName()}
                        </span>
                    </h6>
                </div>

                {/* Bagian kanan - Ikon dan profil */}
                <div className="flex items-center justify-end gap-x-3 md:gap-x-4">
                    {/* Notifikasi */}
                    <div className="relative" ref={notificationRef}>
                        <button
                            type="button"
                            onClick={() => toggleMenu("NOTIFICATION")}
                            className={`p-2 rounded-full ${
                                openMenu === "NOTIFICATION"
                                    ? "bg-blue-100 text-blue-600"
                                    : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            <div className="relative">
                                <IconBell size={24} stroke={1.5} />
                                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                            </div>
                        </button>
                        {openMenu === "NOTIFICATION" && <NotificationMenu />}
                    </div>

                    {/* Pesan */}
                    <div className="relative" ref={messageRef}>
                        <button
                            type="button"
                            onClick={() => toggleMenu("MESSAGE")}
                            className={`p-2 rounded-full ${
                                openMenu === "MESSAGE"
                                    ? "bg-green-100 text-green-600"
                                    : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            <div className="relative">
                                <IconMessage size={24} stroke={1.5} />
                                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                            </div>
                        </button>
                        {openMenu === "MESSAGE" && <MessageMenu />}
                    </div>

                    <div className="w-[1px] bg-gray-200 h-6 md:h-8"></div>

                    {/* Profil */}
                    <div className="relative" ref={profileRef}>
                        <div
                            className="flex items-center justify-center gap-2 cursor-pointer"
                            onClick={() => toggleMenu("PROFILE")}
                        >
                            <div className="relative w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-gray-200">
                                {isFetchingAccount || isRefetchingAccount ? (
                                    <IconLoader3 size={40} className="animate-spin" stroke={2} />
                                ) : (
                                    <Image
                                        src={
                                            account?.user.photo === "blank.png"
                                                ? `/blank.png`
                                                : account?.user.photo || "/blank.png"
                                        }
                                        alt={`Profile ${account?.user.firstName || account?.email}`}
                                        className="object-cover object-center"
                                        fill
                                        sizes="(max-width: 768px) 40px, 50px"
                                    />
                                )}
                            </div>

                            <h5 className="font-semibold text-gray-800 hidden lg:block truncate max-w-[120px]">
                                {account?.user.firstName || account?.email.split("@")[0]}
                            </h5>
                        </div>

                        {openMenu === "PROFILE" && (
                            <div className="absolute right-0 top-full mt-2 z-50">
                                <ProfileMenu setOpenMenu={setOpenMenu} />
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Breadcrumb */}
            <div className="bg-gray-50 px-4 md:px-6 py-3 border-b border-gray-200">
                <div className="flex items-center text-sm">
                    <Link
                        href="/"
                        className="flex items-center text-gray-500 hover:text-primary transition-colors duration-200"
                    >
                        <IconHome size={16} stroke={1.5} className="mr-1.5 sm:inline hidden" />
                        <span className="inline">Home</span>
                    </Link>

                    {breadcrumbs.length > 0 && (
                        <div className="flex items-center">
                            <IconChevronRight size={16} stroke={1.5} className="mx-2 text-gray-400" />

                            {breadcrumbs.map((breadcrumb, index) => (
                                <div key={index} className="flex items-center">
                                    {breadcrumb.isCurrent ? (
                                        <span className="text-primary font-medium flex items-center">
                                            {breadcrumb.title}
                                        </span>
                                    ) : (
                                        <Link
                                            href={breadcrumb.href}
                                            className="text-gray-500 hover:text-primary transition-colors duration-200 flex items-center"
                                        >
                                            {breadcrumb.title}
                                        </Link>
                                    )}
                                    {index < breadcrumbs.length - 1 && (
                                        <IconChevronRight size={16} stroke={1.5} className="mx-2 text-gray-400" />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
