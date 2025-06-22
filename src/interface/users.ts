import { STATUS } from ".";
import { UserAddressResDTO } from "./account";

export type UserResDTO = {
    id: string;
    email: string;
    role: string;
    status: STATUS;
    first_name: string;
    last_name: string | null;
    photo: string | null;
    phone: string | null;
    whatsapp: string | null;
    updated_at: Date | string;
};

export type UsersResDTO = Array<UserResDTO>;
export type FindUserResDTO = UserResDTO & {
    addresses: UserAddressResDTO[];
};

export interface UsersQueryParams {
    status?: STATUS;
    skip?: number;
    take?: number;
    search?: string;
    sort?: "updated_desc" | "updated_asc" | "role_member" | "role_admin" | "role_super_admin";
}
