export type ROLE = "MEMBER" | "ADMIN" | "SUPER_ADMIN" | "OWNER" | "DEVELOPER";
export type STATUS = "PENDING" | "ACTIVE" | "FAVOURITE" | "BLOCK" | "DELETE";

export interface AccountResDTO {
    email: string;
    role: ROLE;
    status: STATUS;
    user: UserResDTO;
}

export interface UserResDTO {
    firstName: string;
    lastName: string;
    photo: string;
    phone?: string;
    whatsapp?: string;
}

export interface UserReqDTO {
    firstName: string;
    lastName: string;
    phone: string;
    whatsapp: string;
    address: UserAddressReqDTO;
    photo: string;
}

export interface UserAddressReqDTO {
    name: string;
    street: string;
    district: string;
    subDistrict: string;
    city: string;
    province: string;
    country: string;
    postalCode: string;
    notes: string | null;
}

export interface UserAddressResDTO {
    id: number;
    name: string;
    street: string;
    district: string;
    subDistrict: string;
    city: string;
    province: string;
    country: string;
    postalCode: string;
    notes: string | null;
}

export const initUserReq: UserReqDTO = {
    firstName: "",
    lastName: "",
    phone: "",
    whatsapp: "",
    photo: "",
    address: {
        name: "",
        street: "",
        district: "",
        subDistrict: "",
        city: "",
        province: "",
        country: "",
        postalCode: "",
        notes: "",
    },
};
