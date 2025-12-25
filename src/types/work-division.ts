export interface WorkDivision {
    id: string;
    name: string;
    code: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateWorkDivisionDto {
    name: string;
    code: string;
    description?: string;
}

export interface UpdateWorkDivisionDto {
    name?: string;
    code?: string;
    description?: string;
}
