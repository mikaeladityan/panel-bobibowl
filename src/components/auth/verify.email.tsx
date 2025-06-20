"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useVerify } from "~/hook/useAuth";
import { VerifyReqDTO } from "~/interface/auth";
import { Button } from "../ui/button";
import { ButtonLoader } from "../ui/button/button.loader";

const RESEND_KEY = "verifyResendTimestamp";
const COOLDOWN = 60; // seconds

export function VerifyEmail() {
    const sQuery = useSearchParams();
    const emailParam = sQuery.get("email") || "";
    const codeParam = sQuery.get("code") || "";
    const emailDecode = decodeURI(emailParam);

    const initialBody: VerifyReqDTO = {
        email: emailDecode,
        code: codeParam,
        type: "REGISTER",
    };
    const { submitVerify, submitSendVerify, loadingVerify, loadingSendVerify } = useVerify(emailDecode);

    const [body] = useState<VerifyReqDTO>(initialBody);
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

    const handleVerify = async () => {
        await submitVerify(body);
    };

    const handleSendVerify = async () => {
        await submitSendVerify(body);
        const now = Date.now();
        localStorage.setItem(RESEND_KEY, now.toString());
        setTimer(COOLDOWN);
    };

    return (
        <section className="card">
            <p className="text-sm font-medium text-gray-500">
                Hi, <span className="font-semibold text-red">{emailDecode}</span>, thank you for signing up. Please
                continue the verification process below.
            </p>

            <Button type="button" onClick={handleVerify} disabled={loadingVerify} className="w-full mt-5">
                {loadingVerify ? <ButtonLoader /> : "Confirm Email"}
            </Button>

            <Button
                type="button"
                onClick={handleSendVerify}
                disabled={timer > 0 || loadingSendVerify}
                className="w-full border border-dark bg-white text-red"
            >
                {loadingSendVerify ? <ButtonLoader /> : timer > 0 ? `Resend (${timer}s)` : "Resend Code"}
            </Button>
        </section>
    );
}
