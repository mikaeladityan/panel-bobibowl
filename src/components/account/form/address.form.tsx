import { SetStateAction } from "jotai";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { ButtonLoader } from "~/components/ui/button/button.loader";
import { InputForm } from "~/components/ui/form/input.form";
import { TextareaForm } from "~/components/ui/form/textarea.form";
import { TextLoading } from "~/components/ui/loading/text.loading";
import { useFindAddress, useFormAddress } from "~/hook/useAccount";
import { initUserReq, UserAddressReqDTO } from "~/interface/account";

type propsAddressForm = {
    addressId?: number;
    createAddress: boolean;
    setCreateAddress: React.Dispatch<SetStateAction<boolean>>;
    setSelectAddressId: React.Dispatch<SetStateAction<number | null>>;
};
export function AddressForm({ addressId, createAddress, setCreateAddress, setSelectAddressId }: propsAddressForm) {
    const { address, loadingAddress, isRefetchingAddress } = useFindAddress(addressId);
    const { handleCreateAddress, updateAddress, isPendingCreateAddress, isPendingUpdateAddress } =
        useFormAddress(addressId);
    const [body, setBody] = useState<UserAddressReqDTO>(initUserReq["address"]);
    const inputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { value, name } = e.target;
        setBody((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        if (addressId) {
            // Jika ada addressId, gunakan data dari API
            if (address) {
                setBody(address);
            }
        } else {
            // Jika tidak ada addressId, gunakan data awal
            setBody(initUserReq["address"]);
        }
    }, [setBody, addressId, address]);

    async function handleCreate(e: FormEvent) {
        e.preventDefault();
        await handleCreateAddress(body);
        setBody(initUserReq["address"]);
        setCreateAddress(false);
    }

    async function handleUpdate(e: FormEvent) {
        e.preventDefault();
        await updateAddress(body);
        setCreateAddress(false);
        setSelectAddressId(null);
    }

    return addressId && (loadingAddress || isRefetchingAddress) ? (
        <TextLoading />
    ) : (
        <form onSubmit={addressId ? handleUpdate : handleCreate} className="grid grid-cols-2 gap-x-5 gap-y-3">
            <InputForm
                name="name"
                value={body.name}
                className="w-full"
                onChange={inputChange}
                disabled={loadingAddress}
            />

            <InputForm
                name="street"
                value={body.street}
                className="w-full"
                onChange={inputChange}
                disabled={loadingAddress}
            />

            <InputForm
                name="district"
                value={body.district}
                className="w-full"
                onChange={inputChange}
                disabled={loadingAddress}
            />

            <InputForm
                title="Sub District"
                name="subDistrict"
                value={body.subDistrict}
                className="w-full"
                onChange={inputChange}
                disabled={loadingAddress}
            />

            <InputForm
                name="city"
                value={body.city}
                className="w-full"
                onChange={inputChange}
                disabled={loadingAddress}
            />

            <InputForm
                name="province"
                value={body.province}
                className="w-full"
                onChange={inputChange}
                disabled={loadingAddress}
            />

            <InputForm
                name="country"
                value={body.country}
                className="w-full"
                onChange={inputChange}
                disabled={loadingAddress}
            />

            <InputForm
                title="Postal Code"
                name="postalCode"
                value={body.postalCode}
                className="w-full"
                onChange={inputChange}
                disabled={loadingAddress}
            />

            <div className="col-span-2">
                <TextareaForm name="notes" value={body.notes || ""} onChange={inputChange} disabled={loadingAddress} />
            </div>

            <Button
                type="button"
                className="mt-5 bg-red"
                onClick={() => {
                    setSelectAddressId(null);
                    setCreateAddress(!createAddress);
                }}
            >
                Cancel
            </Button>
            <Button type="submit" className="mt-5" disabled={isPendingCreateAddress || isPendingUpdateAddress}>
                {isPendingCreateAddress || isPendingUpdateAddress ? (
                    <ButtonLoader />
                ) : addressId ? (
                    "Memperbarui"
                ) : (
                    "Simpan"
                )}
            </Button>
        </form>
    );
}
