// components/ui/form/password.form.tsx
import { IconEye, IconEyeClosed, IconRefresh } from "@tabler/icons-react";
import { ChangeEvent, useState } from "react";
import { twMerge } from "tailwind-merge";

type PropsPasswordForm = {
    title?: string;
    name: string;
    value: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    disabled?: boolean;
    required?: boolean;
    onFocus?: boolean;
    placeholder?: string;
    onGenerateClick?: () => void;
    showValidation?: boolean;
};

export function PasswordForm({
    title,
    name,
    value,
    onChange,
    className,
    disabled,
    required,
    onFocus,
    placeholder,
    onGenerateClick,
    showValidation = false,
}: PropsPasswordForm) {
    const [openPassword, setOpenPassword] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    // Validasi real-time
    const validation = {
        minLength: value.length >= 8,
        maxLength: value.length <= 100,
        hasCapital: /[A-Z]/.test(value),
        hasNumber: /[0-9]/.test(value),
        hasSymbol: /[^A-Za-z0-9]/.test(value),
    };

    return (
        <div className="w-full">
            <label htmlFor={name} className="text-xs font-bold uppercase text-gray-700">
                {title || name} {required && <sup className="text-red ms-2">*required</sup>}
            </label>
            <div className={twMerge("w-full border border-gray-300 rounded relative", className)}>
                <input
                    type={openPassword ? "text" : "password"}
                    className={twMerge(
                        "bg-gray-100 text-black placeholder:text-black/30 px-3 py-2 text-sm outline-none w-full",
                        onGenerateClick ? "pr-24" : "pr-10"
                    )}
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    autoFocus={onFocus}
                    placeholder={placeholder}
                    disabled={disabled}
                />

                <div className="absolute top-0 right-0 h-full flex items-center">
                    {onGenerateClick && (
                        <div
                            className="relative h-full flex items-center"
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                        >
                            <button
                                type="button"
                                onClick={onGenerateClick}
                                className="h-full px-2 text-primary hover:text-red transition-colors w-full"
                            >
                                <IconRefresh size={16} />
                            </button>

                            {/* Tooltip */}
                            {showTooltip && (
                                <div className="absolute -top-6 -left-13 bg-red text-white text-xs px-2 py-1 rounded shadow-lg z-10 text-nowrap">
                                    Generate password
                                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-red rotate-45"></div>
                                </div>
                            )}
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={() => setOpenPassword(!openPassword)}
                        className="h-full px-3 text-gray-500 hover:text-gray-700 transition-colors"
                        title={openPassword ? "Hide password" : "Show password"}
                    >
                        {openPassword ? <IconEye size={16} /> : <IconEyeClosed size={16} />}
                    </button>
                </div>
            </div>

            {/* Validasi password */}
            {showValidation && (
                <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
                    <div className={`flex items-center ${validation.minLength ? "text-green-500" : "text-gray-500"}`}>
                        <span className="mr-1">{validation.minLength ? "✓" : "•"}</span>
                        <span>Min 8 karakter</span>
                    </div>
                    <div className={`flex items-center ${validation.maxLength ? "text-green-500" : "text-gray-500"}`}>
                        <span className="mr-1">{validation.maxLength ? "✓" : "•"}</span>
                        <span>Max 100 karakter</span>
                    </div>
                    <div className={`flex items-center ${validation.hasCapital ? "text-green-500" : "text-gray-500"}`}>
                        <span className="mr-1">{validation.hasCapital ? "✓" : "•"}</span>
                        <span>1 huruf besar</span>
                    </div>
                    <div className={`flex items-center ${validation.hasNumber ? "text-green-500" : "text-gray-500"}`}>
                        <span className="mr-1">{validation.hasNumber ? "✓" : "•"}</span>
                        <span>1 angka</span>
                    </div>
                    <div className={`flex items-center ${validation.hasSymbol ? "text-green-500" : "text-gray-500"}`}>
                        <span className="mr-1">{validation.hasSymbol ? "✓" : "•"}</span>
                        <span>1 simbol</span>
                    </div>
                </div>
            )}
        </div>
    );
}
