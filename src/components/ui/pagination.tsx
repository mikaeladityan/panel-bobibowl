// Komponen Pagination
export const Pagination = ({
    page,
    pageSize,
    totalCount,
    handlePageChange,
}: {
    page: number;
    pageSize: number;
    totalCount: number;
    handlePageChange: (newPage: number) => void;
}) => {
    const totalPages = Math.ceil(totalCount / pageSize);
    return totalPages > 1 ? (
        <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{(page - 1) * pageSize + 1}</span> to{" "}
                <span className="font-medium">{Math.min(page * pageSize, totalCount)}</span> of{" "}
                <span className="font-medium">{totalCount}</span> results
            </div>
            <div className="flex space-x-2">
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className={`px-3 py-1 border rounded-md ${
                        page === 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                >
                    Previous
                </button>
                {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => handlePageChange(idx + 1)}
                        className={`px-3 py-1 border rounded-md ${
                            page === idx + 1
                                ? "bg-blue-600 text-white border-blue-600"
                                : "border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                        {idx + 1}
                    </button>
                ))}
                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className={`px-3 py-1 border rounded-md ${
                        page === totalPages
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                >
                    Next
                </button>
            </div>
        </div>
    ) : null;
};
