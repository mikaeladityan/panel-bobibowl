"use client";

import { IconArrowBack, IconDatabaseCog } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";

import React, { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { ButtonLoader } from "~/components/ui/button/button.loader";
import { SearchForm } from "~/components/ui/form/search.form";
import { SortSelect } from "~/components/ui/form/sort.select";
import { SkeletonLoading } from "~/components/ui/loading/skeleton.loading";
import { useMenu } from "~/hook/useMenu";
import { MenuTable } from "./table";
import { Pagination } from "~/components/ui/pagination";
import { SetStateAction, useSetAtom } from "jotai";
import { Card } from "~/components/ui/card";
import { errorAtom, notificationAtom } from "~/store";
import { fetchError, ResponseError } from "~/lib/util/error";
import { MenuService } from "~/service/admin/menu";
import { ComponentLoading } from "~/components/ui/loading/form.loading";

export function MenusTrash() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [cleanModal, setCleanModal] = useState(false);

    const [searchInput, setSearchInput] = useState<string>(searchParams.get("q") || "");
    const [search, setSearch] = useState<string>(searchParams.get("q") || "");
    const [isSearched, setIsSearched] = useState<boolean>(!!searchParams.get("q"));
    const [sort, setSort] = useState<"price_asc" | "price_desc">(
        (searchParams.get("sort") as "price_asc" | "price_desc") || undefined
    );
    const [page, setPage] = useState<number>(Number(searchParams.get("page") || "1"));
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const { menus, totalCount, isFetchingMenus, isLoadingMenus, isRefetchingMenus, isErrorMenus } = useMenu({
        status: "DELETE",
        search,
        skip,
        take: pageSize,
        sort: sort,
    });
    useEffect(() => {
        const params = new URLSearchParams();
        if (search) params.set("q", search);
        if (sort) params.set("sort", sort);
        if (page > 1) params.set("page", page.toString());
        router.replace(`/admin/menus/trash?${params.toString()}`);
    }, [search, sort, page, router]);

    const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    };

    const handleSearch = (e?: FormEvent) => {
        if (e) e.preventDefault();
        setSearch(searchInput);
        setIsSearched(true);
        setPage(1);
    };

    const clearSearch = () => {
        setSearchInput("");
        setSearch("");
        setIsSearched(false);
        setPage(1);
    };

    const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSort(e.target.value as "price_asc" | "price_desc");
        setPage(1);
    };

    const handlePageChange = (newPage: number) => setPage(newPage);

    const goToEdit = (barcode: string) => {
        setLoading(true);
        router.push(`/admin/menus/${barcode}`);
    };
    return (
        <>
            <div className="p-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 w-full">Trash Menus</h1>
                    <div className="flex items-center justify-end gap-5">
                        <Button
                            type="button"
                            onClick={() => setCleanModal(!cleanModal)}
                            className="flex items-center gap-2 px-4 py-2 bg-red text-yellow rounded-lg hover:bg-red-900 transition-colors w-fit"
                            disabled={loading}
                        >
                            {loading ? (
                                <ButtonLoader />
                            ) : (
                                <>
                                    <IconDatabaseCog size={25} stroke={2} />
                                    <span className="w-full font-medium text-nowrap">Clean</span>
                                </>
                            )}
                        </Button>
                        <Button
                            type="button"
                            onClick={() => router.push("/admin/menus")}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-fit"
                            disabled={loading}
                        >
                            {loading ? (
                                <ButtonLoader />
                            ) : (
                                <>
                                    <IconArrowBack size={25} stroke={2} />
                                    <span className="w-full font-medium text-nowrap">Back</span>
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 gap-4 p-3 bg-gray-50 rounded-lg">
                    <SearchForm
                        searchInput={searchInput}
                        isSearched={isSearched}
                        handleSearchInput={handleSearchInput}
                        handleSearch={handleSearch}
                        clearSearch={clearSearch}
                    />

                    <SortSelect sort={sort} handleSortChange={handleSortChange} />
                </div>

                {/* Loading State */}
                {isLoadingMenus || isFetchingMenus || isRefetchingMenus ? (
                    <SkeletonLoading />
                ) : isErrorMenus ? (
                    <div className="text-center py-10 text-red-600">Error loading menus.</div>
                ) : (
                    <>
                        <MenuTable menus={menus} goToEdit={goToEdit} />
                        <Pagination
                            page={page}
                            pageSize={pageSize}
                            totalCount={totalCount || 0}
                            handlePageChange={handlePageChange}
                        />
                    </>
                )}
            </div>

            {cleanModal && <ModalClean setCleanModal={setCleanModal} />}
        </>
    );
}

function ModalClean({ setCleanModal }: { setCleanModal: React.Dispatch<SetStateAction<boolean>> }) {
    const setError = useSetAtom(errorAtom);
    const setNotification = useSetAtom(notificationAtom);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const handleClean = useCallback(async () => {
        setLoading(true);
        try {
            await MenuService.clean();
            setCleanModal(false);
            router.replace("/admin/menus");
            setNotification({ title: "Clean Menu", message: "Successfully to clean menu storage on database" });
        } catch (error) {
            fetchError(error as ResponseError, setError);
        } finally {
            setLoading(false);
        }
    }, [router, setCleanModal, setError, setNotification]);
    return loading ? (
        <ComponentLoading isLoading={loading} />
    ) : (
        <div className="fixed z-20 top-0 left-0 right-0 w-full h-screen backdrop-blur-sm bg-black/10 flex items-center justify-center">
            <Card className="w-5/12">
                <p className="mb-5 text-center font-medium">
                    Please confirm if you would like to initiate the menu cleanup procedure.
                </p>
                <div className="grid grid-cols-2 gap-4">
                    <Button type="button" onClick={() => setCleanModal(false)}>
                        Cancel
                    </Button>
                    <Button className="text-white bg-blue-600" type="button" onClick={handleClean}>
                        Yes
                    </Button>
                </div>
            </Card>
        </div>
    );
}
