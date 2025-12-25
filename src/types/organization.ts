export interface Organization {
    id: string;
    name: string;
    code: string;
    ownerUserId: string;
    createdAt: string;
}

export interface CreateOrgDto {
    name: string;
    code: string;
    ownerUserId: string;
}

export interface UpdateOrgDto {
    name?: string;
    code?: string;
}

export interface OrgMember {
    id: string;
    organizationId: string;
    userId: string;
    role: 'MEMBER' | 'ADMIN';
    createdAt: string;
    user?: {
        id: string;
        fullName: string;
        email: string;
        profileFileId?: string;
    };
}

export interface AddMemberDto {
    organizationId: string;
    userId: string;
    role: 'MEMBER' | 'ADMIN';
}

export interface UpdateMemberRoleDto {
    role: 'MEMBER' | 'ADMIN';
}
