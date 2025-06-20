export type TypeReqDTO = {
    slug: string;
    title: string;
};

export type TypeResDTO = {
    title: string;
    slug: string;
    deleted_at?: Date | null;
};
export type TypesResDTO = Array<TypeResDTO>;
