import { useGenericCRUD } from './use-crud';
import { Role, CreateRoleDto, UpdateRoleDto } from '@/types/role';

export function useRoles() {
    const { items, isLoading, error, create, update, remove, refresh } = useGenericCRUD<
        Role,
        CreateRoleDto,
        UpdateRoleDto
    >('/roles');

    return {
        roles: items,
        isLoading,
        error,
        createRole: create,
        updateRole: update,
        deleteRole: remove,
        refreshRoles: refresh,
    };
}
