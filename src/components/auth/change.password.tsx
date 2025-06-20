"use client";

import React, { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useChangePassword, useVerify } from "~/hook/useAuth";
import { ResetPasswordDTO } from "~/interface/auth";
import { Button } from "../ui/button";
import { ButtonLoader } from "../ui/button/button.loader";
import { PasswordForm } from "../ui/form/password.form";

const RESEND_KEY = "forgotPasswordTimestamp";
const COOLDOWN = 60; // seconds

export function ChangePassword() {
    const sQuery = useSearchParams();
    const emailParam = sQuery.get("email") || "";
    const codeParam = sQuery.get("code") || "";
    const emailDecode = decodeURI(emailParam);

    const initialBody: ResetPasswordDTO = {
        email: emailDecode,
        code: codeParam,
        password: "",
        passwordConfirmation: "",
        type: "RESET_PASSWORD",
    };
    const { submitSendVerify, loadingSendVerify } = useVerify(emailDecode);
    const { changePassword, loadingChangePassword } = useChangePassword(emailDecode);

    const [body, setBody] = useState<ResetPasswordDTO>(initialBody);
    const [confirmationError, setConfirmationError] = useState(false);
    const [timer, setTimer] = useState<number>(0);

    // Initialize timer from localStorage
    useEffect(() => {
        const ts = localStorage.getItem(RESEND_KEY);
        if (ts) {
            const elapsed = Math.floor((Date.now() - Number(ts)) / 1000);
            const remaining = COOLDOWN - elapsed;
            if (remaining > 0) setTimer(remaining);
        }
    }, []);

    // Countdown interval
    useEffect(() => {
        if (timer <= 0) return;
        const iv = setInterval(() => {
            setTimer((t) => {
                if (t <= 1) {
                    clearInterval(iv);
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(iv);
    }, [timer]);

    const changeInput = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setBody((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const generatePassword = useCallback(() => {
        const lowercase = "abcdefghijklmnopqrstuvwxyz";
        const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const numbers = "0123456789";
        const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

        const allChars = lowercase + uppercase + numbers + symbols;
        let password = "";

        password += lowercase[Math.floor(Math.random() * lowercase.length)];
        password += uppercase[Math.floor(Math.random() * uppercase.length)];
        password += numbers[Math.floor(Math.random() * numbers.length)];
        password += symbols[Math.floor(Math.random() * symbols.length)];

        for (let i = password.length; i < 16; i++) {
            password += allChars[Math.floor(Math.random() * allChars.length)];
        }

        return password
            .split("")
            .sort(() => Math.random() - 0.5)
            .join("");
    }, []);

    const handleGeneratePassword = () => {
        const newPassword = generatePassword();
        setBody({
            ...body,
            password: newPassword,
            passwordConfirmation: newPassword,
        });
    };

    useEffect(() => {
        setConfirmationError(body.passwordConfirmation.length > 0 && body.password !== body.passwordConfirmation);
    }, [body.password, body.passwordConfirmation]);

    const handleChangePassword = async (e: FormEvent) => {
        e.preventDefault();
        await changePassword(body);
        setBody(initialBody);
    };

    const handleSendVerify = async () => {
        await submitSendVerify(body);
        const now = Date.now();
        localStorage.setItem(RESEND_KEY, now.toString());
        setTimer(COOLDOWN);
    };

    return (
        <form onSubmit={handleChangePassword} className="card">
            <p className="text-sm font-medium text-gray">
                Hi, <span className="font-semibold text-red">{emailDecode}</span>, please enter your new password to
                continue the process.
            </p>

            <PasswordForm
                name="password"
                value={body.password}
                onChange={changeInput}
                required
                placeholder="P4$SW0rd"
                onGenerateClick={handleGeneratePassword}
                showValidation={true}
            />

            <PasswordForm
                title="Confirm Password"
                name="passwordConfirmation"
                value={body.passwordConfirmation}
                onChange={changeInput}
                required
                placeholder="Confirm your password"
            />
            {confirmationError && <p className="text-red-500 text-xs mt-1">Passwords do not match</p>}

            <Button type="submit" disabled={loadingChangePassword} className="w-full mt-5">
                {loadingChangePassword ? <ButtonLoader /> : "Save"}
            </Button>

            <Button
                type="button"
                onClick={handleSendVerify}
                disabled={timer > 0 || loadingSendVerify}
                className="w-full border border-dark bg-white text-red"
            >
                {loadingSendVerify ? <ButtonLoader /> : timer > 0 ? `Resend (${timer}s)` : "Resend Code"}
            </Button>
        </form>
    );
}
