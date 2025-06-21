"use client";
import { FormEvent, useEffect, useState } from "react";
import { useAtom, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { IconArrowBack, IconCheck } from "@tabler/icons-react";
import { Button } from "~/components/ui/button";
import { menuAtom } from "~/store/menu";
import { notificationAtom } from "~/store";
import { useMenuForm } from "~/hook/useMenu";
import { MenuReqDTO } from "~/interface/admin/menu";
import { ButtonLoader } from "~/components/ui/button/button.loader";
import { FormMenu } from "./form";
import { PageLoading } from "~/components/ui/loading/page.loading";

export function CreateMenu() {
    const [body, setBody] = useAtom(menuAtom);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const { handleCreate, isPendingCreate, handleImage, isPendingImage, errors } = useMenuForm();
    const setNotification = useSetAtom(notificationAtom);
    const router = useRouter();
    useEffect(() => {
        localStorage.removeItem("menuBody");
        console.log("OK");
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(isPendingCreate || isPendingImage);
        try {
            const newBody: MenuReqDTO = {
                ...body,
                rating: Number(body.rating),
                category_id: Number(body.category_id),
                type_id: Number(body.type_id),
            };
            const { barcode } = await handleCreate(newBody);
            if (file) {
                await handleImage({ barcode, file });
            }
            localStorage.removeItem("menuBody");
            router.replace("/admin/menus");
            setNotification({
                title: "Create Menu",
                message: (
                    <div className="flex items-center justify-start gap-2">
                        <IconCheck size={18} stroke={2} /> <span>Successfully create new menu</span>
                    </div>
                ),
            });
        } finally {
            setLoading(false);
        }
    };

    return isPendingCreate || isPendingImage ? (
        <PageLoading />
    ) : (
        <section className="w-11/12 mx-auto my-10 flex flex-col gap-y-5">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold w-full">Create New Menu</h1>
                <Button
                    type="button"
                    onClick={() => {
                        setLoading(true);
                        router.replace("/admin/menus");
                    }}
                    className="bg-red text-yellow w-fit"
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
                loading={loading}
                body={body}
                setBody={setBody}
                onSubmit={handleSubmit}
                file={file}
                setFile={setFile}
                errors={errors}
            />
        </section>
    );
}
