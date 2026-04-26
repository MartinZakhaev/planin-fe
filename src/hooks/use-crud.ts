// Reusing the same pattern as useUnits, but generalized for generic CRUD
import useSWR from 'swr';
import { useCallback } from 'react';
import { fetcher, BASE_URL } from '@/lib/api';

const emptyItems: never[] = [];

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

    const create = useCallback(async (data: CreateDto) => {
        await apiClient(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
        mutate();
    }, [endpoint, mutate]);

    const update = useCallback(async (id: string, data: UpdateDto) => {
        await apiClient(`${endpoint}/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
        mutate();
    }, [endpoint, mutate]);

    const remove = useCallback(async (id: string) => {
        await apiClient(`${endpoint}/${id}`, { method: 'DELETE' });
        mutate();
    }, [endpoint, mutate]);

    return {
        items: data ?? (emptyItems as T[]),
        isLoading,
        error,
        create,
        update,
        remove,
        refresh: mutate,
    };
}
