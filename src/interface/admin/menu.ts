import { CategoryResDTO } from "./category";
import { TypeResDTO } from "./type";

export type STATUS = "ACTIVE" | "PENDING" | "FAVOURITE" | "BLOCK" | "DELETE";
export type MenuReqDTO = {
    title: string;
    slug: string | null;
    status: STATUS;
    price: string;
    type_id?: number | undefined;
    category_id?: number | undefined;
    description?: string | undefined;
    rating?: number | undefined;
    image?: string;
};

export type MenuResDTO = {
    barcode: string;
    title: string;
    slug: string;
    description: string | null;
    price: string;
    rating: number;
    status: STATUS;
    created_at: Date | string;
    updated_at: Date | string;
    deleted_at: Date | string;
    category_id?: number;
    type_id?: number;
    category?: CategoryResDTO & { id: number };
    type?: TypeResDTO & { id: number };
    image?: string;
};

export type MenusResDTO = Array<MenuResDTO>;

export interface MenuQueryDTO {
    status?: "ACTIVE" | "DELETE";
    search?: string;
    skip?: number;
    take?: number;
    sort?: "price_asc" | "price_desc";
}
