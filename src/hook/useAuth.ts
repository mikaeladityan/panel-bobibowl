"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { ROLE } from "~/interface/account";
import { LoginDTO, RegisterDTO, ResetPasswordDTO, SendVerifyDTO, VerifyReqDTO } from "~/interface/auth";
import { fetchError, ResponseError } from "~/lib/util/error";
import { AuthService } from "~/service/auth";
import { errorAtom, notificationAtom } from "~/store";

export function useAccount() {
    const {
        data: account,
        isFetching: isFetchAccount,
        isError: accountError,
        isRefetching: isRefetchingAccount,
        isLoading: isLoadingAccount,
    } = useQuery({
        queryKey: ["account"],
        queryFn: AuthService.account,
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 15 * 60 * 1000,
    });
    return { account, isFetchAccount, isLoadingAccount, isRefetchingAccount, accountError };
}

export function useRegister() {
    const setError = useSetAtom(errorAtom);
    const router = useRouter();
    const setNotification = useSetAtom(notificationAtom);
    const { mutateAsync: handleRegister, isPending: loadingRegister } = useMutation<
        unknown,
        ResponseError,
        RegisterDTO
    >({
        mutationKey: ["register"],
        mutationFn: (body) => AuthService.register(body),
        onError: (err) => {
            fetchError(err, setError);
        },
        onSuccess: () => {
            router.replace("/login");
            setNotification({ title: "Account Registration", message: "Account registration successful" });
        },
    });

    return { handleRegister, loadingRegister };
}

export function useLogin() {
    const queryClient = useQueryClient();
    const setError = useSetAtom(errorAtom);
    const router = useRouter();

    const { mutateAsync: handleLogin, isPending: loadingLogin } = useMutation<unknown, ResponseError, LoginDTO>({
        mutationKey: ["login"],
        mutationFn: (body) => AuthService.login(body),
        onError: (err) => {
            fetchError(err, setError);
        },
        onSuccess: () => {
            router.replace("/");
            queryClient.invalidateQueries({ queryKey: ["account"] });
        },
    });

    return { handleLogin, loadingLogin };
}

export function useLogout() {
    const setError = useSetAtom(errorAtom);
    const router = useRouter();
    const queryClient = useQueryClient();

    const { mutateAsync: handleLogout, isPending: loadingLogout } = useMutation({
        mutationKey: ["logout"],
        mutationFn: AuthService.logout,
        onError: (err: ResponseError) => {
            fetchError(err, setError);
        },
        onSuccess: () => {
            router.replace("/login");
            queryClient.removeQueries({ queryKey: ["account"], type: "all" });
        },
    });

    return { handleLogout, loadingLogout };
}

export function useAuth() {
    const { account, isLoadingAccount } = useAccount();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const publicPaths = ["/login", "/register", "/forgot", "/reset"];
        if (!isLoadingAccount && !account && !publicPaths.includes(pathname)) {
            router.replace("/login");
        }
        if (!isLoadingAccount && account && pathname === "/login") {
            router.replace("/");
        }
    }, [account, isLoadingAccount, router, pathname]);

    return { isLoadingAccount, isLogin: Boolean(account) };
}

export const useRole = (allowedRoles: ROLE[]) => {
    const { account, isLoadingAccount } = useAccount();
    const router = useRouter();
    const setError = useSetAtom(errorAtom);
    const pathname = usePathname();

    useEffect(() => {
        const publicPaths = ["/login", "/register", "/forgot", "/reset"];
        if (!isLoadingAccount && !account && !publicPaths.includes(pathname)) {
            router.replace("/login");
        }
        if (account && !allowedRoles.includes(account.role)) {
            setError({ message: "You don't have permission to access this page!" });
            router.replace("/");
        }
    }, [account, allowedRoles, router, setError, isLoadingAccount, pathname]);
};

export const useVerify = (email: string) => {
    const router = useRouter();
    const setError = useSetAtom(errorAtom);
    const setNotification = useSetAtom(notificationAtom);
    const queryClient = useQueryClient();

    const { mutateAsync: submitVerify, isPending: loadingVerify } = useMutation<unknown, ResponseError, VerifyReqDTO>({
        mutationKey: ["verify", email],
        mutationFn: (body) => AuthService.verify(body),
        onSuccess: () => {
            router.replace("/login");
            setNotification({
                title: "Email Verification",
                message: "Email verification successful, please log in with your account",
            });
        },
        onError: (err) => {
            fetchError(err, setError);
        },
    });

    const { mutateAsync: submitSendVerify, isPending: loadingSendVerify } = useMutation<
        unknown,
        ResponseError,
        SendVerifyDTO
    >({
        mutationKey: ["verify", email, "resend"],
        mutationFn: (body) => AuthService.sendVerify(body),
        onSuccess: () => {
            router.replace("/login");
            setNotification({
                title: "Email Verification Resent",
                message:
                    "Verification email has been resent, please check your email to complete the verification process",
            });
            queryClient.invalidateQueries({ queryKey: ["verify", email] });
        },
        onError: (err) => {
            fetchError(err, setError);
        },
    });

    return { submitVerify, loadingVerify, submitSendVerify, loadingSendVerify };
};

export const useChangePassword = (email: string) => {
    const router = useRouter();
    const setError = useSetAtom(errorAtom);
    const setNotification = useSetAtom(notificationAtom);
    const { mutateAsync: changePassword, isPending: loadingChangePassword } = useMutation<
        unknown,
        ResponseError,
        ResetPasswordDTO
    >({
        mutationKey: ["changePassword", email],
        mutationFn: (body) => AuthService.changePassword(body),
        onSuccess: () => {
            router.replace("/login");
            setNotification({
                title: "Password Changed",
                message: "Password changed successfully, please log in with your new credentials",
            });
        },
        onError: (err) => {
            fetchError(err, setError);
        },
    });

    return { changePassword, loadingChangePassword };
};
