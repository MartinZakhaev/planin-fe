export interface AuditLog {
    id: string;
    userId: string | null;
    projectId: string | null;
    action: string;
    entityTable: string | null;
    entityId: string | null;
    meta?: Record<string, any> | null;
    ip: string | null;
    userAgent: string | null;
    createdAt: string;
    user?: {
        id: string;
        fullName: string | null;
        email: string;
    } | null;
}
