"use client";
import { IconAddressBook, IconEye, IconPlus, IconTrash } from "@tabler/icons-react";
import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { ImageComponent, ImageSkeleton } from "~/components/ui/image";
import { AccountCardSkeleton } from "~/components/ui/loading/account.loading";
import { useAccount, useAddress, useUpdateAccount } from "~/hook/useAccount";
import { PhotoFormAccount } from "./form/photo.form";
import { useSetAtom } from "jotai";
import { errorAtom } from "~/store";
import { AddressForm } from "./form/address.form";
import { AccountForm } from "./form/account.form";
import { DeleteAddressForm } from "./form/delete.address.form";

export function Account() {
    const setError = useSetAtom(errorAtom);
    const [buttonChange, setButtonChange] = useState(false);
    const { userAccount, isFetchingUserAccount, isRefetchingUserAccount, userAccountLoading } = useAccount();
    const { addresses, isRefetchingAddresses, loadingAddresses } = useAddress();
    const { loadingUpdateAccount } = useUpdateAccount();
    const [modal, setModal] = useState<"PHOTO" | "DELETE_ADDRESS" | null>(null);
    const [createAddress, setCreateAddress] = useState(false);
    const [selectAddressId, setSelectAddressId] = useState<number | null>(null);

    return (
        <>
            {userAccountLoading ||
            loadingUpdateAccount ||
            isFetchingUserAccount ||
            isRefetchingUserAccount ||
            loadingAddresses ||
            isRefetchingAddresses ? (
                <AccountCardSkeleton />
            ) : (
                <section className="bg-white rounded-xl border border-gray-300 text-red">
                    <div className="px-5 py-3 border-b border-gray-300">
                        <h1 className="text-lg font-semibold text-red">Settings Account</h1>
                    </div>
                    <div className="p-5 bg-gray-50">
                        <div className="grid grid-cols-1 xl:grid-cols-4 gap-x-5 xl:gap-x-16 items-start justify-center xl:justify-start gap-y-5 xl:gap-y-0">
                            <div
                                className="relative w-full"
                                onMouseEnter={() => setButtonChange(true)}
                                onMouseLeave={() => setButtonChange(false)}
                            >
                                {isFetchingUserAccount || isRefetchingUserAccount ? (
                                    <ImageSkeleton />
                                ) : (
                                    <>
                                        <ImageComponent
                                            source={userAccount!.user.photo!}
                                            className="border border-gray-300 w-full rounded-xl h-72 xl:h-full"
                                        />
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                if (!userAccount?.user.firstName) {
                                                    setError({ message: "Please complete your information first!" });
                                                } else setModal("PHOTO");
                                            }}
                                            className="relative w-full mt-3 px-5 mx-auto border border-dark text-red bg-white text-xs block xl:hidden"
                                        >
                                            Change Photo
                                        </Button>
                                    </>
                                )}
                                {buttonChange && (
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            if (!userAccount?.user.firstName) {
                                                setError({ message: "Please complete your information first!" });
                                            } else setModal("PHOTO");
                                        }}
                                        className="absolute top-1/2 left-0 hidden xl:block right-0 w-fit px-5 mx-auto  border border-dark text-red bg-white text-xs"
                                    >
                                        Change Profile
                                    </Button>
                                )}
                            </div>

                            <div className="col-span-1 xl:col-span-3 flex flex-col gap-y-4">
                                <AccountForm userAccount={userAccount} userAccountLoading={userAccountLoading} />

                                <div className="w-full flex items-center justify-between border-t border-gray-300 pt-1">
                                    <h3 className="text-gray font-bold uppercase text-xs">Address</h3>

                                    <IconAddressBook size={25} stroke={2} className="text-gray" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-3 items-start">
                                    {addresses?.map((add) => (
                                        <React.Fragment key={add.id}>
                                            <div className="rounded-lg border border-gray-300 bg-white px-5 py-4 gap-2 flex flex-col gap-y-1">
                                                <div className="flex items-center justify-between gap-2">
                                                    <h6 className="font-semibold text-sm text-primary">{add.name}</h6>
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            className="p-0 flex items-center justify-center w-7 h-7"
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectAddressId(add.id);
                                                                setModal("DELETE_ADDRESS");
                                                            }}
                                                        >
                                                            <IconTrash size={16} stroke={2} />
                                                        </Button>
                                                        <Button
                                                            className="p-0 flex items-center bg-sky-800 justify-center w-7 h-7"
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectAddressId(add.id); // Set addressId yang diedit
                                                                setCreateAddress(true);
                                                            }}
                                                        >
                                                            <IconEye size={16} stroke={2} />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray">{`${add.street}, ${add.district}, ${add.subDistrict}, ${add.city}, ${add.province} - ${add.country} ${add.postalCode}`}</p>
                                            </div>
                                            {modal === "DELETE_ADDRESS" && (
                                                <DeleteAddressForm
                                                    addressId={selectAddressId!}
                                                    setModal={setModal}
                                                    setSelectAddressId={setSelectAddressId}
                                                />
                                            )}
                                        </React.Fragment>
                                    ))}
                                    {!createAddress && (
                                        <div className="rounded-lg border border-gray-300 bg-white px-5 py-4 gap-2 flex items-center justify-between">
                                            <p className="text-sm text-gray font-medium">
                                                {addresses?.length === 0
                                                    ? "Data is empty"
                                                    : `You have ${addresses?.length} addresses`}
                                            </p>

                                            <Button
                                                className="p-0 flex items-center justify-center w-7 h-7"
                                                type="button"
                                                onClick={() => setCreateAddress(true)}
                                            >
                                                <IconPlus size={20} stroke={2} />
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {createAddress && (
                                    <AddressForm
                                        setCreateAddress={setCreateAddress}
                                        createAddress={createAddress}
                                        addressId={selectAddressId || undefined}
                                        setSelectAddressId={setSelectAddressId}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {modal === "PHOTO" && <PhotoFormAccount accountPhoto={""} setModal={setModal} />}
                </section>
            )}
        </>
    );
}
