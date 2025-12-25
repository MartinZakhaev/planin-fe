export interface Plan {
    id: string;
    code: string;
    name: string;
    priceCents: number;
    currency: string;
    interval: 'monthly' | 'yearly';
    maxProjects: number;
    createdAt: string;
}

export interface CreatePlanDto {
    code: string;
    name: string;
    priceCents: number;
    currency: string;
    interval: 'monthly' | 'yearly';
    maxProjects: number;
}

export interface UpdatePlanDto {
    code?: string;
    name?: string;
    priceCents?: number;
    currency?: string;
    interval?: 'monthly' | 'yearly';
    maxProjects?: number;
}
