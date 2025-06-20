export interface ApiSuccessResponse<T = unknown> {
    success: true;
    data: T;
}

export interface Errors {
    path: string | undefined;
    message: string;
}
export type STATUS = "PENDING" | "ACTIVE" | "FAVOURITE" | "BLOCK" | "DELETE";

export interface Menu {
    title: string;
    link: string;
    icon?: React.ReactNode;
}
