import { useGenericCRUD } from './use-crud';
import { AuditLog } from '@/types/audit-log';

export function useAuditLogs() {
    const { items, isLoading, error, refresh } = useGenericCRUD<AuditLog, any, any>('/audit-logs');

    return {
        auditLogs: items,
        isLoading,
        error,
        refreshAuditLogs: refresh,
    };
}
