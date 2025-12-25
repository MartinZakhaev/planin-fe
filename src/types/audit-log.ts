export interface AuditLog {
    id: string;
    userId: string;
    action: string;
    resource: string;
    details?: Record<string, any>;
    ipAddress?: string;
    createdAt: string;
    user?: {
        id: string;
        fullName: string;
        email: string;
    }
}
