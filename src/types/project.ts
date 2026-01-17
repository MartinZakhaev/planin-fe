export interface Project {
    id: string;
    organizationId: string;
    ownerUserId: string;
    name: string;
    code: string | null;
    description: string | null;
    location: string | null;
    taxRatePercent: number;
    currency: string;
    createdAt: string;
    updatedAt: string;
    organization?: {
        id: string;
        name: string;
        code: string;
    };
    owner?: {
        id: string;
        fullName: string;
        email: string;
    };
}

export interface CreateProjectDto {
    organizationId: string;
    ownerUserId?: string;
    name: string;
    code?: string;
    description?: string;
    location?: string;
    taxRatePercent?: number;
    currency?: string;
}

export interface UpdateProjectDto {
    name?: string;
    code?: string;
    description?: string;
    location?: string;
    taxRatePercent?: number;
    currency?: string;
}
