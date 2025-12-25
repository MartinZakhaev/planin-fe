export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    emailVerified: boolean;
    createdAt: string;
    image?: string | null;
}

export interface Session {
    id: string;
    userId: string;
    expiresAt: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface SessionResponse {
    session: Session;
    user: User;
}

export interface SignInCredentials {
    email: string;
    password: string;
}

export interface SignUpCredentials {
    name: string;
    email: string;
    password: string;
}
