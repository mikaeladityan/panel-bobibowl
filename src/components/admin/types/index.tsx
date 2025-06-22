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
import { TypeUpdate } from "./update";

export function AdminType() {
    const [search, setSearch] = useState("");
    const [content, setContent] = useAtom(contentAtom);
    const [updated, setUpdated] = useState<string | null>(null);
    const { handleClean, isPendingClean } = useForm();
    return (
        <section
            className={twMerge(
                "grid-cols-1 grid gap-8 items-start",
                content === "DELETED" ? "lg:grid-cols-3 xl:grid-cols-4" : "lg:grid-cols-2 xl:grid-cols-3"
            )}
        >
            {/* List Section */}
            <Card
                className={twMerge(
                    "flex flex-col gap-4 p-6",
                    content === "DELETED" ? "lg:col-span-2 xl:col-span-3" : "xl:col-span-2"
                )}
            >
                <div className="flex items-center justify-between">
                    <h2 className="text-xs font-bold text-gray-500 uppercase">Types Data</h2>
                    <div className="flex items-center justify-end gap-3">
                        {content === "DELETED" && (
                            <Button
                                type="button"
                                onClick={handleClean}
                                className={twMerge(
                                    "w-fit px-2 py-2 text-gray-50",
                                    content === "DELETED" && "bg-sky-800"
                                )}
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
                            className={twMerge("w-fit px-2 py-2", content === "DELETED" && "bg-sky-800 text-gray-50")}
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
                            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 pr-10 text-sm placeholder-gray-500 outline-none"
                            placeholder="Search types..."
                        />
                        <IconSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {content === "ACTIVED" ? (
                        <TypeTable setUpdated={setUpdated} search={search} />
                    ) : (
                        <TypeTableDeleted search={search} />
                    )}
                </div>
            </Card>

            {/* Create Section */}
            <Card className="p-6">
                {updated ? <TypeUpdate slug={updated} setUpdated={setUpdated} /> : <TypeCreate />}
            </Card>
        </section>
    );
}
