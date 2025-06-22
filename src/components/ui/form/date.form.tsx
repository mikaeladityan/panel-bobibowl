// components/ui/form/input.form.tsx
import { IconAlertCircle } from "@tabler/icons-react";
import { ChangeEvent, HTMLInputTypeAttribute } from "react";
import { twMerge } from "tailwind-merge";

type PropsDateForm = {
    title?: string;
    name: string;
    value: Date | string | null;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    type?: HTMLInputTypeAttribute;
    disabled?: boolean;
    required?: boolean;
    onFocus?: boolean;
    placeholder?: string;
    error?: string;
    step?: number;
    min?: number;
    max?: number;
};

export function DateForm({
    title,
    name,
    value,
    onChange,
    className,
    disabled,
    required,
    onFocus,
    placeholder,
    error,
    step,
    max,
    min,
}: PropsDateForm) {
    return (
        <div className="w-full">
            <label htmlFor={name} className="text-xs font-bold uppercase text-gray-700">
                {title || name} {required && <sup className="text-red ms-2">*required</sup>}
            </label>
            <div
                className={twMerge(
                    "w-full border border-gray-300 rounded-lg overflow-hidden relative",
                    className,
                    error && "border-red"
                )}
            >
                <input
                    type={"date"}
                    className="bg-gray-100 px-3 py-2 text-sm text-black placeholder:text-black/30 outline-none w-full disabled:opacity-60 disabled:cursor-not-allowed"
                    name={name}
                    value={value?.toString()}
                    onChange={onChange}
                    required={required}
                    autoFocus={onFocus}
                    placeholder={placeholder}
                    disabled={disabled}
                    step={step}
                    min={min}
                    max={max}
                />
            </div>
            {error && (
                <p className="text-red text-xs mt-1 flex items-center justify-start gap-2">
                    <IconAlertCircle size={14} stroke={2} />
                    <span>{error}</span>
                </p>
            )}
        </div>
    );
}
