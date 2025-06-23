"use client";
import { FormEvent, useEffect, useState } from "react";

import { useAtom } from "jotai";

import { useParams, useRouter } from "next/navigation";
import { IconArrowBack } from "@tabler/icons-react";

import { Button } from "~/components/ui/button";
import { useMenu, useMenuForm } from "~/hook/useMenu";
import { menuAtom } from "~/store/menu";
import { MenuReqDTO } from "~/interface/admin/menu";
import { ComponentLoading } from "~/components/ui/loading/form.loading";
import { ButtonLoader } from "~/components/ui/button/button.loader";
import { FormMenu } from "./form";

export function EditMenu() {
    const { barcode } = useParams();
    const { handleImage, isPendingImage, handleUpdate, isPendingUpdate, errors } = useMenuForm(String(barcode));
    const { menu, isLoadingMenu } = useMenu({}, String(barcode));
    const [body, setBody] = useAtom(menuAtom);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const router = useRouter();

    console.log(menu);

    useEffect(() => {
        setBody({
            title: menu?.title || "",
            description: menu?.description || "",
            image: menu?.image || "",
            price: menu?.price || "",
            rating: menu?.rating || 5,
            slug: menu?.slug || "",
            status: menu?.status || "PENDING",
            category_id: menu?.category_id || undefined,
            type_id: menu?.type_id || undefined,
        });
    }, [menu, setBody]);
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const newBody: MenuReqDTO = {
                ...body,
                rating: Number(body.rating),
                category_id: Number(body.category_id),
                type_id: Number(body.type_id),
            };
            await handleUpdate(newBody);
            if (file) {
                await handleImage({ barcode: String(barcode), file });
            }
            router.push("/admin/menus");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {isPendingUpdate || isLoadingMenu || loading ? (
                <ComponentLoading isLoading={isPendingUpdate || isLoadingMenu || isPendingImage || loading} />
            ) : (
                <section className="w-11/12 mx-auto my-10 flex flex-col gap-y-5">
                    <div className="flex flex-col lg:flex-row items-center justify-between">
                        <h1 className="text-2xl font-semibold w-full">Update Menu {menu?.barcode}</h1>
                        <Button
                            type="button"
                            onClick={() => {
                                setLoading(true);
                                router.replace("/admin/menus");
                            }}
                            className="bg-red text-yellow w-full lg:w-fit"
                        >
                            {loading ? (
                                <ButtonLoader />
                            ) : (
                                <>
                                    <IconArrowBack size={20} /> Back
                                </>
                            )}
                        </Button>
                    </div>
                    <FormMenu
                        errors={errors}
                        loading={loading}
                        body={body}
                        setBody={setBody}
                        onSubmit={handleSubmit}
                        file={file}
                        setFile={setFile}
                    />
                </section>
            )}
        </>
    );
}
