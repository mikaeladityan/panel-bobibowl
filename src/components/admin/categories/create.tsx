"use client";
import { IconCloudUpload } from "@tabler/icons-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { Button } from "~/components/ui/button";
import { ButtonLoader } from "~/components/ui/button/button.loader";
import { InputForm } from "~/components/ui/form/input.form";
import { TextareaForm } from "~/components/ui/form/textarea.form";
import { useForm } from "~/hook/useCategory";
import { CategoryReqDTO } from "~/interface/admin/category";

export function CategoryCreate() {
    const [body, setBody] = useState<CategoryReqDTO>({ title: "", slug: "" });
    const { handleCreate, isPendingCreate, errors } = useForm(setBody);
    const inputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setBody((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        await handleCreate(body);
    }
    const [slugable, setSlugable] = useState(true);
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
            <div className="flex items-end justify-between gap-5">
                <InputForm
                    name="slug"
                    value={body.slug}
                    className="w-full"
                    placeholder="new-type"
                    onChange={inputChange}
                    disabled={slugable}
                    error={errors.find((err) => err.path[0] === "slug")?.message}
                />
                <Button onClick={() => setSlugable(!slugable)} type="button" className="px-3 py-2.5 w-fit text-xs">
                    {slugable ? "Manual" : "Automation"}
                </Button>
            </div>
            <TextareaForm
                name="description"
                value={body.description || ""}
                onChange={inputChange}
                error={errors.find((err) => err.path[0] === "description")?.message}
            />
            <Button type="submit" className="mt-5 text-sm bg-yellow text-red">
                {isPendingCreate ? (
                    <ButtonLoader />
                ) : (
                    <>
                        <IconCloudUpload /> <span>Save</span>
                    </>
                )}
            </Button>
        </form>
    );
}
