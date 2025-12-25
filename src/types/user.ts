export interface User {
    id: string;
    email: string;
    fullName: string;
    profileFileId?: string;
    role: string;
    emailVerified: boolean;
    createdAt: string;
}

export interface CreateUserDto {
    email: string;
    fullName: string;
    password?: string;
    profileFileId?: string;
    role: string;
}

export interface UpdateUserDto {
    fullName?: string;
    profileFileId?: string;
    role?: string;
}
