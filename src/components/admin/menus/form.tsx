import { IconPlus, IconSend } from "@tabler/icons-react";
import { SetStateAction } from "jotai";
import React, { ChangeEvent, FormEvent, useCallback, useState } from "react";
import { Button } from "~/components/ui/button";
import { InputForm } from "~/components/ui/form/input.form";
import { TextareaForm } from "~/components/ui/form/textarea.form";
import { FileForm } from "~/components/ui/form/file.form";
import { MenuReqDTO } from "~/interface/admin/menu";
import { useCategory } from "~/hook/useCategory";
import { useType } from "~/hook/useType";
import { ListFormValue, SelectForm } from "~/components/ui/form/select.form";
import { ButtonLoader } from "~/components/ui/button/button.loader";
import { useRouter } from "next/navigation";

type propsFormMenu = {
    body: MenuReqDTO;
    setBody: React.Dispatch<SetStateAction<MenuReqDTO>>;
    file: File | null;
    setFile: React.Dispatch<SetStateAction<File | null>>;
    onSubmit: (e: FormEvent) => Promise<void>;
    loading: boolean;
    errors: { path: string; message: string }[];
};

export function FormMenu({ body, setBody, onSubmit, file, setFile, loading, errors }: propsFormMenu) {
    const router = useRouter();
    const { categories, isLoadingCategories } = useCategory(false);
    const { types, isLoadingTypes } = useType(false);
    const [slugable, setSlugable] = useState(true);
    const [errMsg, setErrMsg] = useState("");

    const handleChangeInput = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setBody((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const dataSelectListCategories: Array<ListFormValue> =
        categories?.map((c) => ({
            title: c.title,
            value: c.id,
        })) || [];
    const dataSelectListTypes: Array<ListFormValue> =
        types?.map((c) => ({
            title: c.title,
            value: c.id,
        })) || [];

    const handleFiles = useCallback(
        (files: FileList) => {
            const selected = files[0];
            if (!selected) return;
            const isValidType = ["image/png", "image/jpeg", "image/jpg"].includes(selected.type);
            const isValidSize = selected.size <= 5 * 1024 * 1024;
            if (!isValidType) return setErrMsg("Only PNG, JPG, or JPEG formats are allowed.");
            if (!isValidSize) return setErrMsg("File size must be under 5MB.");
            setErrMsg("");
            setFile(selected);
            const reader = new FileReader();
            reader.onload = () => {
                const dataUrl = reader.result as string;
                setBody({ ...body, image: dataUrl });
            };
            reader.readAsDataURL(selected);
        },
        [body, setBody, setFile]
    );
    const clearFile = () => {
        setBody({ ...body, image: "" });
        setFile(null);
    };

    return (
        <>
            <form
                onSubmit={onSubmit}
                className="flex flex-col-reverse md:flex-row-reverse items-start gap-5 w-full min-h-svh"
            >
                <Button type="submit" className="w-full md:w-fit">
                    {loading ? (
                        <ButtonLoader />
                    ) : (
                        <>
                            <span>Submit</span> <IconSend className="rotate-45" size={20} />
                        </>
                    )}
                </Button>
                <div className="flex flex-col gap-y-5 w-full">
                    <div className="bg-gray-50 rounded-xl w-full shadow-lg p-5">
                        <h3 className="font-medium text-gray-700 mb-3">File Image Menu</h3>
                        <FileForm
                            handleFiles={handleFiles}
                            setFile={setFile}
                            errorMsg={errMsg}
                            file={file}
                            image={body.image || ""}
                            clearFile={clearFile}
                        />
                    </div>
                </div>

                <div className="md:w-full space-y-5 w-full">
                    <div className="flex-1 bg-gray-50 rounded-xl shadow-lg p-5 grid grid-cols-1 gap-y-4 w-full">
                        <InputForm
                            name="title"
                            placeholder="Nama menu..."
                            required
                            disabled={loading}
                            value={body.title}
                            onChange={handleChangeInput}
                            title="Name Menu"
                            onFocus
                            error={errors.find((e) => e.path[0] === "title")?.message}
                        />

                        <div className="flex items-end justify-start gap-2">
                            <InputForm
                                disabled={slugable || loading}
                                name="slug"
                                value={body.slug || ""}
                                onChange={handleChangeInput}
                                title="Slug"
                                className="w-full"
                                error={errors.find((e) => e.path[0] === "slug")?.message}
                            />
                            <Button
                                type="button"
                                onClick={() => setSlugable(!slugable)}
                                className="text-sm py-2 px-5 w-fit"
                            >
                                {slugable ? "Manual" : "Automation"}
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputForm
                                required
                                name="price"
                                type="number"
                                disabled={loading}
                                value={body.price}
                                onChange={handleChangeInput}
                                placeholder="250"
                                error={errors.find((e) => e.path[0] === "price")?.message}
                            />
                            <InputForm
                                disabled={loading}
                                name="rating"
                                type="range"
                                step={0.1}
                                min={0}
                                max={5}
                                value={body.rating!}
                                onChange={handleChangeInput}
                                placeholder="0 - 5"
                                className="border-none"
                                error={errors.find((e) => e.path[0] === "rating")?.message}
                            />
                        </div>

                        <TextareaForm
                            name="description"
                            value={body.description || ""}
                            onChange={handleChangeInput}
                            placeholder="Description menu..."
                            disabled={loading}
                            error={errors.find((e) => e.path[0] === "description")?.message}
                        />
                    </div>
                    <div className="bg-gray-50 rounded-xl shadow-lg p-5">
                        <div className="flex items-end justify-between gap-3 mb-4">
                            <SelectForm
                                error=""
                                list={dataSelectListCategories}
                                name="category_id"
                                onChange={handleChangeInput}
                                title="Categories"
                                value={body.category_id || ""}
                                disabled={isLoadingCategories || loading}
                            />
                            <Button type="button" onClick={() => router.push("/admin/categories")} className="w-fit">
                                <IconPlus size={16} />
                            </Button>
                        </div>

                        <div className="flex items-end justify-between gap-3">
                            <SelectForm
                                error=""
                                list={dataSelectListTypes}
                                disabled={isLoadingTypes || loading}
                                name="type_id"
                                onChange={handleChangeInput}
                                title="Types Menu"
                                value={body.type_id || ""}
                            />
                            <Button type="button" onClick={() => router.push("/admin/types")} className="w-fit">
                                <IconPlus size={16} />
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}
