import { useGenericCRUD } from './use-crud';
import { Project, CreateProjectDto, UpdateProjectDto } from '@/types/project';

export function useProjects() {
    const { items, isLoading, error, create, update, remove, refresh } = useGenericCRUD<
        Project,
        CreateProjectDto,
        UpdateProjectDto
    >('/projects');

    return {
        projects: items,
        isLoading,
        error,
        createProject: create,
        updateProject: update,
        deleteProject: remove,
        refreshProjects: refresh,
    };
}
