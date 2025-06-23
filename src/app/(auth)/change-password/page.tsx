import { Suspense } from "react";
import { ChangePassword } from "~/components/auth/change.password";

export default function ChangePasswordPage() {
    return (
        <Suspense fallback={<div>Loading…</div>}>
            <ChangePassword />
        </Suspense>
    );
}
