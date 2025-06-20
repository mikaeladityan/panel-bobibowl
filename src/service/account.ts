import { AccountResDTO, UserReqDTO } from "~/interface/account";
import { api, setupCSRFToken } from "~/lib/api";

export class AccountService {
    static async find(): Promise<AccountResDTO> {
        const { data } = await api.get("/account");
        return data.data;
    }

    static async createOrUpdate(body: UserReqDTO) {
        await setupCSRFToken();
        await api.post("/account", body);
    }

    static async uploadPhotoUser(file: File | null) {
        await setupCSRFToken();
        const formData = new FormData();
        formData.append("photo", file!, file!.name);
        // Upload via service
        const { data } = await api.patch(`/account`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
        });
        return data.data;
    }
}
