type TYPE_EMAIL = "REGISTER" | "RESET_PASSWORD";
export interface RegisterDTO {
    email: string;
    password: string;
    passwordConfirmation: string;
}

export interface LoginDTO {
    email: string;
    password: string;
    remember: boolean;
}

export interface SendVerifyDTO {
    email: string;
    type: TYPE_EMAIL;
}

export interface VerifyReqDTO {
    email: string;
    code: string;
    type: TYPE_EMAIL;
}

export interface ResetPasswordDTO {
    email: string;
    code: string;
    type: TYPE_EMAIL;
    password: string;
    passwordConfirmation: string;
}
