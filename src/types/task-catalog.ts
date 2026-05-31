export interface TaskCatalog {
    id: string;
    name: string;
    code: string;
    ownerUserId?: string | null;
    description?: string;
    divisionId: string;
    division?: {
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
    divisionId: string;
}

export interface CreatePersonalTaskCatalogDto {
    name: string;
    divisionId: string;
    prefix?: string;
    description?: string;
}

export interface UpdateTaskCatalogDto {
    name?: string;
    code?: string;
    description?: string;
    divisionId?: string;
}
