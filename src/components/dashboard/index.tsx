"use client";

import { useAccount, useAuth } from "~/hook/useAuth";
import { PageLoading } from "../ui/loading/page.loading";
import { Navbar } from "../layout/navbar";
import { Sidebar } from "../layout/sidebar";
import { useAtom } from "jotai";
import { sidebarAtom } from "~/store";

import { api } from "~/lib/api";
import { useEffect, useState } from "react";
import { ApiSuccessResponse } from "~/interface";
import { IconCloud, IconCpu, IconDatabase, IconDeviceSdCard, IconServer, IconServerBolt } from "@tabler/icons-react";

// Type for server info response
type ServerInfo = {
    server: {
        cpu: {
            model: string;
            cores: number;
            speed: string;
        };
        memory: {
            total: string;
            used: string;
            free: string;
            usagePercent: number;
        };
        storage: {
            usagePercent: number;
            status: string;
        };
    };
    services: {
        database: {
            status: string;
            type: string;
            version: string;
        };
        redis: {
            status: string;
            version: string;
        };
        s3: {
            status: string;
            bucket: string;
            totalSizeGB: number;
            objectCount: number;
        };
    };
    healthStatus: string;
};

export function Dashboard() {
    const { isLogin } = useAuth();
    const { account, isFetchAccount, isLoadingAccount, isRefetchingAccount } = useAccount();
    const [sidebar] = useAtom(sidebarAtom);

    // State for server info
    const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null);
    const [loadingServerInfo, setLoadingServerInfo] = useState(true);

    // Fetch server info
    const fetchServerInfo = async () => {
        try {
            setLoadingServerInfo(true);
            const response = await api.get<ApiSuccessResponse<ServerInfo>>("/admin");
            setServerInfo(response.data.data);
        } catch (error) {
            console.error("Failed to fetch server info:", error);
        } finally {
            setLoadingServerInfo(false);
        }
    };

    useEffect(() => {
        if (isLogin) {
            fetchServerInfo();
        }
    }, [isLogin]);

    // Tampilkan loading saat cek session atau proses login
    if (isLoadingAccount) {
        return <PageLoading />;
    }

    // Jika sudah login, jangan render form (redirect di useAuth)
    if (!isLogin) {
        return <PageLoading />;
    }

    // Helper function for status badges
    const getStatusBadge = (status: string) => {
        const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";

        if (status === "CONNECTED" || status === "HEALTHY" || status === "OK") {
            return <span className={`${baseClasses} bg-green-100 text-green-800`}>{status}</span>;
        } else if (status === "WARNING") {
            return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>{status}</span>;
        } else {
            return <span className={`${baseClasses} bg-red-100 text-red-800`}>{status}</span>;
        }
    };

    // Helper for memory/storage progress bars
    const ProgressBar = ({ percentage, label }: { percentage: number; label: string }) => (
        <div className="mb-3">
            <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{label}</span>
                <span className="text-sm font-medium text-gray-700">{percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                    className={`h-2.5 rounded-full ${
                        percentage < 70 ? "bg-green-600" : percentage < 90 ? "bg-yellow-400" : "bg-red-600"
                    }`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );

    return (
        <div className="flex items-start w-full relative">
            {sidebar && <Sidebar account={account} />}
            <section className="w-full min-h-[100svh]">
                <Navbar
                    account={account}
                    isFetchingAccount={isFetchAccount}
                    isRefetchingAccount={isRefetchingAccount}
                />
                <main className="p-5">
                    <div className="mb-6">
                        <h2 className="font-bold text-2xl text-red">
                            Hello,{" "}
                            {account?.user.firstName
                                ? `${account.user.firstName} ${account.user.lastName}`
                                : account?.email}
                        </h2>
                        <p className="font-semibold text-xl text-gray-600">Welcome to our system</p>
                    </div>

                    {/* Server Info Section */}
                    <div className="bg-white rounded-xl border border-gray-300 overflow-hidden mb-6">
                        <div className="px-5 py-3 border-b flex items-center justify-between gap-5 border-gray-300 bg-gray-50">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <IconServer className="text-red" size={24} />
                                Server Information
                            </h3>
                            <div className="mt-1">
                                {serverInfo?.healthStatus && getStatusBadge(serverInfo.healthStatus)}
                            </div>
                        </div>

                        <div className="p-5">
                            {loadingServerInfo ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red mx-auto"></div>
                                    <p className="mt-3 text-gray-600">Loading server information...</p>
                                </div>
                            ) : serverInfo ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* CPU Section */}
                                    <div className="bg-gray-50 rounded-lg p-5">
                                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                            <IconCpu className="text-red" size={20} />
                                            CPU
                                        </h4>
                                        <div className="space-y-2 text-gray-600">
                                            <p>
                                                <span className="font-medium">Model:</span>{" "}
                                                {serverInfo.server.cpu.model}
                                            </p>
                                            <p>
                                                <span className="font-medium">Cores:</span>{" "}
                                                {serverInfo.server.cpu.cores}
                                            </p>
                                            <p>
                                                <span className="font-medium">Speed:</span>{" "}
                                                {serverInfo.server.cpu.speed}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Memory Section */}
                                    <div className="bg-gray-50 rounded-lg p-5">
                                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                            <IconDeviceSdCard className="text-red" size={20} />
                                            Memory
                                        </h4>
                                        <div className="mb-4">
                                            <ProgressBar
                                                percentage={serverInfo.server.memory.usagePercent}
                                                label="Memory Usage"
                                            />
                                        </div>
                                        <div className="space-y-1 text-gray-600">
                                            <p>
                                                <span className="font-medium">Total:</span>{" "}
                                                {serverInfo.server.memory.total}
                                            </p>
                                            <p>
                                                <span className="font-medium">Used:</span>{" "}
                                                {serverInfo.server.memory.used}
                                            </p>
                                            <p>
                                                <span className="font-medium">Free:</span>{" "}
                                                {serverInfo.server.memory.free}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Storage Section */}
                                    <div className="bg-gray-50 rounded-lg p-5">
                                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                            <IconDeviceSdCard className="text-red" size={20} />
                                            Storage
                                        </h4>
                                        <div className="mb-4">
                                            <ProgressBar
                                                percentage={serverInfo.server.storage.usagePercent}
                                                label="Disk Usage"
                                            />
                                        </div>
                                        <div className="text-gray-600">
                                            <p>
                                                <span className="font-medium">Status:</span>{" "}
                                                {getStatusBadge(serverInfo.server.storage.status)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Services Section */}
                                    <div className="bg-gray-50 rounded-lg p-5">
                                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                            <IconServer className="text-red" size={20} />
                                            Services
                                        </h4>
                                        <div className="space-y-4">
                                            {/* Database */}
                                            <div className="border-b border-gray-200 pb-3">
                                                <div className="flex justify-between items-center mb-1">
                                                    <div className="flex items-center gap-2">
                                                        <IconDatabase className="text-gray-500" size={18} />
                                                        <span className="font-medium">Database</span>
                                                    </div>
                                                    {getStatusBadge(serverInfo.services.database.status)}
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {serverInfo.services.database.type} v
                                                    {serverInfo.services.database.version}
                                                </p>
                                            </div>

                                            {/* Redis */}
                                            <div className="border-b border-gray-200 pb-3">
                                                <div className="flex justify-between items-center mb-1">
                                                    <div className="flex items-center gap-2">
                                                        <IconServerBolt className="text-gray-500" size={18} />
                                                        <span className="font-medium">Redis</span>
                                                    </div>
                                                    {getStatusBadge(serverInfo.services.redis.status)}
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Version {serverInfo.services.redis.version}
                                                </p>
                                            </div>

                                            {/* S3 Storage */}
                                            <div>
                                                <div className="flex justify-between items-center mb-1">
                                                    <div className="flex items-center gap-2">
                                                        <IconCloud className="text-gray-500" size={18} />
                                                        <span className="font-medium">S3 Storage</span>
                                                    </div>
                                                    {getStatusBadge(serverInfo.services.s3.status)}
                                                </div>
                                                <div className="text-sm text-gray-600 mt-1">
                                                    <p>Bucket: {serverInfo.services.s3.bucket}</p>
                                                    <p className="mt-1">
                                                        <span className="font-medium">Usage:</span>{" "}
                                                        {serverInfo.services.s3.totalSizeGB} GB
                                                        <span className="mx-2">|</span>
                                                        <span className="font-medium">Files:</span>{" "}
                                                        {serverInfo.services.s3.objectCount}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-red-600">
                                    Failed to load server information. Please try again later.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Additional dashboard content */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Placeholder cards */}
                        <div className="bg-white rounded-xl border border-gray-300 p-5">
                            <h4 className="font-semibold text-gray-700 mb-3">Recent Activity</h4>
                            <p className="text-gray-600">No recent activity</p>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-300 p-5">
                            <h4 className="font-semibold text-gray-700 mb-3">System Alerts</h4>
                            <p className="text-gray-600">No alerts</p>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-300 p-5">
                            <h4 className="font-semibold text-gray-700 mb-3">Quick Actions</h4>
                            <p className="text-gray-600">No actions available</p>
                        </div>
                    </div>
                </main>
            </section>
        </div>
    );
}
