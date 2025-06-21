import { IconChevronDown } from "@tabler/icons-react";
import { ChangeEvent } from "react";

// Komponen Dropdown Sort
export const SortSelect = ({
    sort,
    handleSortChange,
}: {
    sort: string;
    handleSortChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}) => (
    <div className="relative">
        <select
            value={sort}
            onChange={handleSortChange}
            className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        >
            <option value="">Sort by Price</option>
            <option value="price_asc">Lowest First</option>
            <option value="price_desc">Highest First</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <IconChevronDown size={18} className="text-gray-500" />
        </div>
    </div>
);
