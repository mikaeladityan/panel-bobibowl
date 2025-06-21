import { ApiSuccessResponse, STATUS } from "~/interface";
import { MenuQueryDTO, MenuReqDTO, MenuResDTO, MenusResDTO } from "~/interface/admin/menu";
import { api, setupCSRFToken } from "~/lib/api";

export class MenuService {
    static async list(params: MenuQueryDTO): Promise<{ data: MenusResDTO; totalCount: number }> {
        // Menggunakan query string yang benar
        const { data } = await api.get<ApiSuccessResponse<{ data: MenusResDTO; totalCount: number }>>("/admin/menu", {
            params: {
                status: params.status,
                search: params.search,
                skip: params.skip,
                take: params.take,
                sort: params.sort,
            },
        });
        return data.data; // Asumsi response sesuai format { data: [...], totalCount: number }
    }

    static async find(barcode: string): Promise<MenuResDTO> {
        const { data } = await api.get(`/admin/menu/${barcode}`);
        return data.data;
    }

    static async create(body: MenuReqDTO): Promise<{ barcode: string }> {
        await setupCSRFToken();
        const { data } = await api.post<ApiSuccessResponse<{ barcode: string }>>("/admin/menu", body);
        return data.data;
    }

    static async update(body: MenuReqDTO) {
        await setupCSRFToken();
        await api.put("/admin/menu", body);
    }

    static async image(barcode: string, file: File | null) {
        await setupCSRFToken();
        const formData = new FormData();
        formData.append("image", file!, file!.name);
        // Upload via service
        const { data } = await api.post(`/admin/menu/${barcode}/image`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
        });
        return data.data;
    }

    static async status(barcode: string, status: STATUS) {
        await setupCSRFToken();
        await api.patch(`/admin/menu/${barcode}?status=${status}`);
    }

    static async clean() {
        await setupCSRFToken();
        await api.delete("/admin/menu");
    }
}
