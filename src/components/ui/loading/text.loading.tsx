import { IconLoader3 } from "@tabler/icons-react";

export function TextLoading() {
    return (
        <div className="flex items-center justify-start gap-2">
            <IconLoader3 size={18} stroke={2} className="animate-spin" /> <span>Loading</span>
        </div>
    );
}
