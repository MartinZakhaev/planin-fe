export interface TaskCatalog {
    id: string;
    name: string;
    code: string;
    description?: string;
    workDivisionId: string;
    workDivision?: {
        id: string;
        name: string;
        code: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface CreateTaskCatalogDto {
    name: string;
    code: string;
    description?: string;
    workDivisionId: string;
}

export interface UpdateTaskCatalogDto {
    name?: string;
    code?: string;
    description?: string;
    workDivisionId?: string;
}
