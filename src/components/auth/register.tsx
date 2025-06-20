// components/auth/register.tsx
"use client";
import React, { ChangeEvent, FormEvent, useState, useCallback } from "react";
import { useRegister } from "~/hook/useAuth";
import { RegisterDTO } from "~/interface/auth";
import { InputForm } from "../ui/form/input.form";
import { PasswordForm } from "../ui/form/password.form";
import { Button } from "../ui/button";
import { ButtonLoader } from "../ui/button/button.loader";

export function Register() {
    const [body, setBody] = useState<RegisterDTO>({
        email: "",
        password: "",
        passwordConfirmation: "",
    });

    const [confirmationError, setConfirmationError] = useState(false);
    const { handleRegister, loadingRegister } = useRegister();

    const changeInput = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setBody((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await handleRegister(body);
    };

    // Generate password kuat
    const generatePassword = useCallback(() => {
        const lowercase = "abcdefghijklmnopqrstuvwxyz";
        const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const numbers = "0123456789";
        const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

        const allChars = lowercase + uppercase + numbers + symbols;
        let password = "";

        // Pastikan minimal 1 karakter dari setiap tipe
        password += lowercase[Math.floor(Math.random() * lowercase.length)];
        password += uppercase[Math.floor(Math.random() * uppercase.length)];
        password += numbers[Math.floor(Math.random() * numbers.length)];
        password += symbols[Math.floor(Math.random() * symbols.length)];

        // Tambahkan karakter acak hingga panjang 16
        for (let i = password.length; i < 16; i++) {
            password += allChars[Math.floor(Math.random() * allChars.length)];
        }

        // Acak urutan password
        return password
            .split("")
            .sort(() => Math.random() - 0.5)
            .join("");
    }, []);

    // Handler untuk generate password
    const handleGeneratePassword = () => {
        const newPassword = generatePassword();
        setBody({
            ...body,
            password: newPassword,
            passwordConfirmation: newPassword,
        });
    };

    // Validasi konfirmasi password
    React.useEffect(() => {
        setConfirmationError(body.passwordConfirmation.length > 0 && body.password !== body.passwordConfirmation);
    }, [body.password, body.passwordConfirmation]);

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
                onGenerateClick={handleGeneratePassword}
                showValidation={true}
            />

            <PasswordForm
                title="Password Confirmation"
                name="passwordConfirmation"
                value={body.passwordConfirmation}
                onChange={changeInput}
                required
                placeholder="Password Confirmation"
            />
            {confirmationError && <p className="text-red-500 text-xs mt-1">Password is not same!</p>}

            <Button type="submit" disabled={loadingRegister} className="mt-5">
                {loadingRegister ? <ButtonLoader /> : "Register"}
            </Button>
        </form>
    );
}
