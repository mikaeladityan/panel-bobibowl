import { SetStateAction } from "jotai";
import React, { ChangeEvent, FormEvent } from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { DateForm } from "~/components/ui/form/date.form";
import { InputForm } from "~/components/ui/form/input.form";
import { TextareaForm } from "~/components/ui/form/textarea.form";
import { PromotionReqDTO } from "~/interface/admin/promotion";

type propsFormPromotion = {
    body: PromotionReqDTO;
    setBody: React.Dispatch<SetStateAction<PromotionReqDTO>>;
    errors: Array<{ path: string; message: string }>;
    handleSubmit: (e: FormEvent) => Promise<void>;
};
export function FormPromotion({ body, setBody, errors, handleSubmit }: propsFormPromotion) {
    const inputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setBody((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    console.log(body);
    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
            <Card className="flex flex-col gap-y-3">
                <InputForm
                    name="code"
                    value={body.code}
                    placeholder="CODEPROMOTION2025"
                    onChange={inputChange}
                    required
                    error={errors.find((e) => e.path[0] === "code")?.message}
                />
                <InputForm
                    name="name"
                    value={body.name}
                    placeholder="New Launching Promotion"
                    onChange={inputChange}
                    required
                    error={errors.find((e) => e.path[0] === "name")?.message}
                />
                <div className="grid grid-cols-2 gap-5">
                    <InputForm
                        name="price"
                        value={body.price}
                        placeholder="250"
                        onChange={inputChange}
                        error={errors.find((e) => e.path[0] === "price")?.message}
                    />
                    <InputForm
                        name="percent"
                        type="number"
                        value={body.percent!}
                        placeholder="20"
                        onChange={inputChange}
                        min={0}
                        max={100}
                        error={errors.find((e) => e.path[0] === "percent")?.message}
                    />
                </div>
            </Card>

            <Card className="grid grid-cols-2 gap-3">
                <DateForm
                    name="start_at"
                    title="Start"
                    value={String(body.start_at)}
                    onChange={inputChange}
                    required
                    error={errors.find((e) => e.path[0] === "start_at")?.message}
                />
                <DateForm
                    name="expired_at"
                    title="End"
                    value={String(body.expired_at)}
                    onChange={inputChange}
                    required
                    error={errors.find((e) => e.path[0] === "expired_at")?.message}
                />

                <div className="col-span-2 flex flex-col gap-y-3">
                    <TextareaForm
                        name="description"
                        error={errors.find((e) => e.path[0] === "description")?.message}
                        value={body.description!}
                        onChange={inputChange}
                    />

                    <Button type="submit">Submit</Button>
                </div>
            </Card>
        </form>
    );
}
