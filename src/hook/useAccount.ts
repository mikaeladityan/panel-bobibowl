import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { UserAddressReqDTO, UserReqDTO } from "~/interface/account";
import { fetchError, ResponseError } from "~/lib/util/error";
import { AccountService } from "~/service/account";
import { AddressService } from "~/service/address";
import { errorAtom, notificationAtom } from "~/store";

export function useAccount() {
    const {
        data: userAccount,
        isLoading: userAccountLoading,
        isFetching: isFetchingUserAccount,
        isRefetching: isRefetchingUserAccount,
    } = useQuery({
        queryKey: ["account", "detail"],
        queryFn: AccountService.find,
    });

    return { userAccount, userAccountLoading, isFetchingUserAccount, isRefetchingUserAccount };
}

export function useUpdateAccount() {
    const queryClient = useQueryClient();
    const setError = useSetAtom(errorAtom);
    const setNotification = useSetAtom(notificationAtom);

    const { mutateAsync: submitUpdateAccount, isPending: loadingUpdateAccount } = useMutation<
        unknown,
        ResponseError,
        UserReqDTO
    >({
        mutationKey: ["update", "account", "detail"],
        mutationFn: (body) => AccountService.createOrUpdate(body),
        onError: (err) => {
            fetchError(err, setError);
        },
        onSuccess: () => {
            setNotification({ title: `Data Update`, message: "Data updated successfully!" });
            queryClient.invalidateQueries({ queryKey: ["account", "detail"] });
        },
    });

    return { submitUpdateAccount, loadingUpdateAccount };
}

export function useUpdatePhotoAccount() {
    const queryClient = useQueryClient();
    const setError = useSetAtom(errorAtom);
    const uploadPhotoUserMutation = useMutation({
        mutationKey: ["account", "detail", "update", "photo"],
        mutationFn: ({ file }: { file: File }) => AccountService.uploadPhotoUser(file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["account", "detail"] });
        },
        onError: (err: ResponseError) => {
            fetchError(err, setError);
        },
    });

    return { uploadPhotoUserMutation };
}

export function useAddress() {
    const {
        data: addresses,
        isLoading: loadingAddresses,
        isRefetching: isRefetchingAddresses,
    } = useQuery({
        queryKey: ["addresses"],
        queryFn: AddressService.list,
    });

    return { addresses, loadingAddresses, isRefetchingAddresses };
}

export function useFindAddress(addressId?: number) {
    const {
        data: address,
        isLoading: loadingAddress,
        isRefetching: isRefetchingAddress,
    } = useQuery({
        queryKey: ["address", addressId],
        queryFn: () => AddressService.find(addressId!),
        enabled: !!addressId,
        staleTime: 5 * 60 * 1000,
    });

    return { address, loadingAddress, isRefetchingAddress };
}

export function useFormAddress(addressId?: number) {
    const queryClient = useQueryClient();
    const setError = useSetAtom(errorAtom);
    const setNotification = useSetAtom(notificationAtom);

    const { mutateAsync: handleCreateAddress, isPending: isPendingCreateAddress } = useMutation<
        unknown,
        ResponseError,
        UserAddressReqDTO
    >({
        mutationKey: ["addrees", "create"],
        mutationFn: (body) => AddressService.create(body),
        onSuccess: () => {
            setNotification({ title: "Add Address", message: "New address added successfully" });
            queryClient.invalidateQueries({ queryKey: ["addresses"] });
        },
        onError: (err) => {
            fetchError(err, setError);
        },
    });

    const { mutateAsync: updateAddress, isPending: isPendingUpdateAddress } = useMutation<
        unknown,
        ResponseError,
        UserAddressReqDTO
    >({
        mutationKey: ["addrees", "update", addressId],
        mutationFn: (body) => AddressService.update(body, addressId!),
        onSuccess: () => {
            setNotification({ title: "Update Address", message: "Address updated successfully" });
            queryClient.invalidateQueries({ queryKey: ["address", addressId] });
            queryClient.invalidateQueries({ queryKey: ["addresses"] });
        },
        onError: (err) => {
            fetchError(err, setError);
        },
    });

    const { mutateAsync: deleteAddress, isPending: isPendingDeleteAddress } = useMutation<
        unknown,
        ResponseError,
        { addressId: number }
    >({
        mutationKey: ["addrees", "delete", addressId],
        mutationFn: () => AddressService.delete(addressId!),
        onSuccess: () => {
            setNotification({ title: "Delete Address", message: "Address deleted successfully" });
            queryClient.invalidateQueries({ queryKey: ["address", addressId] });
            queryClient.invalidateQueries({ queryKey: ["addresses"] });
        },
        onError: (err) => {
            fetchError(err, setError);
        },
    });

    return {
        handleCreateAddress,
        isPendingCreateAddress,
        updateAddress,
        isPendingUpdateAddress,
        deleteAddress,
        isPendingDeleteAddress,
    };
}
