import { ChangeEvent, FormEvent, useState } from "react";
import { Button } from "~/components/ui/button";
import { ButtonLoader } from "~/components/ui/button/button.loader";
import { InputForm } from "~/components/ui/form/input.form";
import { useUpdateAccount } from "~/hook/useAccount";
import { AccountResDTO, initUserReq, UserReqDTO } from "~/interface/account";

type propsAccountForm = {
    userAccount: AccountResDTO | undefined;
    userAccountLoading: boolean;
};
export function AccountForm({ userAccount, userAccountLoading }: propsAccountForm) {
    const { submitUpdateAccount } = useUpdateAccount();
    const [body, setBody] = useState<UserReqDTO>({
        firstName: userAccount?.user.firstName || "",
        lastName: userAccount?.user.lastName || "",
        phone: userAccount?.user.phone || "",
        whatsapp: userAccount?.user.whatsapp || "",
        photo: "",
        address: initUserReq["address"],
    });
    const inputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value, name } = e.target;
        setBody((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleSubmitUser = async (e: FormEvent) => {
        e.preventDefault();
        await submitUpdateAccount(body);
    };
    return (
        <form onSubmit={handleSubmitUser} className="grid grid-cols-2 gap-x-5 gap-y-3">
            <InputForm
                required
                title="First Name"
                name="firstName"
                value={body.firstName}
                placeholder="Jhon"
                className="w-full"
                onChange={inputChange}
                disabled={userAccountLoading}
            />
            <InputForm
                title="Last Name"
                name="lastName"
                value={body.lastName}
                placeholder="Doe"
                className="w-full"
                onChange={inputChange}
                disabled={userAccountLoading}
            />
            <InputForm
                required
                type="tel"
                name="whatsapp"
                value={body.whatsapp}
                placeholder="085XXXXXXXXXX"
                className="w-full"
                onChange={inputChange}
                disabled={userAccountLoading}
            />
            <InputForm
                title="Telphone"
                type="tel"
                name="phone"
                value={body.phone}
                placeholder="085XXXXXXXXXX"
                className="w-full"
                onChange={inputChange}
                disabled={userAccountLoading}
            />

            <Button disabled={userAccountLoading} type="submit" className="mt-5 col-span-2">
                {userAccountLoading ? <ButtonLoader /> : "Save"}
            </Button>
        </form>
    );
}
