import { Project } from './project';

export interface ProjectDivision {
    id: string;
    projectId: string;
    divisionId: string;
    displayName: string;
    sortOrder: number;
    division: {
        id: string;
        code: string;
        name: string;
        description: string | null;
    };
    tasks: ProjectTask[];
}

export interface ProjectTask {
    id: string;
    projectId: string;
    projectDivisionId: string;
    taskCatalogId: string | null;
    displayName: string;
    sortOrder: number;
    taskCatalog: {
        id: string;
        code: string;
        name: string;
    } | null;
    lineItems: TaskLineItem[];
}

export interface TaskLineItem {
    id: string;
    projectId: string;
    projectTaskId: string;
    itemCatalogId: string | null;
    description: string | null;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    itemCatalog: {
        id: string;
        code: string;
        name: string;
        type: string;
    } | null;
    unit: {
        id: string;
        code: string;
        name: string;
    };
}

export interface ProjectDetails extends Project {
    organization: {
        id: string;
        name: string;
        code: string;
    };
    owner: {
        id: string;
        fullName: string;
        email: string;
    };
    divisions: ProjectDivision[];
}
