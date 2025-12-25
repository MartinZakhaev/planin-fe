export interface ItemCatalog {
    id: string;
    name: string;
    code: string;
    type: 'MATERIAL' | 'WAGE' | 'TOOL' | 'SUB_WORK';
    unit: string;
    price: number;
    description?: string;
    taskCatalogId?: string; // Optional relation to a task group
    taskCatalog?: {
        id: string;
        name: string;
        code: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface CreateItemCatalogDto {
    name: string;
    code: string;
    type: 'MATERIAL' | 'WAGE' | 'TOOL' | 'SUB_WORK';
    unit: string;
    price: number;
    description?: string;
    taskCatalogId?: string;
}

export interface UpdateItemCatalogDto {
    name?: string;
    code?: string;
    type?: 'MATERIAL' | 'WAGE' | 'TOOL' | 'SUB_WORK';
    unit?: string;
    price?: number;
    description?: string;
    taskCatalogId?: string;
}
