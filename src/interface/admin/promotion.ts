export type PromotionReqDTO = {
    code: string;
    name: string;
    description: string | null;
    price: string | null;
    percent: number | string | null;
    start_at: Date | string | null;
    expired_at: Date | string | null;
};

export type PromotionResDTO = {
    id: string;
    code: string;
    name: string;
    description: string | null;
    price: string | null;
    percent: number | null;
    start_at: Date | string;
    expired_at: Date | string;
};

export type PromotionsResDTO = Array<PromotionResDTO>;
