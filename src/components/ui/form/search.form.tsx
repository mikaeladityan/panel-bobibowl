import { IconSearch, IconX } from "@tabler/icons-react";
import { ChangeEvent, FormEvent } from "react";

// Komponen Form Pencarian
export const SearchForm = ({
    searchInput,
    isSearched,
    handleSearchInput,
    handleSearch,
    clearSearch,
}: {
    searchInput: string;
    isSearched: boolean;
    handleSearchInput: (e: ChangeEvent<HTMLInputElement>) => void;
    handleSearch: (e?: FormEvent) => void;
    clearSearch: () => void;
}) => (
    <form onSubmit={handleSearch} className="relative w-full md:w-96">
        <div className="relative">
            <input
                type="text"
                placeholder="Search menus..."
                value={searchInput}
                onChange={handleSearchInput}
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
            <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label="Search"
            >
                {isSearched && searchInput ? (
                    <IconX size={20} onClick={clearSearch} className="hover:text-red-500" />
                ) : (
                    <IconSearch size={20} />
                )}
            </button>
        </div>
    </form>
);
