import Image from "next/image";
import { twMerge } from "tailwind-merge";

type propsImageComponent = {
    source: string;
    className?: string;
    alt?: string;
};
export function ImageComponent({ source, alt, className }: propsImageComponent) {
    return (
        <Image
            src={source === "blank.png" ? "/blank.png" : source}
            width={2000}
            height={2000}
            priority
            alt={alt || "Image by Titanium Printing"}
            className={twMerge("object-center object-cover w-full h-full", className)}
        />
    );
}

type ImageSkeletonProps = {
    className?: string;
};

export function ImageSkeleton({ className }: ImageSkeletonProps) {
    return <div className={twMerge("bg-gray-100 animate-ping rounded-xl", className)} />;
}
