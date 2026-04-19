import useSWR from 'swr';
import { fetcher, BASE_URL } from '@/lib/api';
import { OrgMember, AddMemberDto, UpdateMemberRoleDto } from '@/types/organization';

async function apiClient<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', ...options?.headers },
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'API Error');
    }
    if (res.status === 204) return {} as T;
    return res.json();
}

export function useOrgMembers(orgId: string | null) {
    const key = orgId ? `/organization-members?orgId=${orgId}` : null;
    const { data, error, mutate, isLoading } = useSWR<OrgMember[]>(key, fetcher);

    const addMember = async (dto: AddMemberDto) => {
        await apiClient('/organization-members', { method: 'POST', body: JSON.stringify(dto) });
        mutate();
    };

    const updateRole = async (memberId: string, dto: UpdateMemberRoleDto) => {
        await apiClient(`/organization-members/${memberId}`, { method: 'PATCH', body: JSON.stringify(dto) });
        mutate();
    };

    const removeMember = async (memberId: string) => {
        await apiClient(`/organization-members/${memberId}`, { method: 'DELETE' });
        mutate();
    };

    return {
        members: data || [],
        isLoading,
        error,
        addMember,
        updateRole,
        removeMember,
        refresh: mutate,
    };
}
