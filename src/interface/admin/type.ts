export type TypeReqDTO = {
    slug: string;
    title: string;
};

export type TypeResDTO = {
    id: number;
    title: string;
    slug: string;
    deleted_at?: Date | null;
};
export type TypesResDTO = Array<TypeResDTO>;
