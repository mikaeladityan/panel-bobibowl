"use client";
import { useParams } from "next/navigation";
import { useFormUser, useUser } from "~/hook/useUsers";
import { PageLoading } from "../ui/loading/page.loading";
import { ImageComponent, ImageSkeleton } from "../ui/image";
import {
    IconAddressBook,
    IconMail,
    IconPhone,
    IconUser,
    IconDeviceMobile,
    IconCalendar,
    IconShield,
} from "@tabler/icons-react";
import React, { useState } from "react";
import { formatDate } from "~/lib/util/date";
import { STATUS } from "~/interface";
import { ROLE } from "~/interface/account";

export function DetailUser() {
    const { id } = useParams();
    const { user, isLoadingUser, isRefetchingUser } = useUser(String(id));
    const { handleRole, handleStatus, isPendingRole, isPendingStatus } = useFormUser(String(id));

    // State untuk nilai dropdown
    const [selectedStatus, setSelectedStatus] = useState<STATUS>(user?.status || "ACTIVE");
    const [selectedRole, setSelectedRole] = useState<ROLE>((user?.role as ROLE) || "MEMBER");

    // Update state saat data user berubah
    React.useEffect(() => {
        if (user) {
            setSelectedStatus(user.status);
            setSelectedRole(user.role as ROLE);
        }
    }, [user]);

    // Handler untuk perubahan status
    const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as STATUS;
        setSelectedStatus(newStatus);
        await handleStatus({ id: String(id), status: newStatus });
    };

    // Handler untuk perubahan role
    const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newRole = e.target.value as ROLE;
        setSelectedRole(newRole);
        await handleRole({ id: String(id), role: newRole });
    };

    if (isLoadingUser || isRefetchingUser) {
        return <PageLoading />;
    }

    return (
        <section className="bg-white rounded-xl border border-gray-300 text-red">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-5 py-3 border-b border-gray-300 gap-3">
                <h1 className="text-lg font-semibold text-red">Account {user?.first_name}</h1>

                <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                    {/* Status Dropdown */}
                    <div className="flex-1 min-w-[150px]">
                        <label className="block text-xs text-gray-500 mb-1">Status</label>
                        <div className="relative">
                            <select
                                value={selectedStatus}
                                onChange={handleStatusChange}
                                disabled={isPendingStatus}
                                className={`appearance-none w-full pl-3 pr-8 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                                    isPendingStatus ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                                }`}
                            >
                                <option value="PENDING">Pending</option>
                                <option value="ACTIVE">Active</option>
                                <option value="FAVOURITE">Favourite</option>
                                <option value="BLOCK">Block</option>
                                <option value="DELETE">Delete</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                {isPendingStatus ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red"></div>
                                ) : (
                                    <div className="w-2 h-2 rounded-full bg-red"></div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Role Dropdown */}
                    <div className="flex-1 min-w-[150px]">
                        <label className="block text-xs text-gray-500 mb-1">Role</label>
                        <div className="relative">
                            <select
                                value={selectedRole}
                                onChange={handleRoleChange}
                                disabled={isPendingRole}
                                className={`appearance-none w-full pl-3 pr-8 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                                    isPendingRole ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                                }`}
                            >
                                <option value="MEMBER">Member</option>
                                <option value="ADMIN">Admin</option>
                                <option value="SUPER_ADMIN">Super Admin</option>
                                <option value="OWNER">Owner</option>
                                <option value="DEVELOPER">Developer</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                {isPendingRole ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red"></div>
                                ) : (
                                    <IconShield size={18} className="text-gray-500" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-x-5 xl:gap-x-16 items-start justify-center xl:justify-start gap-y-5 xl:gap-y-0 p-5">
                {/* Profile Photo Section */}
                <div className="relative w-full flex flex-col items-center">
                    {isLoadingUser || isRefetchingUser ? (
                        <ImageSkeleton />
                    ) : (
                        <ImageComponent
                            source={user?.photo || "/blank.png"}
                            className="border border-gray-300 w-full rounded-xl h-72 object-cover"
                        />
                    )}

                    <div className="mt-4 w-full text-center">
                        <h2 className="text-sm font-bold text-primary">
                            {user?.first_name} {user?.last_name}
                        </h2>
                        <p className="text-gray-500 mt-1 text-xs font-semibold">{user?.role}</p>

                        <div
                            className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                user?.status === "ACTIVE"
                                    ? "bg-green-100 text-green-800"
                                    : user?.status === "FAVOURITE"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                            }`}
                        >
                            {user?.status}
                        </div>
                    </div>
                </div>

                {/* User Details Section */}
                <div className="col-span-1 xl:col-span-3 flex flex-col gap-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Personal Info */}
                        <div className="bg-gray-50 rounded-lg p-5">
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-red mb-4">
                                <IconUser size={20} />
                                Personal Information
                            </h3>

                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <IconMail className="text-gray-500 mt-0.5 mr-3 flex-shrink-0" size={20} />
                                    <div>
                                        <p className="text-xs text-gray-500">Email</p>
                                        <p className="font-medium">{user?.email || "-"}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <IconPhone className="text-gray-500 mt-0.5 mr-3 flex-shrink-0" size={20} />
                                    <div>
                                        <p className="text-xs text-gray-500">Phone</p>
                                        <p className="font-medium">{user?.phone || "-"}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <IconDeviceMobile className="text-gray-500 mt-0.5 mr-3 flex-shrink-0" size={20} />
                                    <div>
                                        <p className="text-xs text-gray-500">WhatsApp</p>
                                        <p className="font-medium">{user?.whatsapp || "-"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Account Info */}
                        <div className="bg-gray-50 rounded-lg p-5">
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-red mb-4">
                                <IconShield size={20} />
                                Account Information
                            </h3>

                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <div className="w-6 mr-3 flex justify-center">
                                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                            ID
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">User ID</p>
                                        <p className="font-medium text-xs uppercase">{user?.id}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="w-6 mr-3 flex justify-center">
                                        <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                            RL
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Role</p>
                                        <p className="font-medium capitalize">{user?.role.toLowerCase()}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <IconCalendar className="text-gray-500 mt-0.5 mr-3 flex-shrink-0" size={20} />
                                    <div>
                                        <p className="text-xs text-gray-500">Last Updated</p>
                                        <p className="font-medium">
                                            {user?.updated_at ? formatDate(user.updated_at) : "-"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Address Section */}
                    <div className="mt-2">
                        <div className="w-full flex items-center justify-between border-t border-gray-300 pt-4">
                            <h3 className="flex items-center gap-2 text-gray font-bold uppercase text-sm">
                                <IconAddressBook size={20} stroke={2} />
                                Addresses
                            </h3>
                        </div>

                        <div className="mt-4">
                            {user?.addresses?.length ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {user.addresses.map((add) => (
                                        <div
                                            key={add.id}
                                            className="rounded-lg border border-gray-200 bg-white p-4 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-center justify-between gap-2 mb-2">
                                                <h6 className="font-semibold text-primary">{add.name}</h6>
                                                {/* {add.isPrimary && (
                                                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded">
                                                        Primary
                                                    </span>
                                                )} */}
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                {add.street}, {add.district}, {add.subDistrict}
                                                <br />
                                                {add.city}, {add.province}
                                                <br />
                                                {add.country} {add.postalCode}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-gray-50 rounded-lg p-8 text-center">
                                    <IconAddressBook className="mx-auto text-gray-400" size={40} />
                                    <p className="mt-3 text-gray-500">No addresses found</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
