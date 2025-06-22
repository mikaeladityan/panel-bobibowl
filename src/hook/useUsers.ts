import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { STATUS } from "~/interface";
import { ROLE } from "~/interface/account";
import { UsersQueryParams } from "~/interface/users";
import { fetchError, ResponseError } from "~/lib/util/error";
import { UsersService } from "~/service/users";
import { errorAtom, notificationAtom } from "~/store";

export const useUsers = (params?: UsersQueryParams) => {
    return useQuery({
        queryKey: ["users", params],
        queryFn: () => UsersService.list(params!),
        enabled: !!params,
    });
};

export const useUser = (id: string) => {
    const {
        data: user,
        isLoading: isLoadingUser,
        isRefetching: isRefetchingUser,
    } = useQuery({
        queryKey: ["user", id],
        queryFn: () => UsersService.find(id),
        enabled: !!id,
    });

    return { user, isLoadingUser, isRefetchingUser };
};

export function useFormUser(id: string) {
    const setError = useSetAtom(errorAtom);
    const setNotification = useSetAtom(notificationAtom);
    const queryClient = useQueryClient();
    const { mutateAsync: handleStatus, isPending: isPendingStatus } = useMutation<
        void,
        ResponseError,
        { id: string; status: STATUS }
    >({
        mutationKey: ["user", "status", id],
        mutationFn: ({ status }) => UsersService.status(id, status),
        onSuccess: () => {
            setNotification({ title: "Update User Status", message: "Successfully to update status user" });
            queryClient.invalidateQueries({ queryKey: ["users"] });
            queryClient.invalidateQueries({ queryKey: ["user", id] });
        },
        onError: (err) => [fetchError(err, setError)],
    });

    const { mutateAsync: handleRole, isPending: isPendingRole } = useMutation<
        void,
        ResponseError,
        { id: string; role: ROLE }
    >({
        mutationKey: ["user", "role", id],
        mutationFn: ({ role }) => UsersService.role(id, role),
        onSuccess: () => {
            setNotification({ title: "Update User Role", message: "Successfully to update role user" });
            queryClient.invalidateQueries({ queryKey: ["users"] });
            queryClient.invalidateQueries({ queryKey: ["user", id] });
        },
        onError: (err) => [fetchError(err, setError)],
    });

    return { handleRole, handleStatus, isPendingRole, isPendingStatus };
}
