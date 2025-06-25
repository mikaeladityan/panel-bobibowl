"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SetStateAction } from "jotai";
import { useSetAtom } from "jotai";
import React, { useState } from "react";
import { STATUS } from "~/interface";
import { MenuQueryDTO, MenuReqDTO, MenuResDTO } from "~/interface/admin/menu";
import { fetchError, ResponseError } from "~/lib/util/error";
import { MenuService } from "~/service/admin/menu";
import { errorAtom, notificationAtom } from "~/store";

export function useMenu(params: MenuQueryDTO, barcode?: string) {
    const {
        data: menus, // Ubah nama variabel
        isLoading: isLoadingMenus,
        isFetching: isFetchingMenus,
        isRefetching: isRefetchingMenus,
        isError: isErrorMenus,
    } = useQuery({
        queryKey: ["menus", params],
        queryFn: () => MenuService.list(params!),
        enabled: !barcode,
    });

    const {
        data: menu,
        isLoading: isLoadingMenu,
        isFetching: isFetchingMenu,
        isRefetching: isRefetchingMenu,
    } = useQuery<unknown, ResponseError, MenuResDTO>({
        queryKey: ["menu", barcode],
        queryFn: () => MenuService.find(barcode!),
        enabled: !!barcode,
    });

    return {
        menus: menus?.data || [], // Akses properti data
        totalCount: menus?.totalCount || 0, // Tambahkan totalCount
        isLoadingMenus,
        isFetchingMenus,
        isRefetchingMenus,
        isErrorMenus,
        menu,
        isLoadingMenu,
        isFetchingMenu,
        isRefetchingMenu,
    };
}

export function useMenuForm(barcode?: string, setBarcodeSelect?: React.Dispatch<SetStateAction<string>>) {
    const queryClient = useQueryClient();
    const setError = useSetAtom(errorAtom);
    const notification = useSetAtom(notificationAtom);
    const [errors, setErrors] = useState<Array<{ path: string; message: string }>>([]);

    const { mutateAsync: handleCreate, isPending: isPendingCreate } = useMutation<
        { barcode: string },
        ResponseError,
        MenuReqDTO
    >({
        mutationKey: ["menu", "create"],
        mutationFn: (body) => MenuService.create(body),
        onSuccess: () => {
            notification({ title: "Create New Menu", message: "Successfully created new menu" });
            queryClient.invalidateQueries({ queryKey: ["menus"] });
            localStorage.removeItem("menuBody");
        },
        onError: (err) => {
            fetchError(err, setError);
            setErrors(err.response.data.errors ? err.response.data.errors : []);
        },
    });

    const { mutateAsync: handleImage, isPending: isPendingImage } = useMutation<
        void,
        ResponseError,
        { barcode: string; file: File }
    >({
        mutationKey: ["menu", "image"],
        mutationFn: ({ barcode, file }) => MenuService.image(barcode, file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["menus"] });
            queryClient.invalidateQueries({ queryKey: ["menu", barcode] });

            notification({ title: "Create New Menu", message: "Successfully created new menu" });
        },
        onError: (err) => {
            fetchError(err, setError);
            setErrors(err.response.data.errors ? err.response.data.errors : []);
        },
    });

    const { mutateAsync: handleUpdate, isPending: isPendingUpdate } = useMutation<void, ResponseError, MenuReqDTO>({
        mutationKey: ["menu", "update"],
        mutationFn: (body) => MenuService.update(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["menus"] });
            queryClient.invalidateQueries({ queryKey: ["menu", barcode] });
            notification({ title: "Update Menu", message: "Successfully update new menu" });
        },
        onError: (err) => {
            fetchError(err, setError);
            setErrors(err.response.data.errors ? err.response.data.errors : []);
        },
    });

    const { mutateAsync: handleStatus, isPending: isPendingStatus } = useMutation<
        void,
        ResponseError,
        { barcode: string; status: STATUS }
    >({
        mutationKey: ["menu", "update"],
        mutationFn: ({ barcode, status }) => MenuService.status(barcode, status),
        onSuccess: () => {
            notification({ title: "Update Menu", message: "Successfully update new menu" });
            queryClient.invalidateQueries({ queryKey: ["menus"] });
            queryClient.invalidateQueries({ queryKey: ["menu", barcode] });
            setBarcodeSelect!("");
        },
        onError: (err) => {
            fetchError(err, setError);
            setErrors(err.response.data.errors ? err.response.data.errors : []);
        },
    });

    return {
        errors,
        handleCreate,
        isPendingCreate,
        handleImage,
        isPendingImage,
        handleUpdate,
        isPendingUpdate,
        handleStatus,
        isPendingStatus,
    };
}
