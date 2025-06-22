// src/app/admin/users/table.tsx
import { IconEdit } from "@tabler/icons-react";
import Image from "next/image";
import { useState } from "react";
import { ButtonLoader } from "~/components/ui/button/button.loader";
import { UsersResDTO } from "~/interface/users";
import { formatDate } from "~/lib/util/date";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export const UsersTable = ({ users }: { users: UsersResDTO }) => {
    const [userId, setUserId] = useState("");
    const router = useRouter();
    const goToEdit = (id: string) => {
        setUserId(id);
        router.push(`/users/${id}`);
    };

    return (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Last Updated
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {users.length ? (
                        users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            {user.photo ? (
                                                <Image
                                                    className="h-10 w-10 rounded-full object-cover object-center"
                                                    src={user.photo}
                                                    alt=""
                                                    width={1000}
                                                    height={1000}
                                                    priority
                                                />
                                            ) : (
                                                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {user.first_name} {user.last_name}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{user.email}</div>
                                    <div className="text-sm text-gray-500">{user.phone}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className="px-4 py-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`px-3 py-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            user.status === "ACTIVE"
                                                ? "bg-green-100 text-green-800"
                                                : user.status === "FAVOURITE"
                                                ? "bg-gray-100 text-gray-800"
                                                : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(user.updated_at)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                    <Button
                                        type="button"
                                        onClick={() => goToEdit(user.id)}
                                        className="text-red hover:text-red px-3 py-1 rounded bg-yellow w-fit ms-auto"
                                        disabled={userId === user.id}
                                    >
                                        {userId === user.id ? <ButtonLoader /> : <IconEdit size={16} />}
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                No users found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
