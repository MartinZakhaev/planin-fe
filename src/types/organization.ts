export interface Organization {
    id: string;
    name: string;
    code: string;
    ownerUserId: string;
    createdAt: string;
    memberCount?: number;
    projectCount?: number;
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
        fullName: string | null;
        email: string;
        image?: string | null;
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
