"use client";
import { IconArrowBack, IconRefresh } from "@tabler/icons-react";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { usePromotion, usePromotionForm } from "~/hook/usePromotion";
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
export function UpdatePromotion() {
    const { code } = useParams();
    const router = useRouter();
    const { promotion, isLoadingPromotion, isRefetchingPromotion } = usePromotion(false, String(code));
    console.log(promotion);
    const { handleUpdate, isPendingUpdate, errors } = usePromotionForm(String(code));
    const [body, setBody] = useState<PromotionReqDTO>(initPromotion);
    useEffect(() => {
        if (promotion) {
            setBody({
                code: promotion!.code,
                description: promotion!.description,
                name: promotion!.name,
                percent: String(promotion!.percent),
                price: promotion!.price,
                expired_at: promotion!.expired_at.toString().substring(0, 10),
                start_at: promotion!.start_at.toString().substring(0, 10),
            });
        }
    }, [promotion]);
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await handleUpdate(body);
    };
    return isPendingUpdate || isLoadingPromotion || isRefetchingPromotion ? (
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
