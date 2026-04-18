export interface Permission {
    id: string;
    resource: string;
    action: string;
    description?: string | null;
    createdAt?: string;
}

export interface Role {
    id: string;
    name: string;
    displayName: string;
    description?: string | null;
    isSystem: boolean;
    createdAt: string;
    updatedAt: string;
    permissions?: Permission[];
    userCount?: number;
}

export interface CreateRoleDto {
    name: string;
    displayName: string;
    description?: string;
    permissionIds?: string[];
}

export interface UpdateRoleDto {
    name?: string;
    displayName?: string;
    description?: string;
    permissionIds?: string[];
}
