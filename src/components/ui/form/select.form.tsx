import { IconChevronDown, IconLoader3 } from "@tabler/icons-react";
import { ChangeEvent } from "react";
import { twMerge } from "tailwind-merge";
export interface ListFormValue {
    value: string | number;
    title: string;
}
type propsSelectForm = {
    title: string;
    name: string;
    value: string | number;
    className?: string;
    required?: boolean;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    disabled?: boolean;
    error: string;
    list: Array<ListFormValue>;
};

export function SelectForm({
    title,
    name,
    value,
    required,
    className,
    onChange,
    error,
    disabled,
    list,
}: propsSelectForm) {
    return (
        <div className="flex flex-col gap-y-1.5 w-full">
            <label htmlFor={name} className="text-xs inline w-full font-semibold text-gray-600">
                {title}
                {required && <sup className="text-red ms-1 font-normal">(required)</sup>}
            </label>
            <div
                className={twMerge(
                    "relative w-full px-3 py-2 text-sm font-semibold border border-gray-300 rounded-lg",
                    disabled ? "bg-gray-200" : "bg-transparent",
                    className
                )}
            >
                <select
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="w-full bg-transparent appearance-none outline-none"
                    required={required}
                    disabled={disabled}
                >
                    {list.length === 0 ? (
                        <option>Record is not found!</option>
                    ) : (
                        <>
                            <option value={0}>Select one</option>
                            {list.map((l) => (
                                <option value={l.value} key={l.value}>
                                    {l.title}
                                </option>
                            ))}
                        </>
                    )}
                </select>

                <div className="absolute top-2.5 text-gray-600 right-3">
                    {disabled ? (
                        <IconLoader3 size={18} stroke={2} className="animate-spin" />
                    ) : (
                        <IconChevronDown size={18} stroke={2} />
                    )}
                </div>
            </div>
            {error && <span className="text-[11px] -mt-1 text-red">{error}</span>}
        </div>
    );
}
