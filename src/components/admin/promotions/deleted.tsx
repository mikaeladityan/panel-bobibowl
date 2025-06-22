"use client";

import { IconActivity, IconCheck, IconDatabaseCog, IconEye, IconPlus, IconSearch, IconX } from "@tabler/icons-react";
import { SetStateAction } from "jotai";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Button } from "~/components/ui/button";
import { ButtonLoader } from "~/components/ui/button/button.loader";
import { Card } from "~/components/ui/card";
import { ComponentLoading } from "~/components/ui/loading/form.loading";
import { PageLoading } from "~/components/ui/loading/page.loading";
import { usePromotion, usePromotionForm } from "~/hook/usePromotion";
import { formatJustDate } from "~/lib/util/date";
import { sidebarAtom } from "~/store";

export function PromotionsDeleted() {
    const [sidebar] = useAtom(sidebarAtom);
    const [search, setSearch] = useState("");
    const { isLoadingPromotions, isRefetchingPromotions, promotions } = usePromotion(true);
    const { handleClean, isPendingClean } = usePromotionForm();
    const router = useRouter();
    const [hover, setHover] = useState<string>("");
    const [modalDelete, setModalDelete] = useState("");
    const filtered = promotions?.filter(
        (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase())
    );
    return isLoadingPromotions || isPendingClean ? (
        <PageLoading />
    ) : (
        <section className="flex flex-col gap-y-3">
            <h1 className="font-bold text-2xl">Promotions Trash Management</h1>
            <div className="flex items-center justify-between gap-5">
                <div className="relative w-6/12">
                    <input
                        type="text"
                        placeholder="Search menus..."
                        value={search}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                        className="w-full pl-4 pr-10 py-2 border bg-gray-100 shadow border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                        aria-label="Search"
                    >
                        {search ? (
                            <IconX size={20} onClick={() => setSearch("")} className="hover:text-red-500" />
                        ) : (
                            <IconSearch size={20} />
                        )}
                    </button>
                </div>

                <div className="flex items-center justify-end gap-4 w-fit">
                    <Button type="button" onClick={handleClean} className="bg-red text-yellow font-semibold">
                        <IconDatabaseCog stroke={2} size={20} /> <span>Clean</span>
                    </Button>
                    <Button
                        type="button"
                        onClick={() => router.push("/admin/promotions")}
                        className="bg-yellow text-red font-semibold"
                    >
                        <IconActivity stroke={2} size={20} /> <span>Main</span>
                    </Button>
                    <Button
                        onClick={() => router.push("/admin/promotions/create")}
                        type="button"
                        className="bg-sky-800 text-white font-semibold"
                    >
                        <IconPlus stroke={2} size={20} /> <span>Create</span>
                    </Button>
                </div>
            </div>

            <div className={twMerge("grid gap-5", sidebar ? "grid-cols-3" : "grid-cols-4")}>
                {isRefetchingPromotions ? (
                    <ComponentLoading isLoading={isLoadingPromotions} />
                ) : promotions?.length === 0 ? (
                    <Card
                        className={twMerge(
                            "text-center font-medium text-gray-500",
                            sidebar ? "col-span-3" : "col-span-4"
                        )}
                    >
                        Data Promotion is Empty
                    </Card>
                ) : (
                    filtered?.map((p, i) => (
                        <React.Fragment key={i}>
                            <Card
                                className="relative overflow-hidden"
                                onMouseEnter={() => setHover(p.code)}
                                onMouseLeave={() => setHover("")}
                            >
                                {hover === p.code && (
                                    <div className="absolute top-0 left-0 right-0 w-full h-full bg-black/20 backdrop-blur-sm flex items-center justify-center">
                                        <Button
                                            type="button"
                                            className="w-fit scale-75 bg-sky-800 text-gray-50"
                                            onClick={() => router.push(`/admin/promotions/${p.code}`)}
                                        >
                                            <IconEye />
                                        </Button>

                                        <Button
                                            type="button"
                                            className="w-fit scale-75 bg-blue-800 text-gray-50"
                                            onClick={() => setModalDelete(p.code)}
                                        >
                                            <IconCheck />
                                        </Button>
                                    </div>
                                )}
                                <h3 className="text-sm font-medium text-gray-600">{p.name}</h3>
                                <h6 className="font-black text-[11px] text-red">{p.code}</h6>

                                <div className="flex items-center justify-between text-xs my-2">
                                    <span>{formatJustDate(p.start_at)}</span>
                                    <span>{formatJustDate(p.expired_at)}</span>
                                </div>

                                <p className="text-xs font-medium">
                                    Discount:
                                    {p.price && p.percent ? `AED ${p.price} + ${p.percent}%` : p.price || p.percent}
                                </p>
                            </Card>
                            {modalDelete === p.code && (
                                <ModalDeletePromotion code={p.code} setModalDelete={setModalDelete} />
                            )}
                        </React.Fragment>
                    ))
                )}
            </div>
        </section>
    );
}

function ModalDeletePromotion({
    code,
    setModalDelete,
}: {
    code: string;
    setModalDelete: React.Dispatch<SetStateAction<string>>;
}) {
    const { handleStatus, isPendingStatus } = usePromotionForm(code);
    async function handleClick() {
        await handleStatus("ACTIVE");
        setModalDelete("");
    }
    return (
        <div className="fixed top-0 left-0 right-0 w-full h-screen z-30 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <Card className="flex flex-col gap-y-5 w-4/12">
                <p className="text-center text-sm text-gray-500">
                    Are you sure you want to activated this promotion <br /> {code}?
                </p>
                <div className="grid grid-cols-2 gap-3">
                    <Button type="button" onClick={() => setModalDelete("")}>
                        Cancel
                    </Button>
                    <Button type="button" onClick={handleClick} className="bg-sky-800 text-gray-50">
                        {isPendingStatus ? <ButtonLoader /> : "Yes"}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
