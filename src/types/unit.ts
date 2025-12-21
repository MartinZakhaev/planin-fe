export interface Unit {
    id: string; // UUID
    code: string;
    name: string;
    createdAt: string; // ISO Date
    updatedAt: string; // ISO Date
}

export interface CreateUnitDto {
    code: string;
    name: string;
}

export interface UpdateUnitDto extends Partial<CreateUnitDto> { }
