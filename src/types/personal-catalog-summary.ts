import { AuditLog } from "./audit-log";

export interface PersonalCatalogUser {
    id: string;
    fullName: string | null;
    email: string;
}

export interface PersonalTaskCatalogSummary {
    id: string;
    code: string;
    name: string;
    description: string | null;
    divisionId: string;
    division?: {
        id: string;
        code: string;
        name: string;
    } | null;
    createdAt: string;
    updatedAt: string;
}

export interface PersonalItemCatalogSummary {
    id: string;
    code: string;
    name: string;
    description: string | null;
    type: "MATERIAL" | "MANPOWER" | "TOOL";
    unitId: string;
    unit?: {
        id: string;
        code: string;
        name: string;
    } | null;
    defaultPrice: number;
    createdAt: string;
    updatedAt: string;
}

export interface PersonalCatalogUserSummary {
    user: PersonalCatalogUser;
    counts: {
        taskCatalogs: number;
        itemCatalogs: number;
        workDivisions: number;
        total: number;
    };
    taskCatalogs: PersonalTaskCatalogSummary[];
    itemCatalogs: PersonalItemCatalogSummary[];
    workDivisions: [];
}

export interface PersonalCatalogSummary {
    totals: {
        users: number;
        taskCatalogs: number;
        itemCatalogs: number;
        workDivisions: number;
        total: number;
    };
    users: PersonalCatalogUserSummary[];
    recentAuditLogs: AuditLog[];
}
