"use client";

import { useQueryClient } from "@tanstack/react-query";
import { SetStateAction } from "jotai";
import React, { useCallback, useState } from "react";
import { FileForm } from "../../ui/form/file.form";
import { Button } from "../../ui/button";
import { IconCancel, IconCloudUp } from "@tabler/icons-react";
import { ButtonLoader } from "../../ui/button/button.loader";
import { useUpdatePhotoAccount } from "~/hook/useAccount";

type propsPhotoFormAccount = {
    setModal: React.Dispatch<SetStateAction<"PHOTO" | "DELETE_ADDRESS" | null>>;
    accountPhoto: string;
};
export function PhotoFormAccount({ setModal, accountPhoto }: propsPhotoFormAccount) {
    const { uploadPhotoUserMutation } = useUpdatePhotoAccount();
    const [photo, setPhoto] = useState(accountPhoto);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();
    const [errMsg, setErrMsg] = useState("");
    const handleFiles = useCallback(
        (files: FileList) => {
            const selected = files[0];
            if (!selected) return;
            const isValidType = ["image/png", "image/jpeg", "image/jpg"].includes(selected.type);
            const isValidSize = selected.size <= 5 * 1024 * 1024;
            if (!isValidType) return setErrMsg("Only PNG, JPG, or JPEG formats are allowed.");
            if (!isValidSize) return setErrMsg("File size must be under 5MB.");
            setErrMsg("");
            setFile(selected);
            const reader = new FileReader();
            reader.onload = () => {
                const dataUrl = reader.result as string;
                setPhoto(dataUrl);
            };
            reader.readAsDataURL(selected);
        },
        [setPhoto, setFile]
    );
    const clearFile = () => {
        setPhoto("");
        setFile(null);
    };
    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            setLoading(true);
            try {
                if (file) {
                    await uploadPhotoUserMutation.mutateAsync({ file });
                }

                // 3c) Success: reset state, close modal, invalidate & refetch
                setModal(null);
                queryClient.invalidateQueries({ queryKey: ["account"] });
            } finally {
                setLoading(false);
            }
        },
        [file, queryClient, setModal, uploadPhotoUserMutation]
    );
    return (
        <form
            onSubmit={handleSubmit}
            className="fixed z-30 top-0 left-0 right-0 bg-black/10 backdrop-blur-sm h-svh flex items-center justify-center w-full"
        >
            <div className="w-11/12 md:w-6/12 lg:w-4/12 mx-auto bg-gray-50 rounded-lg p-5 border border-gray-300 flex flex-col gap-y-3">
                <FileForm
                    file={file}
                    errorMsg={errMsg}
                    clearFile={clearFile}
                    handleFiles={handleFiles}
                    image={photo}
                    setFile={setFile}
                />

                <div className="flex items-center justify-center gap-5 mt-5">
                    <Button type="button" onClick={() => setModal(null)} className="w-full bg-red text-red-100">
                        <IconCancel size={20} /> <span>Cancel</span>
                    </Button>
                    <Button type="submit" className="w-full">
                        {loading ? (
                            <ButtonLoader />
                        ) : (
                            <>
                                <IconCloudUp size={20} /> <span>Update</span>
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </form>
    );
}
