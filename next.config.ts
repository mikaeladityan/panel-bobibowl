import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    experimental: { scrollRestoration: false },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "is3.cloudhost.id",
                pathname: "/**", // Sesuaikan dengan path gambar Anda
                port: "",
            },
            {
                protocol: "https",
                hostname: "img1.wsimg.com",
                pathname: "/**", // Sesuaikan dengan path gambar Anda
                port: "",
            },
        ],
    },
};

export default nextConfig;
