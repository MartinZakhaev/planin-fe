"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

// Routes that only superadmin can access
const SUPERADMIN_ROUTES = [
    "/dashboard/users",
    "/dashboard/roles",
    "/dashboard/organizations",
    "/dashboard/plans",
    "/dashboard/subscriptions",
    "/dashboard/audit-logs",
    "/dashboard/user-custom-values",
    "/dashboard/units",
    "/dashboard/work-divisions",
    "/dashboard/task-catalogs",
    "/dashboard/item-catalogs",
];

// Admin role names (matching better-auth roles)
const ADMIN_ROLES = ["superadmin", "admin"];

function isAdminUser(role: string | { name?: string } | null | undefined): boolean {
    if (!role) return false;
    const roleName = typeof role === 'string' ? role : role.name;
    return ADMIN_ROLES.includes(roleName || '');
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/login");
            return;
        }

        // Check if user is non-admin accessing superadmin-only routes
        if (!loading && user) {
            if (!user.emailVerified) {
                router.replace(`/verify-otp?email=${encodeURIComponent(user.email)}`);
                return;
            }

            const isAdmin = isAdminUser(user.role);
            const isSuperadminRoute = SUPERADMIN_ROUTES.some(
                (route) => pathname === route || pathname.startsWith(route + "/")
            );

            if (!isAdmin && isSuperadminRoute) {
                // Redirect to projects page (regular users can't access admin pages)
                router.replace("/dashboard/projects");
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

    if (!user) {
        return null;
    }

    if (!user.emailVerified) {
        return null;
    }

    // Additional check for non-admin users trying to access admin routes
    const isAdmin = isAdminUser(user.role);
    const isSuperadminRoute = SUPERADMIN_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(route + "/")
    );

    if (!isAdmin && isSuperadminRoute) {
        return (
            <div className="flex min-h-screen items-center justify-center flex-col gap-4">
                <h2 className="text-xl font-semibold">Access Denied</h2>
                <p className="text-muted-foreground">You don&apos;t have permission to access this page.</p>
            </div>
        );
    }

    return <>{children}</>;
}
