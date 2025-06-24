import type { Metadata, Viewport } from "next";
import "./globals.css";
import { RootProvider } from "~/components/provider";
import { NotificationAlert } from "~/components/ui/alert/notification.alert";
import { ErrorAlert } from "~/components/ui/alert/error.alert";
import { inter } from "~/lib/font";

export const metadata: Metadata = {
    title: "Dashboard | Bobi Bowl Restaurant",
    description:
        "Discover the best dining experience in town. We serve delicious food made with fresh ingredients and offer a cozy atmosphere for you to enjoy.",
    icons: {
        icon: "/favicon.ico",
        apple: "/apple-icon.png",
        shortcut: "/favicon.ico",
        other: [
            {
                rel: "mask-icon",
                url: "/icon0.svg",
                color: "#ffffff",
            },
        ],
    },
    manifest: "/manifest.json",
    authors: {
        name: "Mikael Aditya Nugroho",
        url: "https://instagram.com/mikaeladityan",
    },
    creator: "Sylvana Sari",
};
export const viewport: Viewport = {
    themeColor: "white",
    colorScheme: "normal",
    width: "device-width",
    initialScale: 1.0,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`antialiased overflow-x-hidden ${inter.className} bg-gray-100 text-gray-800 tracking-wide`}
            >
                <RootProvider>
                    <NotificationAlert />
                    <ErrorAlert />
                    {children}
                </RootProvider>
            </body>
        </html>
    );
}
