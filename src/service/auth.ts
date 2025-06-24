import { ApiSuccessResponse } from "~/interface";
import { AccountResDTO } from "~/interface/account";
import { LoginDTO, RegisterDTO, ResetPasswordDTO, SendVerifyDTO, VerifyReqDTO } from "~/interface/auth";
import { api, setupCSRFToken } from "~/lib/api";

export class AuthService {
    static async register(body: RegisterDTO) {
        await setupCSRFToken();
        await api.post("/auth/register", body);
    }

    static async verify(body: VerifyReqDTO) {
        await setupCSRFToken();
        await api.patch("/auth/verify", body);
    }

    static async sendVerify(body: SendVerifyDTO) {
        await setupCSRFToken();
        await api.post("/auth/verify", body);
    }

    static async changePassword(body: ResetPasswordDTO) {
        await setupCSRFToken();
        await api.put("/auth", body);
    }

    static async login(body: LoginDTO) {
        const res = await setupCSRFToken();
        console.log(res);
        await api.post("/auth", body);
    }

    static async logout() {
        await setupCSRFToken();
        await api.delete("/auth");
    }

    static async account(): Promise<AccountResDTO> {
        const { data } = await api.get<ApiSuccessResponse<AccountResDTO>>("/auth");
        return data.data;
    }
}
