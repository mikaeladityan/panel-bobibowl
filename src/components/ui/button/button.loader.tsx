import { IconLoader3 } from "@tabler/icons-react";

export function ButtonLoader() {
    return (
        <>
            <IconLoader3 stroke={2} size={20} className="animate-spin" />
            <span>Loading...</span>
        </>
    );
}
