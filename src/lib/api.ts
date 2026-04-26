export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export class ApiError extends Error {
    status: number;
    code?: string;
    retryAfterSeconds?: number;

    constructor(message: string, status: number, code?: string, retryAfterSeconds?: number) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.code = code;
        this.retryAfterSeconds = retryAfterSeconds;
    }
}

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
        throw new ApiError(
            errorBody.message || 'An error occurred while fetching the data.',
            res.status,
            errorBody.code,
            errorBody.retryAfterSeconds
        );
    }

    // Handle 204 No Content
    if (res.status === 204) {
        return {} as T;
    }

    return res.json();
}
