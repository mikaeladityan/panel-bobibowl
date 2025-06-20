// components/ui/form/input.form.tsx
import { IconAlertCircle } from "@tabler/icons-react";
import { ChangeEvent } from "react";
import { twMerge } from "tailwind-merge";

type PropsTextareaForm = {
    title?: string;
    name: string;
    value: string;
    onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    className?: string;
    disabled?: boolean;
    required?: boolean;
    onFocus?: boolean;
    placeholder?: string;
    error?: string;
};

export function TextareaForm({
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
}: PropsTextareaForm) {
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
                <textarea
                    className="bg-gray-100 text-black placeholder:text-black/30 px-3 py-2 text-sm outline-none w-full"
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    autoFocus={onFocus}
                    placeholder={placeholder}
                    disabled={disabled}
                    rows={5}
                />
            </div>
            <div className="text-end text-xs">
                {value.length}
                <span className="font-bold">/1000</span>
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
