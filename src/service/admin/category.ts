import { ApiSuccessResponse } from "~/interface";
import { CategoriesResDTO, CategoryReqDTO, CategoryResDTO } from "~/interface/admin/category";
import { api, setupCSRFToken } from "~/lib/api";

export class CategoryService {
    static async list(): Promise<CategoriesResDTO> {
        const { data } = await api.get<ApiSuccessResponse<CategoriesResDTO>>("/admin/category");
        return data.data;
    }

    static async listDeleted(): Promise<CategoriesResDTO> {
        const { data } = await api.get<ApiSuccessResponse<CategoriesResDTO>>("/admin/category/deleted");
        return data.data;
    }

    static async find(slug: string): Promise<CategoryResDTO> {
        const { data } = await api.get<ApiSuccessResponse<CategoryResDTO>>(`/admin/category/${slug}`);
        return data.data;
    }

    static async create(body: CategoryReqDTO) {
        await setupCSRFToken();
        await api.post("/admin/category", body);
    }

    static async update(body: CategoryReqDTO, slug: string) {
        await setupCSRFToken();
        await api.put(`/admin/category/${slug}`, body);
    }

    static async actived(slug: string) {
        await api.patch(`/admin/category/${slug}`);
    }

    static async softDeleted(slug: string) {
        await api.delete(`/admin/category/${slug}`);
    }

    static async clean() {
        await api.delete(`/admin/category/clean`);
    }
}
