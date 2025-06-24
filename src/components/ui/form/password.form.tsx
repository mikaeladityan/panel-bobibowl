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
    autoFocus?: boolean;
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
    autoFocus,
    placeholder,
    onGenerateClick,
    showValidation = false,
}: PropsPasswordForm) {
    const [showPassword, setShowPassword] = useState(false);
    const [tooltipVisible, setTooltipVisible] = useState(false);

    // Real-time validation checks
    const validation = {
        minLength: value.length >= 8,
        maxLength: value.length <= 100,
        hasUppercase: /[A-Z]/.test(value),
        hasNumber: /[0-9]/.test(value),
        hasSymbol: /[^A-Za-z0-9]/.test(value),
    };

    return (
        <div className="w-full">
            <label htmlFor={name} className="text-xs font-bold uppercase text-gray-700">
                {title || name}
                {required && <sup className="text-red ms-2">* required</sup>}
            </label>

            <div className={twMerge("w-full border border-gray-300 rounded relative", className)}>
                <input
                    type={showPassword ? "text" : "password"}
                    className={twMerge(
                        "bg-gray-100 text-black placeholder:text-black/30 px-3 py-2 text-sm outline-none w-full",
                        onGenerateClick ? "pr-24" : "pr-10"
                    )}
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    autoFocus={autoFocus}
                    placeholder={placeholder}
                    disabled={disabled}
                />

                <div className="absolute top-0 right-0 h-full flex items-center">
                    {onGenerateClick && (
                        <div
                            className="relative h-full flex items-center"
                            onMouseEnter={() => setTooltipVisible(true)}
                            onMouseLeave={() => setTooltipVisible(false)}
                        >
                            <button
                                type="button"
                                onClick={onGenerateClick}
                                className="h-full px-2 text-primary hover:text-red transition-colors w-full"
                                title="Generate password"
                            >
                                <IconRefresh size={16} />
                            </button>

                            {/* Tooltip */}
                            {tooltipVisible && (
                                <div className="absolute -top-6 -left-32 bg-red text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-10">
                                    Generate a new password
                                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-red rotate-45"></div>
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="h-full px-3 text-gray-500 hover:text-gray-700 transition-colors"
                        title={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <IconEye size={16} /> : <IconEyeClosed size={16} />}
                    </button>
                </div>
            </div>

            {/* Password validation messages */}
            {showValidation && (
                <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
                    <div className={`flex items-center ${validation.minLength ? "text-green-500" : "text-gray-500"}`}>
                        <span className="mr-1">{validation.minLength ? "✓" : "•"}</span>
                        <span>Minimum 8 characters</span>
                    </div>
                    <div className={`flex items-center ${validation.maxLength ? "text-green-500" : "text-gray-500"}`}>
                        <span className="mr-1">{validation.maxLength ? "✓" : "•"}</span>
                        <span>Maximum 100 characters</span>
                    </div>
                    <div
                        className={`flex items-center ${validation.hasUppercase ? "text-green-500" : "text-gray-500"}`}
                    >
                        <span className="mr-1">{validation.hasUppercase ? "✓" : "•"}</span>
                        <span>At least one uppercase letter</span>
                    </div>
                    <div className={`flex items-center ${validation.hasNumber ? "text-green-500" : "text-gray-500"}`}>
                        <span className="mr-1">{validation.hasNumber ? "✓" : "•"}</span>
                        <span>At least one number</span>
                    </div>
                    <div className={`flex items-center ${validation.hasSymbol ? "text-green-500" : "text-gray-500"}`}>
                        <span className="mr-1">{validation.hasSymbol ? "✓" : "•"}</span>
                        <span>At least one symbol</span>
                    </div>
                </div>
            )}
        </div>
    );
}
