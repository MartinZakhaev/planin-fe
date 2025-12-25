export const BASE_URL = 'http://localhost:3001';

export async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE_URL}${url}`, {
        ...options,
        credentials: 'include', // Enable session cookie handling
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.message || 'An error occurred while fetching the data.');
    }

    // Handle 204 No Content
    if (res.status === 204) {
        return {} as T;
    }

    return res.json();
}
