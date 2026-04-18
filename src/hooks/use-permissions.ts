import { useState, useEffect } from 'react';
import { Permission } from '@/types/role';

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
