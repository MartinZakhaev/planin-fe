import { useGenericCRUD } from './use-crud';
import { TaskCatalog, CreateTaskCatalogDto, UpdateTaskCatalogDto } from '@/types/task-catalog';

export function useTaskCatalogs() {
    const { items, isLoading, error, create, update, remove, refresh } = useGenericCRUD<
        TaskCatalog,
        CreateTaskCatalogDto,
        UpdateTaskCatalogDto
    >('/task-catalogs');

    return {
        taskCatalogs: items,
        isLoading,
        error,
        createTaskCatalog: create,
        updateTaskCatalog: update,
        deleteTaskCatalog: remove,
        refreshTaskCatalogs: refresh,
    };
}
