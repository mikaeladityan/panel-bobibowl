import { IconLoader3 } from "@tabler/icons-react";
import { Brand } from "../brand";

export function PageLoading() {
    return (
        <section className="w-full h-screen fixed top-0 left-0 right-0 z-50 flex items-center justify-center bg-gray-200">
            <div className="flex flex-col gap-y-5">
                <Brand />
                <div className="flex items-center justify-center gap-2 scale-110">
                    <IconLoader3 className="animate-spin" size={20} />
                    <span>Loading...</span>
                </div>
            </div>
        </section>
    );
}
