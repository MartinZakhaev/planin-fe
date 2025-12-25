import { useGenericCRUD } from './use-crud';
import { Organization, CreateOrgDto, UpdateOrgDto } from '@/types/organization';

export function useOrganizations() {
    const { items, isLoading, error, create, update, remove, refresh } = useGenericCRUD<
        Organization,
        CreateOrgDto,
        UpdateOrgDto
    >('/organizations');

    return {
        organizations: items,
        isLoading,
        error,
        createOrganization: create,
        updateOrganization: update,
        deleteOrganization: remove,
        refreshOrganizations: refresh,
    };
}
