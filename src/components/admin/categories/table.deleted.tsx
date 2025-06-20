import { IconCheck, IconSettings } from "@tabler/icons-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { SkeletonTable } from "~/components/ui/skeleton.table";
import { useCategory } from "~/hook/useCategory";
import { formatDate } from "~/lib/util/date";
import { ActiveCategory } from "./active";

export function CategoryTableDeleted({ search }: { search: string }) {
    const { categoryDeleted, isLoadingCategoryDeleted, isFetchingCategoryDeleted, isRefetchingCategorCDeleted } =
        useCategory(true);

    const filtered = categoryDeleted?.filter(
        (t) =>
            t.title.toLowerCase().includes(search.toLowerCase()) || t.slug.toLowerCase().includes(search.toLowerCase())
    );

    const [modal, setModal] = useState<"DELETE" | "ACTIVE" | null>(null);
    const [selectSlug, setSelectSlug] = useState<string | null>(null);
    return (
        <>
            <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase">Slug</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase">Date</th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 uppercase flex items-center justify-center">
                            <IconSettings size={18} />
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {isLoadingCategoryDeleted || isFetchingCategoryDeleted || isRefetchingCategorCDeleted
                        ? Array.from({ length: 5 }).map((_, idx) => (
                              <tr key={idx} className="animate-pulse">
                                  <td className="px-4 py-3">
                                      <SkeletonTable className="h-4 w-24 rounded" />
                                  </td>
                                  <td className="px-4 py-3">
                                      <SkeletonTable className="h-4 w-32 rounded" />
                                  </td>
                                  <td className="px-4 py-3">
                                      <SkeletonTable className="h-4 w-32 rounded" />
                                  </td>
                                  <td className="px-4 py-3 flex items-center justify-center space-x-2">
                                      <SkeletonTable className="h-6 w-6 rounded-full" />
                                      <SkeletonTable className="h-6 w-6 rounded-full" />
                                  </td>
                              </tr>
                          ))
                        : filtered?.map((t) => (
                              <tr key={t.slug} className="hover:bg-gray-50">
                                  <td className="px-4 py-3 text-sm text-gray-800">{t.title}</td>
                                  <td className="px-4 py-3 text-sm text-gray-600">{t.slug}</td>
                                  <td className="px-4 py-3 text-sm text-gray-600">
                                      {formatDate(String(t.deleted_at))}
                                  </td>
                                  <td className="px-4 py-3 flex items-center justify-center space-x-2">
                                      <Button type="button" className="px-2 w-fit py-2 bg-blue-800">
                                          <IconCheck
                                              size={16}
                                              onClick={() => {
                                                  setModal("ACTIVE");
                                                  setSelectSlug(t.slug);
                                              }}
                                          />
                                      </Button>
                                  </td>
                              </tr>
                          ))}

                    {!isLoadingCategoryDeleted && filtered?.length === 0 && (
                        <tr>
                            <td colSpan={4} className="px-4 py-6 text-center text-sm text-gray-500">
                                No types found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            {modal === "ACTIVE" && (
                <ActiveCategory setModal={setModal} setSelectSlug={setSelectSlug} slug={selectSlug} />
            )}
        </>
    );
}
