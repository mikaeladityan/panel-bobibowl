"use client";
import { ChangeEvent, FormEvent, useState } from "react";
import { useAuth, useLogin } from "~/hook/useAuth";
import { LoginDTO } from "~/interface/auth";
import { PageLoading } from "../ui/loading/page.loading";
import { InputForm } from "../ui/form/input.form";
import { PasswordForm } from "../ui/form/password.form";
import { Button } from "../ui/button";
import { ButtonLoader } from "../ui/button/button.loader";
import { IconCheck } from "@tabler/icons-react";

export function Login() {
    const [body, setBody] = useState<LoginDTO>({ email: "", password: "", remember: false });
    const { isLogin } = useAuth();
    const { handleLogin, loadingLogin } = useLogin();

    const changeInput = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setBody((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await handleLogin(body);
    };

    // Tampilkan loading saat cek session atau proses login
    if (loadingLogin) {
        return <PageLoading />;
    }

    // Jika sudah login, jangan render form (redirect di useAuth)
    if (isLogin) {
        return <PageLoading />;
    }
    return (
        <form onSubmit={handleSubmit} className="card">
            <InputForm
                name="email"
                value={body.email}
                onChange={changeInput}
                onFocus
                required
                type="email"
                placeholder="jhon.doe@mail.com"
            />

            <PasswordForm
                name="password"
                value={body.password}
                onChange={changeInput}
                required
                placeholder="P4$SW0rd"
                showValidation={true}
            />

            <button
                type="button"
                className="flex items-center justify-start gap-2"
                onClick={() =>
                    setBody((prev) => ({
                        ...prev,
                        remember: !body.remember,
                    }))
                }
            >
                <div className="flex items-center justify-center w-4 h-4 rounded border border-dark">
                    {body.remember && <IconCheck size={12} stroke={2} />}
                </div>
                <p className="text-[11px] text-gray">Remember me?</p>
            </button>

            <Button type="submit" disabled={loadingLogin} className="mt-5">
                {loadingLogin ? <ButtonLoader /> : "Sign In"}
            </Button>
        </form>
    );
}
