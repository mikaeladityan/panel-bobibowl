"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SetStateAction } from "jotai";
import { useSetAtom } from "jotai";
import React, { useState } from "react";
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
        data: categoryDeleted,
        isLoading: isLoadingCategoryDeleted,
        isFetching: isFetchingCategoryDeleted,
        isRefetching: isRefetchingCategorCDeleted,
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
        categories,
        categoryDeleted,
        category,
        isLoadingCategories,
        isLoadingCategory,
        isLoadingCategoryDeleted,
        isFetchingCategory,
        isFetchingCategories,
        isFetchingCategoryDeleted,
        isRefetchingCategory,
        isRefetchingCategories,
        isRefetchingCategorCDeleted,
    };
}

export function useForm(setBody?: React.Dispatch<SetStateAction<CategoryReqDTO>>, slug?: string) {
    const queryClient = useQueryClient();
    const [errors, setErrors] = useState<Array<{ path: string; message: string }>>([]);
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
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            setNotification({ title: "Create New Category", message: "Successfully created new category" });
            setBody!({
                slug: "",
                title: "",
            });
        },
        onError: (err) => {
            fetchError(err, setError);
            setErrors(err.response.data.errors ? err.response.data.errors : []);
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
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["categories", "deleted"] });
            queryClient.invalidateQueries({ queryKey: ["category", slug] });
            setNotification({ title: "Update Category", message: "Successfully updated category" });
        },
        onError: (err) => {
            fetchError(err, setError);
        },
    });

    const { mutateAsync: handleClean, isPending: isPendingClean } = useMutation<unknown, ResponseError>({
        mutationKey: ["category", "clean"],
        mutationFn: CategoryService.clean,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            setNotification({ title: "Clean category", message: "Successfully to clean category storage" });
        },
        onError: (err) => {
            fetchError(err, setError);
        },
    });

    return { handleCreate, handleUpdate, handleClean, isPendingCreate, isPendingUpdate, isPendingClean, errors };
}

export function useStatus(
    setModal: React.Dispatch<SetStateAction<"DELETE" | "ACTIVE" | null>>,
    setSelectedSlug: React.Dispatch<SetStateAction<string | null>>,
    slug?: string
) {
    const queryClient = useQueryClient();
    const setError = useSetAtom(errorAtom);
    const setNotification = useSetAtom(notificationAtom);
    const { mutateAsync: handleDeleted, isPending: isPendingDeleted } = useMutation<unknown, ResponseError>({
        mutationKey: ["category", "deleted"],
        mutationFn: () => CategoryService.softDeleted(slug!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["categories", "deleted"] });
            queryClient.invalidateQueries({ queryKey: ["category", slug] });
            setNotification({ title: "Deleted category", message: "Successfully to delete category" });
            setModal(null);
            setSelectedSlug(null);
        },
        onError: (err) => {
            fetchError(err, setError);
        },
    });

    const { mutateAsync: handleActived, isPending: isPendingActived } = useMutation<unknown, ResponseError>({
        mutationKey: ["category", "actived"],
        mutationFn: () => CategoryService.actived(slug!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["categories", "deleted"] });
            queryClient.invalidateQueries({ queryKey: ["category", slug] });
            setNotification({ title: "Actived category", message: "Successfully to actived category" });
            setModal(null);
            setSelectedSlug(null);
        },
        onError: (err) => {
            fetchError(err, setError);
        },
    });

    return { handleDeleted, handleActived, isPendingActived, isPendingDeleted };
}
