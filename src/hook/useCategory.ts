import { useMutation, useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { CategoryReqDTO, CategoryResDTO } from "~/interface/admin/category";
import { fetchError, ResponseError } from "~/lib/util/error";
import { CategoryService } from "~/service/admin/category";
import { errorAtom, notificationAtom } from "~/store";

export function useCategory(deleted: boolean, slug?: string) {
    const {
        data: categories,
        isLoading: isLoadingCategories,
        isFetching: isFetchingCategories,
        isRefetching: isRefetchingCategories,
    } = useQuery({
        queryKey: ["categories"],
        queryFn: CategoryService.list,
        enabled: !deleted,
    });

    const {
        data: categoriesDeleted,
        isLoading: isLoadingCategoriesDeleted,
        isFetching: isFetchingCategoriesDeleted,
        isRefetching: isRefetchingCategoriesDeleted,
    } = useQuery({
        queryKey: ["categories", "deleted"],
        queryFn: CategoryService.listDeleted,
        enabled: !!deleted,
    });

    const {
        data: category,
        isLoading: isLoadingCategory,
        isFetching: isFetchingCategory,
        isRefetching: isRefetchingCategory,
    } = useQuery<CategoryResDTO, ResponseError>({
        queryKey: ["category", slug],
        queryFn: () => CategoryService.find(slug!),
        enabled: !!slug,
    });

    return {
        category,
        categories,
        categoriesDeleted,
        isLoadingCategory,
        isLoadingCategories,
        isLoadingCategoriesDeleted,
        isFetchingCategory,
        isFetchingCategories,
        isFetchingCategoriesDeleted,
        isRefetchingCategory,
        isRefetchingCategories,
        isRefetchingCategoriesDeleted,
    };
}

export function useForm(slug?: string) {
    const setError = useSetAtom(errorAtom);
    const setNotification = useSetAtom(notificationAtom);
    const { mutateAsync: handleCreate, isPending: isPendingCreate } = useMutation<
        unknown,
        ResponseError,
        CategoryReqDTO
    >({
        mutationKey: ["category", "create"],
        mutationFn: (body) => CategoryService.create(body),
        onSuccess: () => {
            setNotification({ title: "Create New Category", message: "Successfully created new Category" });
        },
        onError: (err) => {
            fetchError(err, setError);
        },
    });

    const { mutateAsync: handleUpdate, isPending: isPendingUpdate } = useMutation<
        unknown,
        ResponseError,
        CategoryReqDTO
    >({
        mutationKey: ["category", "update", slug],
        mutationFn: (body) => CategoryService.update(body, slug!),
        onSuccess: () => {
            setNotification({ title: "Update Category", message: "Successfully updated Category" });
        },
        onError: (err) => {
            fetchError(err, setError);
        },
    });

    const { mutateAsync: handleClean, isPending: isPendingClean } = useMutation<unknown, ResponseError>({
        mutationKey: ["category", "clean"],
        mutationFn: CategoryService.clean,
        onSuccess: () => {
            setNotification({ title: "Clean Category", message: "Successfully to clean Category storage" });
        },
        onError: (err) => {
            fetchError(err, setError);
        },
    });

    return { handleCreate, handleUpdate, handleClean, isPendingCreate, isPendingUpdate, isPendingClean };
}

export function useStatus(slug?: string) {
    const setError = useSetAtom(errorAtom);
    const setNotification = useSetAtom(notificationAtom);
    const { mutateAsync: handleDeleted, isPending: isPendingDeleted } = useMutation<unknown, ResponseError>({
        mutationKey: ["category", "deleted"],
        mutationFn: () => CategoryService.softDeleted(slug!),
        onSuccess: () => {
            setNotification({ title: "Deleted Category", message: "Successfully to delete Category" });
        },
        onError: (err) => {
            fetchError(err, setError);
        },
    });

    const { mutateAsync: handleActived, isPending: isPendingActived } = useMutation<unknown, ResponseError>({
        mutationKey: ["category", "actived"],
        mutationFn: () => CategoryService.actived(slug!),
        onSuccess: () => {
            setNotification({ title: "Actived Category", message: "Successfully to actived Category" });
        },
        onError: (err) => {
            fetchError(err, setError);
        },
    });

    return { handleDeleted, handleActived, isPendingActived, isPendingDeleted };
}
