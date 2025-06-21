// Skeleton Loader Component
export const SkeletonLoading = () => (
    <div className="animate-pulse">
        <div className="overflow-x-auto bg-white shadow rounded">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {[...Array(10)].map((_, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <div className="h-6 bg-gray-200 rounded w-20"></div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                                <div className="h-8 bg-gray-200 rounded w-12"></div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);
