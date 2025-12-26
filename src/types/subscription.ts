export interface Subscription {
    id: string;
    userId: string;
    planId: string;
    status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
    trialEndsAt?: string | null;
    currentPeriodStart?: string | null;
    currentPeriodEnd?: string | null;
    canceledAt?: string | null;
    createdAt: string;
    updatedAt: string;
    // Optional relations if expanded later, but base is raw
    user?: {
        id: string;
        fullName: string;
        email: string;
    };
    plan?: {
        id: string;
        name: string;
        price: number;
    };
    organization?: {
        id: string;
        name: string;
    };
}

export interface CreateSubDto {
    userId: string;
    planId: string;
    status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
    trialEndsAt?: string;
    currentPeriodStart?: string;
    currentPeriodEnd?: string;
    canceledAt?: string;
}
