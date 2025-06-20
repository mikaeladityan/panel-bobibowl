"use client";
import { IconArrowBack } from "@tabler/icons-react";
import Link from "next/link";
import { InputForm } from "../ui/form/input.form";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useVerify } from "~/hook/useAuth";
import { ButtonLoader } from "../ui/button/button.loader";

const RESEND_KEY = "forgotPasswordTimestamp";
const COOLDOWN = 60; // seconds

export function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [timer, setTimer] = useState<number>(0);
    const { submitSendVerify, loadingSendVerify } = useVerify(email);

    // Initialize timer from localStorage
    useEffect(() => {
        const ts = localStorage.getItem(RESEND_KEY);
        if (ts) {
            const elapsed = Math.floor((Date.now() - Number(ts)) / 1000);
            const remaining = COOLDOWN - elapsed;
            if (remaining > 0) setTimer(remaining);
        }
    }, []);

    // Interval to decrease timer
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

    const handleSendVerify = async (e: FormEvent) => {
        e.preventDefault();

        await submitSendVerify({ email, type: "RESET_PASSWORD" });
        const now = Date.now();
        localStorage.setItem(RESEND_KEY, now.toString());
        setTimer(COOLDOWN);
        setEmail("");
    };

    return (
        <form className="card text-gray-500" onSubmit={handleSendVerify}>
            <Link
                href={"/login"}
                className="text-sm font-semibold text-red hover:text-primary transition-colors ease-in-out duration-200 flex items-center justify-start gap-2"
            >
                <IconArrowBack size={20} stroke={2} />
                Back
            </Link>
            <p className="text-sm text-gray">
                Please enter your member account email to proceed with the password reset process.
            </p>

            <InputForm
                type="email"
                name="email"
                onFocus
                required
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder="jhon.doe@mail.com"
            />

            <Button type="submit">{loadingSendVerify ? <ButtonLoader /> : "Confirm"}</Button>
        </form>
    );
}
