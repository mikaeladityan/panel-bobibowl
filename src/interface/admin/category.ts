export type CategoryReqDTO = {
    slug: string;
    title: string;
    description?: string | null;
};

export type CategoryResDTO = {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    deleted_at?: Date | null;
};

export type CategoriesResDTO = Array<CategoryResDTO>;
