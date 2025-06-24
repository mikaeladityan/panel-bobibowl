import Image from "next/image";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

export const Brand = ({ className }: { className?: string }) => (
    <Link href={process.env.NEXT_PUBLIC_HOME!} className="w-fit flex items-center justify-start gap-3">
        <Image
            src={"/logo.png"}
            alt="Bobi Bowl Restaurant"
            width={2000}
            height={2000}
            priority
            className="w-16 h-full object-center object-cover"
        />
        <div>
            <div className={twMerge("font-bold text-xl leading-5 text-red", className)}>
                Bobi Bowl
                <br />
                Restaurant
            </div>
            <div className="w-full bg-yellow h-[1.5px] mt-1" />
        </div>
    </Link>
);
