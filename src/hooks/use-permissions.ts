import { useState, useEffect } from 'react';
import { Permission } from '@/types/role';
import { useAuthContext } from '@/context/auth-context';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function usePermissions() {
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [groupedPermissions, setGroupedPermissions] = useState<Record<string, Permission[]>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPermissions = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/permissions`, {
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Failed to fetch permissions');
            const data = await response.json();
            setPermissions(data);

            // Group permissions by resource
            const grouped: Record<string, Permission[]> = {};
            for (const perm of data) {
                if (!grouped[perm.resource]) {
                    grouped[perm.resource] = [];
                }
                grouped[perm.resource].push(perm);
            }
            setGroupedPermissions(grouped);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPermissions();
    }, []);

    return {
        permissions,
        groupedPermissions,
        isLoading,
        error,
        refresh: fetchPermissions,
    };
}

// Check if current user is superadmin based on role name
export function useIsSuperadmin() {
    const { user } = useAuthContext();

    if (!user) return false;

    const adminRoles = ['superadmin', 'admin'];

    // Handle both string role (from auth.ts User) and object role (from user.ts User)
    const role = user.role as string | { name?: string } | null | undefined;
    if (!role) return false;

    const roleName = typeof role === 'string' ? role : role.name;
    return adminRoles.includes(roleName || '');
}
