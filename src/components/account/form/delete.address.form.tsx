import { IconCancel, IconCheck } from "@tabler/icons-react";
import { SetStateAction } from "jotai";
import { Button } from "~/components/ui/button";
import { ButtonLoader } from "~/components/ui/button/button.loader";
import { useFindAddress, useFormAddress } from "~/hook/useAccount";
type propsDeleteAddressForm = {
    setModal: React.Dispatch<SetStateAction<"PHOTO" | "DELETE_ADDRESS" | null>>;
    addressId: number;
    setSelectAddressId: React.Dispatch<SetStateAction<number | null>>;
};
export function DeleteAddressForm({ setModal, addressId, setSelectAddressId }: propsDeleteAddressForm) {
    const { address, loadingAddress } = useFindAddress(addressId);
    const { deleteAddress, isPendingDeleteAddress } = useFormAddress(addressId);

    const handleDelete = async () => {
        deleteAddress({ addressId });
        setModal(null);
        setSelectAddressId(null);
    };
    return (
        <div className="fixed z-30 top-0 left-0 right-0 bg-black/10 backdrop-blur-sm h-svh flex items-center justify-center w-full">
            <div className="w-11/12 md:w-6/12 lg:w-4/12 mx-auto bg-gray-50 rounded-lg p-5 border border-gray-300 flex flex-col gap-y-3">
                <div className="flex flex-col gap-y-1 p-3 bg-gray-200 rounded-lg border border-gray-300">
                    <h3 className="font-bold text-gray-800">{address?.name}</h3>
                    <p className="text-xs text-gray-500">
                        {`${address?.street}, ${address?.district}, ${address?.subDistrict}, ${address?.city}, ${address?.province}, ${address?.country} - ${address?.postalCode}`}
                    </p>
                </div>
                <div className="flex items-center justify-center gap-5 mt-5">
                    <Button
                        type="button"
                        onClick={() => {
                            setSelectAddressId(null);
                            setModal(null);
                        }}
                        className="w-full bg-red text-red-100"
                    >
                        <IconCancel size={20} /> <span>Cancel</span>
                    </Button>
                    <Button type="button" onClick={handleDelete} className="w-full">
                        {loadingAddress || isPendingDeleteAddress ? (
                            <ButtonLoader />
                        ) : (
                            <>
                                <IconCheck size={20} /> <span>Delete</span>
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
