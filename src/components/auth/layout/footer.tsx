import Link from "next/link";
import { usePathname } from "next/navigation";

export function AuthFooterLayout() {
    const pathname = usePathname();
    return (
        <div className="text-center text-gray-500 text-sm flex flex-col gap-y-2">
            {pathname === "/login" ? (
                <h5>
                    Don&apos;t have a Member Account?{" "}
                    <Link href={"/register"} className="text-red font-semibold">
                        Sign Up
                    </Link>
                </h5>
            ) : (
                <h5>
                    Already have a Member Account?{" "}
                    <Link href={"/login"} className="text-red font-semibold">
                        Sign In
                    </Link>
                </h5>
            )}
            <Link href={"/forgot-password"} className="text-red font-semibold">
                Forgot Password?
            </Link>
        </div>
    );
}
