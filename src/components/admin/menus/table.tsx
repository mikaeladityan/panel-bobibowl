import { IconLoader3, IconStar, IconStarFilled } from "@tabler/icons-react";
import { useState } from "react";
import { ButtonLoader } from "~/components/ui/button/button.loader";
import { useMenuForm } from "~/hook/useMenu";
import { MenusResDTO } from "~/interface/admin/menu";
import { formatPrice } from "~/lib/util/currency";

// Komponen Tabel Menu
export const MenuTable = ({ menus, goToEdit }: { menus: MenusResDTO; goToEdit: (barcode: string) => void }) => {
    const [barcodeSelect, setBarcodeSelect] = useState("");
    const { handleStatus, isPendingStatus } = useMenuForm(barcodeSelect, setBarcodeSelect);

    return (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {menus.length ? (
                        menus.map((menu) => (
                            <tr key={menu.barcode} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900 flex items-center justify-start gap-1">
                                        {menu.status !== "DELETE" && (
                                            <button
                                                onClick={() => {
                                                    setBarcodeSelect(menu.barcode);
                                                    handleStatus({
                                                        barcode: menu.barcode,
                                                        status: menu.status === "FAVOURITE" ? "ACTIVE" : "FAVOURITE",
                                                    });
                                                }}
                                                className="text-blue-600 hover:text-blue-900 mr-4"
                                            >
                                                {isPendingStatus ? (
                                                    <IconLoader3 className="animate-spin" size={14} />
                                                ) : menu.status === "FAVOURITE" ? (
                                                    <IconStarFilled size={14} />
                                                ) : (
                                                    <IconStar size={14} />
                                                )}
                                            </button>
                                        )}
                                        {menu.title}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-700">AED {formatPrice(menu.price!)}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            menu.status === "ACTIVE"
                                                ? "bg-green-100 text-green-800"
                                                : menu.status === "PENDING"
                                                ? "bg-gray-100 text-gray-800"
                                                : menu.status === "FAVOURITE"
                                                ? "bg-yellow text-red"
                                                : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {menu.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex items-center justify-end gap-3">
                                    {menu.status === "PENDING" || menu.status === "DELETE" ? (
                                        <button
                                            onClick={() => {
                                                setBarcodeSelect(menu.barcode);
                                                handleStatus({ barcode: menu.barcode, status: "ACTIVE" });
                                            }}
                                            className="text-teal-600 hover:text-teal-900 px-3 py-1 rounded bg-teal-100 flex items-center justify-between gap-1"
                                            disabled={isPendingStatus}
                                        >
                                            {isPendingStatus ? <ButtonLoader /> : "Active"}
                                        </button>
                                    ) : null}
                                    <button
                                        onClick={() => goToEdit(menu.barcode)}
                                        className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded bg-blue-100"
                                    >
                                        Detail
                                    </button>
                                    <button
                                        onClick={() => {
                                            setBarcodeSelect(menu.barcode);
                                            handleStatus({ barcode: menu.barcode, status: "DELETE" });
                                        }}
                                        className="text-red-600 hover:text-red px-3 py-1 rounded bg-red-100"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                No menus found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
