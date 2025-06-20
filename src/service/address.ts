import { ApiSuccessResponse } from "~/interface";
import { UserAddressReqDTO, UserAddressResDTO } from "~/interface/account";
import { api, setupCSRFToken } from "~/lib/api";

export class AddressService {
    static async list(): Promise<Array<UserAddressResDTO>> {
        const { data } = await api.get<ApiSuccessResponse<Array<UserAddressResDTO>>>("/account/address");
        return data.data;
    }

    static async find(addressId: number): Promise<UserAddressResDTO> {
        const { data } = await api.get<ApiSuccessResponse<UserAddressResDTO>>(`/account/address/${addressId}`);
        return data.data;
    }

    static async create(body: UserAddressReqDTO) {
        await setupCSRFToken();
        await api.post(`/account/address`, body);
    }

    static async update(body: UserAddressReqDTO, addressId: number) {
        await setupCSRFToken();
        await api.put(`/account/address/${addressId}`, body);
    }

    static async delete(addressId: number) {
        await setupCSRFToken();
        await api.delete(`/account/address/${addressId}`);
    }
}
