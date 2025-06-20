"use client";
import { IconCloudUpload, IconX } from "@tabler/icons-react";
import { SetStateAction } from "jotai";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { ButtonLoader } from "~/components/ui/button/button.loader";
import { InputForm } from "~/components/ui/form/input.form";
import { useForm, useType } from "~/hook/useType";
import { TypeReqDTO } from "~/interface/admin/type";

export function TypeUpdate({
    slug,
    setUpdated,
}: {
    slug: string;
    setUpdated: React.Dispatch<SetStateAction<string | null>>;
}) {
    const { type } = useType(false, slug);
    const [body, setBody] = useState<TypeReqDTO>({ title: type?.title || "", slug: type?.slug || "" });
    const { handleUpdate, isPendingUpdate, errors } = useForm(setBody, slug);

    useEffect(() => {
        if (!type || !slug) setBody({ title: "", slug: "" });
        else setBody({ title: type.title, slug: type.slug });
    }, [slug, type]);

    const inputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setBody((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        await handleUpdate(body);
        setUpdated(null);
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-y-1">
            <InputForm
                name="title"
                value={body.title}
                onChange={inputChange}
                required
                placeholder="New Type"
                error={errors.find((err) => err.path[0] === "title")?.message}
            />

            <div className="grid grid-cols-2 gap-3">
                <Button type="button" onClick={() => setUpdated(null)} className="mt-5 text-sm bg-red text-yellow">
                    {isPendingUpdate ? (
                        <ButtonLoader />
                    ) : (
                        <>
                            <IconX /> <span>Cancel</span>
                        </>
                    )}
                </Button>
                <Button type="submit" className="mt-5 text-sm bg-yellow text-red">
                    {isPendingUpdate ? (
                        <ButtonLoader />
                    ) : (
                        <>
                            <IconCloudUpload /> <span>Update</span>
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
