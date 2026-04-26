"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

interface GuestRouteProps {
    children: React.ReactNode;
}

export function GuestRoute({ children }: GuestRouteProps) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && user) {
            const target = user.emailVerified
                ? "/dashboard"
                : `/verify-otp?email=${encodeURIComponent(user.email)}`;

            if (pathname !== target) {
                router.replace(target);
            }
        }
    }, [user, loading, router, pathname]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (user) {
        return null;
    }

    return <>{children}</>;
}
