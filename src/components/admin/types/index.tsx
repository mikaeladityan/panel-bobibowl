"use client";
import { useState } from "react";
import { IconActivity, IconDatabaseSearch, IconSearch, IconTrash } from "@tabler/icons-react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { TypeCreate } from "./create";
import { TypeTable } from "./table";
import { TypeTableDeleted } from "./table.deleted";
import { twMerge } from "tailwind-merge";

import { useAtom } from "jotai";
import { contentAtom } from "~/store";
import { useForm } from "~/hook/useType";
import { ButtonLoader } from "~/components/ui/button/button.loader";

export function AdminType() {
    const [search, setSearch] = useState("");
    const [content, setContent] = useAtom(contentAtom);
    const { handleClean, isPendingClean } = useForm();
    return (
        <section
            className={twMerge(
                "grid grid-cols-2 gap-8 items-start",
                content === "DELETED" ? "grid-cols-4" : "grid-cols-3"
            )}
        >
            {/* List Section */}
            <Card className={twMerge("flex flex-col gap-4 p-6", content === "DELETED" ? "col-span-3" : "col-span-2")}>
                <div className="flex items-center justify-between">
                    <h2 className="text-xs font-bold text-gray-500 uppercase">Types Data</h2>
                    <div className="flex items-center justify-end gap-3">
                        {content === "DELETED" && (
                            <Button
                                type="button"
                                onClick={handleClean}
                                className={twMerge("w-fit px-2 py-2", content === "DELETED" && "bg-sky-800")}
                            >
                                {isPendingClean ? (
                                    <ButtonLoader />
                                ) : (
                                    <>
                                        <IconDatabaseSearch size={18} /> <span>Clean</span>
                                    </>
                                )}
                            </Button>
                        )}
                        <Button
                            type="button"
                            onClick={() => setContent(content === "ACTIVED" ? "DELETED" : "ACTIVED")}
                            className={twMerge("w-fit px-2 py-2", content === "DELETED" && "bg-sky-800")}
                        >
                            {content === "ACTIVED" ? <IconTrash size={18} /> : <IconActivity size={18} />}
                        </Button>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2 pr-10 text-sm placeholder-gray-500 outline-none"
                            placeholder="Search types..."
                        />
                        <IconSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {content === "ACTIVED" ? <TypeTable search={search} /> : <TypeTableDeleted search={search} />}
                </div>
            </Card>

            {/* Create Section */}
            <Card className="p-6">
                <TypeCreate />
            </Card>
        </section>
    );
}
