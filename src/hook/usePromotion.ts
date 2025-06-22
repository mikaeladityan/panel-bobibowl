import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PromotionReqDTO, PromotionResDTO, PromotionsResDTO } from "~/interface/admin/promotion";
import { fetchError, ResponseError } from "~/lib/util/error";
import { PromotionService } from "~/service/admin/promotion";
import { errorAtom, notificationAtom } from "~/store";

export function usePromotion(deleted?: boolean, code?: string) {
    const {
        data: promotions,
        isLoading: isLoadingPromotions,
        isRefetching: isRefetchingPromotions,
    } = useQuery<unknown, ResponseError, PromotionsResDTO>({
        queryKey: deleted ? ["promotions"] : ["promotions", "deleted"],
        queryFn: PromotionService.list,
        enabled: !deleted && !code,
    });

    const {
        data: promotionsDeleted,
        isLoading: isLoadingPromotionsDeleted,
        isRefetching: isRefetchingPromotionsDeleted,
    } = useQuery<unknown, ResponseError, PromotionsResDTO>({
        queryKey: ["promotions"],
        queryFn: PromotionService.listDeleted,
        enabled: !!deleted,
    });

    const {
        data: promotion,
        isLoading: isLoadingPromotion,
        isRefetching: isRefetchingPromotion,
    } = useQuery<{ code: string }, ResponseError, PromotionResDTO>({
        queryKey: ["promotion", code],
        queryFn: async () => {
            const found = await PromotionService.find(code!);
            if (!found) {
                // turn undefined into a thrown error
                throw new Error(`No promotion found for code "${code}"`);
            }
            return found;
        },
        enabled: !!code,
    });

    return {
        promotion,
        promotions,
        promotionsDeleted,
        isLoadingPromotion,
        isLoadingPromotions,
        isLoadingPromotionsDeleted,
        isRefetchingPromotion,
        isRefetchingPromotions,
        isRefetchingPromotionsDeleted,
    };
}

export function usePromotionForm(code?: string) {
    const queryClient = useQueryClient();
    const setError = useSetAtom(errorAtom);
    const setNotification = useSetAtom(notificationAtom);
    const router = useRouter();
    const [errors, setErrors] = useState<Array<{ path: string; message: string }>>([]);

    // Createt
    const { mutateAsync: handleCreate, isPending: isPendingCreate } = useMutation<
        unknown,
        ResponseError,
        PromotionReqDTO
    >({
        mutationKey: ["promotion", "create"],
        mutationFn: (body) => PromotionService.create(body),
        onSuccess: () => {
            setNotification({ title: "Create New Promotion", message: "Successfully create new promotion" });
            router.push("/admin/promotions");
            queryClient.invalidateQueries({ queryKey: ["promotions"] });
            queryClient.invalidateQueries({ queryKey: ["promotions", "deleted"] });
        },
        onError: (err) => {
            fetchError(err, setError);
            setErrors(err.response.data.errors ? err.response.data.errors : []);
        },
    });

    // Update
    const { mutateAsync: handleUpdate, isPending: isPendingUpdate } = useMutation<
        unknown,
        ResponseError,
        PromotionReqDTO
    >({
        mutationKey: ["promotion", "update", code],
        mutationFn: (body) => PromotionService.update(body, code!),
        onSuccess: () => {
            setNotification({ title: "Update Promotion", message: "Successfully updated promotion" });
            router.push("/admin/promotions");
            queryClient.invalidateQueries({ queryKey: ["promotions"] });
            queryClient.invalidateQueries({ queryKey: ["promotions", "deleted"] });
            queryClient.invalidateQueries({ queryKey: ["promotion", code] });
        },
        onError: (err) => {
            fetchError(err, setError);
            setErrors(err.response.data.errors ? err.response.data.errors : []);
        },
    });

    // Status
    const { mutateAsync: handleStatus, isPending: isPendingStatus } = useMutation<
        unknown,
        ResponseError,
        "ACTIVE" | "DELETE"
    >({
        mutationKey: ["promotion", "status", code],
        mutationFn: (status) => PromotionService.status(code!, status),
        onSuccess: () => {
            setNotification({ title: "Update Promotion", message: "Successfully updated promotion" });
            router.push("/admin/promotions");
            queryClient.invalidateQueries({ queryKey: ["promotions"] });
            queryClient.invalidateQueries({ queryKey: ["promotions", "deleted"] });
            queryClient.invalidateQueries({ queryKey: ["promotion", code] });
        },
        onError: (err) => {
            fetchError(err, setError);
            setErrors(err.response.data.errors ? err.response.data.errors : []);
        },
    });

    // Clean
    const { mutateAsync: handleClean, isPending: isPendingClean } = useMutation<unknown, ResponseError>({
        mutationKey: ["promotion", "clean"],
        mutationFn: PromotionService.clean,
        onSuccess: () => {
            setNotification({
                title: "Cleaning Trash Promotion",
                message: "Successfully cleaning trash promotion storagge",
            });
            router.push("/admin/promotions");
            queryClient.invalidateQueries({ queryKey: ["promotions"] });
            queryClient.invalidateQueries({ queryKey: ["promotions", "deleted"] });
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
        handleUpdate,
        isPendingUpdate,
        handleStatus,
        isPendingStatus,
        handleClean,
        isPendingClean,
    };
}
