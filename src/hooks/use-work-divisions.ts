import { useGenericCRUD } from './use-crud';
import { WorkDivision, CreateWorkDivisionDto, UpdateWorkDivisionDto } from '@/types/work-division';

export function useWorkDivisions() {
    const { items, isLoading, error, create, update, remove, refresh } = useGenericCRUD<
        WorkDivision,
        CreateWorkDivisionDto,
        UpdateWorkDivisionDto
    >('/work-division-catalogs');

    return {
        workDivisions: items,
        isLoading,
        error,
        createWorkDivision: create,
        updateWorkDivision: update,
        deleteWorkDivision: remove,
        refreshWorkDivisions: refresh,
    };
}
