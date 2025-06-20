"use client";
import { IconCloudUpload, IconX } from "@tabler/icons-react";
import { SetStateAction } from "jotai";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { ButtonLoader } from "~/components/ui/button/button.loader";
import { InputForm } from "~/components/ui/form/input.form";
import { TextareaForm } from "~/components/ui/form/textarea.form";
import { useForm, useCategory } from "~/hook/useCategory";
import { CategoryReqDTO } from "~/interface/admin/category";

export function CategoryUpdate({
    slug,
    setUpdated,
}: {
    slug: string;
    setUpdated: React.Dispatch<SetStateAction<string | null>>;
}) {
    const { category } = useCategory(false, slug);
    const [body, setBody] = useState<CategoryReqDTO>({
        title: category?.title || "",
        slug: category?.slug || "",
        description: "",
    });
    const { handleUpdate, isPendingUpdate, errors } = useForm(setBody, slug);

    useEffect(() => {
        if (!category || !slug) setBody({ title: "", slug: "", description: "" });
        else setBody({ title: category.title, slug: category.slug, description: category.description || "" });
    }, [slug, category]);

    const inputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
                placeholder="New category"
                error={errors.find((err) => err.path[0] === "title")?.message}
            />
            <TextareaForm
                name="description"
                value={body.description || ""}
                onChange={inputChange}
                error={errors.find((err) => err.path[0] === "description")?.message}
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
