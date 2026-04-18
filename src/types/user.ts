export interface User {
    id: string;
    email: string;
    fullName: string;
    profileFileId?: string;
    roleId?: string | null;
    role?: {
        id: string;
        name: string;
        displayName: string;
    } | null;
    emailVerified: boolean;
    createdAt: string;
}

export interface CreateUserDto {
    email: string;
    fullName: string;
    password?: string;
    profileFileId?: string;
    roleId?: string;
    role?: string; // legacy support
}

export interface UpdateUserDto {
    fullName?: string;
    profileFileId?: string;
    roleId?: string;
    role?: string; // legacy support
}

