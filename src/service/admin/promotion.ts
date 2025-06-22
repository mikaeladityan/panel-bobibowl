import { PromotionReqDTO, PromotionResDTO, PromotionsResDTO } from "~/interface/admin/promotion";
import { api, setupCSRFToken } from "~/lib/api";

export class PromotionService {
    static async list(): Promise<PromotionsResDTO> {
        const { data } = await api.get("/admin/promotion");
        return data.data;
    }

    static async listDeleted(): Promise<PromotionsResDTO> {
        const { data } = await api.get("/admin/promotion/deleted");
        return data.data;
    }

    static async find(code: string): Promise<PromotionResDTO> {
        const { data } = await api.get(`/admin/promotion/${code}`);
        return data.data;
    }

    static async create(body: PromotionReqDTO) {
        await setupCSRFToken();
        await api.post(`/admin/promotion`, body);
    }

    static async update(body: PromotionReqDTO, code: string) {
        await setupCSRFToken();
        await api.put(`/admin/promotion/${code}`, body);
    }

    static async status(code: string, status: "ACTIVE" | "DELETE") {
        await setupCSRFToken();
        await api.patch(`/admin/promotion/${code}?status=${status}`);
    }

    static async clean() {
        await setupCSRFToken();
        await api.delete(`/admin/promotion/clean`);
    }
}
