// components/loading/card/account.card.skeleton.tsx
export function AccountCardSkeleton() {
    return (
        <section className="bg-white rounded-xl border border-gray-300 animate-pulse">
            <div className="px-5 py-3 border-b border-gray-300">
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div className="p-5 bg-gray-50">
                <div className="grid grid-cols-4 gap-x-5 items-start">
                    {/* Profile Picture Skeleton */}
                    <div className="relative">
                        <div className="bg-gray-200 border border-gray-300 rounded-xl aspect-square w-full"></div>
                        <div className="absolute top-1/2 left-0 right-0 w-fit px-5 mx-auto h-8 bg-gray-300 rounded-md hidden"></div>
                    </div>

                    {/* Form Skeleton */}
                    <div className="col-span-3 flex flex-col gap-y-4">
                        <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                    <div className="h-10 bg-gray-200 rounded w-full"></div>
                                </div>
                            ))}
                            <div className="mt-5 col-span-2 h-10 bg-gray-300 rounded w-1/4"></div>
                        </div>

                        {/* Address Section Skeleton */}
                        <div className="w-full flex items-center justify-between border-t border-gray-300 pt-1">
                            <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                            <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                        </div>
                        <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                            <div className="rounded-lg border border-gray-300 bg-white px-5 py-4 gap-2 flex items-center justify-between">
                                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                <div className="h-7 w-7 bg-gray-200 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
