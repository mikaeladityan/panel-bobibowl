import { ApiSuccessResponse, STATUS } from "~/interface";
import { ROLE } from "~/interface/account";
import { FindUserResDTO, UsersQueryParams, UsersResDTO } from "~/interface/users";
import { api, setupCSRFToken } from "~/lib/api";

export class UsersService {
    static async list(params: UsersQueryParams): Promise<{ data: UsersResDTO; totalCount: number }> {
        const { data } = await api.get<ApiSuccessResponse<{ data: UsersResDTO; totalCount: number }>>("/users", {
            params: {
                status: params.status,
                search: params.search,
                skip: params.skip,
                take: params.take,
                sort: params.sort,
            },
        });
        return data.data;
    }

    static async find(id: string): Promise<FindUserResDTO> {
        const { data } = await api.get(`/users/${id}`);
        return data.data;
    }

    static async role(id: string, role: ROLE) {
        await setupCSRFToken();
        await api.patch(`/users/${id}/role?role=${role}`);
    }

    static async status(id: string, status: STATUS) {
        await setupCSRFToken();
        await api.patch(`/users/${id}/status?status=${status}`);
    }
}
