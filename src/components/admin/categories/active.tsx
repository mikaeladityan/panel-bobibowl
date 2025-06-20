import { IconCancel, IconCheck } from "@tabler/icons-react";
import { SetStateAction } from "jotai";
import { Button } from "~/components/ui/button";
import { ButtonLoader } from "~/components/ui/button/button.loader";
import { TextLoading } from "~/components/ui/loading/text.loading";
import { useStatus, useCategory } from "~/hook/useCategory";
type propsActiveCategory = {
    setModal: React.Dispatch<SetStateAction<"ACTIVE" | "DELETE" | null>>;
    slug: string | null;
    setSelectSlug: React.Dispatch<SetStateAction<string | null>>;
};
export function ActiveCategory({ setModal, slug, setSelectSlug }: propsActiveCategory) {
    const { category, isLoadingCategory, isFetchingCategory, isRefetchingCategory } = useCategory(false, slug!);

    const { handleActived, isPendingActived } = useStatus(setModal, setSelectSlug, slug!);
    return (
        <div className="fixed z-30 top-0 left-0 right-0 bg-black/10 backdrop-blur-sm h-svh flex items-center justify-center w-full">
            <div className="w-11/12 md:w-6/12 lg:w-4/12 mx-auto bg-gray-50 rounded-lg p-5 border border-gray-300 flex flex-col gap-y-3">
                {isLoadingCategory ? (
                    <TextLoading />
                ) : (
                    <div className="flex flex-col gap-y-1 p-3 bg-gray-200 rounded-lg border border-gray-300">
                        <h3 className="font-bold text-gray-800">{category?.title}</h3>
                        <p className="text-xs text-gray-500">{category?.slug}</p>
                        <p className="text-xs text-gray-500">{category?.description}</p>
                    </div>
                )}
                <div className="flex items-center justify-center gap-5 mt-5">
                    <Button
                        type="button"
                        onClick={() => {
                            setSelectSlug(null);
                            setModal(null);
                        }}
                        className="w-full bg-red text-red-100"
                    >
                        <IconCancel size={20} /> <span>Cancel</span>
                    </Button>
                    <Button
                        type="button"
                        disabled={isLoadingCategory || isFetchingCategory || isRefetchingCategory || isPendingActived}
                        onClick={handleActived}
                        className="w-full bg-sky-800 text-white"
                    >
                        {isLoadingCategory || isFetchingCategory || isPendingActived || isRefetchingCategory ? (
                            <ButtonLoader />
                        ) : (
                            <>
                                <IconCheck size={20} /> <span>Active</span>
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
