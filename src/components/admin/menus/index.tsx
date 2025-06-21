"use client";

import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { ButtonLoader } from "~/components/ui/button/button.loader";
import { SearchForm } from "~/components/ui/form/search.form";
import { SortSelect } from "~/components/ui/form/sort.select";
import { SkeletonLoading } from "~/components/ui/loading/skeleton.loading";
import { useMenu } from "~/hook/useMenu";
import { MenuTable } from "./table";
import { Pagination } from "~/components/ui/pagination";

export function Menus() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);

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
        status: "ACTIVE",
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
        router.replace(`/admin/menus?${params.toString()}`);
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
    const goToCreate = () => {
        setLoading(true);
        router.push("/admin/menus/create");
    };
    const goToEdit = (barcode: string) => {
        setLoading(true);
        router.push(`/admin/menus/${barcode}`);
    };
    const goToTrash = () => {
        setLoading(true);
        router.push("/admin/menus/trash");
    };
    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 w-full">Menus Management</h1>
                <div className="flex items-center justify-end gap-5">
                    <Button
                        type="button"
                        onClick={goToTrash}
                        className="flex items-center gap-2 px-4 py-2 bg-red text-yellow rounded-lg hover:bg-red-900 transition-colors w-fit"
                        disabled={loading}
                    >
                        {loading ? (
                            <ButtonLoader />
                        ) : (
                            <>
                                <IconTrash size={20} stroke={2} />
                                <span className="w-full font-medium text-nowrap">Trash</span>
                            </>
                        )}
                    </Button>
                    <Button
                        type="button"
                        onClick={goToCreate}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-fit"
                        disabled={loading}
                    >
                        {loading ? (
                            <ButtonLoader />
                        ) : (
                            <>
                                <IconPlus size={20} stroke={2} />
                                <span className="w-full font-medium text-nowrap">Create New</span>
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
    );
}
