import Link from "next/link";
import { twMerge } from "tailwind-merge";

export const Brand = ({ className }: { className?: string }) => (
    <Link href={"/"} className="w-fit">
        <div className={twMerge("font-bold text-xl leading-5 text-red", className)}>
            Bobi Bowl
            <br />
            Restaurant
        </div>
        <div className="w-full bg-yellow h-[1.5px] mt-1" />
    </Link>
);
