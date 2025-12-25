// Reusing the same pattern as useUnits, but generalized for generic CRUD
import useSWR from 'swr';
import { fetcher, BASE_URL } from '@/lib/api';

async function apiClient<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.message || 'API Error');
    }

    // Handle 204
    if (res.status === 204) return {} as T;

    return res.json();
}

export function useGenericCRUD<T, CreateDto, UpdateDto>(endpoint: string) {
    const { data, error, mutate, isLoading } = useSWR<T[]>(endpoint, fetcher);

    const create = async (data: CreateDto) => {
        await apiClient(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
        mutate();
    };

    const update = async (id: string, data: UpdateDto) => {
        await apiClient(`${endpoint}/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
        mutate();
    };

    const remove = async (id: string) => {
        await apiClient(`${endpoint}/${id}`, { method: 'DELETE' });
        mutate();
    };

    return {
        items: data || [],
        isLoading,
        error,
        create,
        update,
        remove,
        refresh: mutate,
    };
}
