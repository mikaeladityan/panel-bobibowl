"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SetStateAction } from "jotai";
import { useSetAtom } from "jotai";
import React, { useState } from "react";
import { TypeReqDTO, TypeResDTO } from "~/interface/admin/type";
import { fetchError, ResponseError } from "~/lib/util/error";
import { TypeService } from "~/service/admin/type";
import { errorAtom, notificationAtom } from "~/store";

export function useType(deleted: boolean, slug?: string) {
    const {
        data: types,
        isLoading: isLoadingTypes,
        isFetching: isFetchingTypes,
        isRefetching: isRefetchingTypes,
    } = useQuery({
        queryKey: ["types"],
        queryFn: TypeService.list,
        enabled: !deleted,
    });

    const {
        data: typesDeleted,
        isLoading: isLoadingTypeDeleted,
        isFetching: isFetchingTypeDeleted,
        isRefetching: isRefetchingTypeDeleted,
    } = useQuery({
        queryKey: ["types", "deleted"],
        queryFn: TypeService.listDeleted,
        enabled: !!deleted,
    });

    const {
        data: type,
        isLoading: isLoadingType,
        isFetching: isFetchingType,
        isRefetching: isRefetchingType,
    } = useQuery<TypeResDTO, ResponseError>({
        queryKey: ["type", slug],
        queryFn: () => TypeService.find(slug!),
        enabled: !!slug,
    });

    return {
        types,
        typesDeleted,
        type,
        isLoadingTypes,
        isLoadingType,
        isLoadingTypeDeleted,
        isFetchingType,
        isFetchingTypes,
        isFetchingTypeDeleted,
        isRefetchingType,
        isRefetchingTypes,
        isRefetchingTypeDeleted,
    };
}

export function useForm(setBody?: React.Dispatch<SetStateAction<TypeReqDTO>>, slug?: string) {
    const queryClient = useQueryClient();
    const [errors, setErrors] = useState<Array<{ path: string; message: string }>>([]);
    const setError = useSetAtom(errorAtom);
    const setNotification = useSetAtom(notificationAtom);
    const { mutateAsync: handleCreate, isPending: isPendingCreate } = useMutation<unknown, ResponseError, TypeReqDTO>({
        mutationKey: ["type", "create"],
        mutationFn: (body) => TypeService.create(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["types"] });
            setNotification({ title: "Create New Type", message: "Successfully created new type" });
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

    const { mutateAsync: handleUpdate, isPending: isPendingUpdate } = useMutation<unknown, ResponseError, TypeReqDTO>({
        mutationKey: ["type", "update", slug],
        mutationFn: (body) => TypeService.update(body, slug!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["types"] });
            queryClient.invalidateQueries({ queryKey: ["types", "deleted"] });
            queryClient.invalidateQueries({ queryKey: ["type", slug] });
            setNotification({ title: "Update Type", message: "Successfully updated type" });
        },
        onError: (err) => {
            fetchError(err, setError);
        },
    });

    const { mutateAsync: handleClean, isPending: isPendingClean } = useMutation<unknown, ResponseError>({
        mutationKey: ["type", "clean"],
        mutationFn: TypeService.clean,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["types"] });
            setNotification({ title: "Clean Type", message: "Successfully to clean type storage" });
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
        mutationKey: ["type", "deleted"],
        mutationFn: () => TypeService.softDeleted(slug!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["types"] });
            queryClient.invalidateQueries({ queryKey: ["types", "deleted"] });
            queryClient.invalidateQueries({ queryKey: ["type", slug] });
            setNotification({ title: "Deleted Type", message: "Successfully to delete type" });
            setModal(null);
            setSelectedSlug(null);
        },
        onError: (err) => {
            fetchError(err, setError);
        },
    });

    const { mutateAsync: handleActived, isPending: isPendingActived } = useMutation<unknown, ResponseError>({
        mutationKey: ["type", "actived"],
        mutationFn: () => TypeService.actived(slug!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["types"] });
            queryClient.invalidateQueries({ queryKey: ["types", "deleted"] });
            queryClient.invalidateQueries({ queryKey: ["type", slug] });
            setNotification({ title: "Actived Type", message: "Successfully to actived type" });
            setModal(null);
            setSelectedSlug(null);
        },
        onError: (err) => {
            fetchError(err, setError);
        },
    });

    return { handleDeleted, handleActived, isPendingActived, isPendingDeleted };
}
