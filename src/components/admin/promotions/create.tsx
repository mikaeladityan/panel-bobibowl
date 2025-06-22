"use client";
import { IconArrowBack, IconRefresh } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "~/components/ui/button";
import { usePromotionForm } from "~/hook/usePromotion";
import { PromotionReqDTO } from "~/interface/admin/promotion";
import { FormPromotion } from "./form";
import { PageLoading } from "~/components/ui/loading/page.loading";

const initPromotion: PromotionReqDTO = {
    code: "",
    description: "",
    name: "",
    percent: null,
    price: "",
    expired_at: new Date(),
    start_at: new Date(),
};
export function CreatePromotion() {
    const router = useRouter();
    const [body, setBody] = useState<PromotionReqDTO>(initPromotion);

    const { handleCreate, isPendingCreate, errors } = usePromotionForm();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await handleCreate(body);
    };
    return isPendingCreate ? (
        <PageLoading />
    ) : (
        <>
            <div className="col-span-2 mb-5 flex items-center justify-between gap-5">
                <Button
                    type="button"
                    onClick={() => router.push("/admin/promotions")}
                    className="w-fit scale-90 bg-sky-800 text-gray-50"
                >
                    <IconArrowBack /> <span>Back</span>
                </Button>

                <Button type="button" onClick={() => setBody(initPromotion)} className="w-fit scale-90">
                    <span>Clear</span> <IconRefresh />
                </Button>
            </div>
            <FormPromotion body={body} setBody={setBody} errors={errors} handleSubmit={handleSubmit} />
        </>
    );
}
