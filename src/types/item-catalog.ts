export interface ItemCatalog {
    id: string;
    name: string;
    code: string;
    type: 'MATERIAL' | 'MANPOWER' | 'TOOL';
    unitId: string;
    defaultPrice: number;
    description?: string;
    taskCatalogId?: string;
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
    type: 'MATERIAL' | 'MANPOWER' | 'TOOL';
    unitId: string;
    defaultPrice: number;
    description?: string;
}

export interface UpdateItemCatalogDto {
    name?: string;
    code?: string;
    type?: 'MATERIAL' | 'MANPOWER' | 'TOOL';
    unitId?: string;
    defaultPrice?: number;
    description?: string;
}
