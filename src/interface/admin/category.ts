export type CategoryReqDTO = {
    slug: string;
    title: string;
    description?: string | undefined;
};

export type CategoryResDTO = {
    title: string;
    slug: string;
    description: string | null;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
};

export type CategoriesResDTO = Array<CategoryResDTO>;
