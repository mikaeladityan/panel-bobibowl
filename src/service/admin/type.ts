import { ApiSuccessResponse } from "~/interface";
import { TypeReqDTO, TypeResDTO, TypesResDTO } from "~/interface/admin/type";
import { api, setupCSRFToken } from "~/lib/api";

export class TypeService {
    static async list(): Promise<TypesResDTO> {
        const { data } = await api.get<ApiSuccessResponse<TypesResDTO>>("/admin/type");
        return data.data;
    }

    static async listDeleted(): Promise<TypesResDTO> {
        const { data } = await api.get<ApiSuccessResponse<TypesResDTO>>("/admin/type/deleted");
        return data.data;
    }

    static async find(slug: string): Promise<TypeResDTO> {
        const { data } = await api.get<ApiSuccessResponse<TypeResDTO>>(`/admin/type/${slug}`);
        return data.data;
    }

    static async create(body: TypeReqDTO) {
        await setupCSRFToken();
        await api.post("/admin/type", body);
    }

    static async update(body: TypeReqDTO, slug: string) {
        await setupCSRFToken();
        await api.put(`/admin/type/${slug}`, body);
    }

    static async actived(slug: string) {
        await setupCSRFToken();
        await api.patch(`/admin/type/${slug}`);
    }

    static async softDeleted(slug: string) {
        await setupCSRFToken();
        await api.delete(`/admin/type/${slug}`);
    }

    static async clean() {
        await setupCSRFToken();
        await api.delete(`/admin/type/clean`);
    }
}
