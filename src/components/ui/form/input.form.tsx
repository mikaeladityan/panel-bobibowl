// components/ui/form/input.form.tsx
import { ChangeEvent, HTMLInputTypeAttribute } from "react";
import { twMerge } from "tailwind-merge";

type PropsInputForm = {
    title?: string;
    name: string;
    value: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    type?: HTMLInputTypeAttribute;
    disabled?: boolean;
    required?: boolean;
    onFocus?: boolean;
    placeholder?: string;
};

export function InputForm({
    title,
    name,
    value,
    onChange,
    className,
    type = "text",
    disabled,
    required,
    onFocus,
    placeholder,
}: PropsInputForm) {
    return (
        <div className="w-full">
            <label htmlFor={name} className="text-xs font-bold uppercase text-gray-700">
                {title || name} {required && <sup className="text-red ms-2">*required</sup>}
            </label>
            <div className={twMerge("w-full border border-gray-300 rounded-lg overflow-hidden relative", className)}>
                <input
                    type={type}
                    className="bg-gray-100 px-3 py-2 text-sm text-black placeholder:text-black/30 outline-none w-full"
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    autoFocus={onFocus}
                    placeholder={placeholder}
                    disabled={disabled}
                />
            </div>
        </div>
    );
}
