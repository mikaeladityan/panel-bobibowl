import React, { useState, useRef, SetStateAction, useEffect } from "react";
import Image from "next/image";
import { IconPhotoEdit, IconTrash, IconRefresh } from "@tabler/icons-react";
import { motion as m } from "framer-motion";
export function FileForm({
    file,
    setFile,
    image,
    handleFiles,
    clearFile,
    errorMsg,
}: {
    file: File | null;
    setFile: React.Dispatch<SetStateAction<File | null>>;
    image: string;
    handleFiles: (files: FileList) => void;
    clearFile: () => void;
    errorMsg: string;
}) {
    const [isDragActive, setIsDragActive] = useState(false);
    // const [errorMsg, setErrorMsg] = useState("");
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (image && !file) {
            fetch(image)
                .then((res) => res.blob())
                .then((blob) => {
                    const mime = blob.type;
                    const ext = mime.split("/")[1] || "png";
                    const filename = `photo.${ext}`;
                    const reconstructed = new File([blob], filename, { type: mime });
                    setFile(reconstructed);
                })
                .catch(() => {
                    // ignore reconstruction errors
                });
        }
    }, [image, file, setFile]);

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragActive(true);
    };
    const onDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragActive(false);
    };
    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragActive(false);
        if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
    };
    const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) handleFiles(e.target.files);
    };
    const openFileDialog = () => inputRef.current?.click();
    // const clearPhoto = () => {
    //     setBody({ ...body, photo: "" });
    //     setFile(null);
    // };

    return (
        <section className="flex flex-col items-center justify-between h-full gap-6 w-full max-w-lg mx-auto overflow-hidden">
            <m.div
                initial={{ y: "-100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
            >
                <div
                    className={`relative w-full h-64 rounded-2xl border-2 border-dashed p-4 flex items-center justify-center transition-all overflow-hidden group ${
                        isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"
                    } hover:border-primary hover:bg-primary/5 cursor-pointer`}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    onClick={openFileDialog}
                >
                    <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                        className="hidden"
                        ref={inputRef}
                        onChange={onSelectFile}
                    />

                    {!image && (
                        <div className="flex flex-col items-center text-center">
                            <IconPhotoEdit size={48} className="text-gray-400 mb-2" />
                            <p className="text-gray-500 font-medium">Drag & drop or click to upload</p>
                        </div>
                    )}

                    {image && (
                        <>
                            <Image
                                src={image}
                                alt="Preview"
                                priority
                                className="object-contain h-full w-full rounded-2xl"
                                width={2000}
                                height={2000}
                            />
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    clearFile();
                                }}
                                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                            >
                                <IconTrash size={16} />
                            </button>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openFileDialog();
                                }}
                                className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                            >
                                <IconRefresh size={16} />
                            </button>
                        </>
                    )}
                </div>

                {errorMsg && <p className="text-sm text-red-500 text-center w-full">{errorMsg}</p>}
                <div className="w-full text-center text-gray-500 text-sm">
                    <p className="mb-2">This step is optional. You can upload a profile photo, or skip and continue.</p>
                    <p className="text-xs text-gray-400">Accepted formats: PNG, JPG, JPEG. Max size: 5MB.</p>
                </div>
            </m.div>
        </section>
    );
}
