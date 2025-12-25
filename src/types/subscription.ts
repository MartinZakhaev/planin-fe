export interface Subscription {
    id: string;
    organizationId: string;
    planId: string;
    startDate: string;
    endDate: string;
    status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
    organization?: {
        id: string;
        name: string;
    };
    plan?: {
        id: string;
        name: string;
        price: number;
    };
}

export interface CreateSubDto {
    organizationId: string;
    planId: string;
    startDate: string;
    endDate: string;
    status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
}
