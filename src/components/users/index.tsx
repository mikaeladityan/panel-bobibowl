/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { IconChevronDown } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { SearchForm } from "~/components/ui/form/search.form";
import { SkeletonLoading } from "~/components/ui/loading/skeleton.loading";
import { Pagination } from "~/components/ui/pagination";
import { useUsers } from "~/hook/useUsers";
import { UsersQueryParams } from "~/interface/users";
import { UsersTable } from "./table";

export function Users() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [searchInput, setSearchInput] = useState<string>(searchParams.get("q") || "");
    const [search, setSearch] = useState<string>(searchParams.get("q") || "");
    const [isSearched, setIsSearched] = useState<boolean>(!!searchParams.get("q"));
    const [sort, setSort] = useState<string>(searchParams.get("sort") || "");
    const [page, setPage] = useState<number>(Number(searchParams.get("page") || "1"));
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const params: UsersQueryParams = {
        search,
        skip,
        take: pageSize,
        sort: sort as any,
        status: searchParams.get("status") as any,
    };

    const { data, isLoading, isFetching, isRefetching, isError } = useUsers(params);
    const users = data?.data || [];
    const totalCount = data?.totalCount || 0;

    useEffect(() => {
        const params = new URLSearchParams();
        if (search) params.set("q", search);
        if (sort) params.set("sort", sort);
        if (page > 1) params.set("page", page.toString());
        router.replace(`/users?${params.toString()}`);
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
        setSort(e.target.value);
        setPage(1);
    };

    const handlePageChange = (newPage: number) => setPage(newPage);

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 w-full">Users Management</h1>
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

                <div className="relative">
                    <select
                        value={sort}
                        onChange={handleSortChange}
                        className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    >
                        <option value="">Sort by</option>
                        <option value="updated_desc">Updated (Newest)</option>
                        <option value="updated_asc">Updated (Oldest)</option>
                        <option value="role_member">Role: Member</option>
                        <option value="role_admin">Role: Admin</option>
                        <option value="role_super_admin">Role: Super Admin</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <IconChevronDown size={18} className="text-gray-500" />
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {isLoading || isFetching || isRefetching ? (
                <SkeletonLoading />
            ) : isError ? (
                <div className="text-center py-10 text-red-600">Error loading users.</div>
            ) : (
                <>
                    <UsersTable users={users} />
                    <Pagination
                        page={page}
                        pageSize={pageSize}
                        totalCount={totalCount}
                        handlePageChange={handlePageChange}
                    />
                </>
            )}
        </div>
    );
}
