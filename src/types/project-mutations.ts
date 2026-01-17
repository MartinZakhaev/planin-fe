// DTOs for Project Entity Mutations

export interface CreateProjectDivisionDto {
    projectId: string;
    divisionId: string;
    displayName: string;
    sortOrder?: number;
}

export interface UpdateProjectDivisionDto {
    displayName?: string;
    sortOrder?: number;
}

export interface CreateProjectTaskDto {
    projectId: string;
    projectDivisionId: string;
    taskCatalogId?: string;
    displayName: string;
    sortOrder?: number;
    notes?: string;
}

export interface UpdateProjectTaskDto {
    displayName?: string;
    sortOrder?: number;
    notes?: string;
}

export interface CreateTaskLineItemDto {
    projectId: string;
    projectTaskId: string;
    itemCatalogId: string;
    unitId: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    taxable?: boolean;
}

export interface UpdateTaskLineItemDto {
    description?: string;
    quantity?: number;
    unitPrice?: number;
    taxable?: boolean;
}
