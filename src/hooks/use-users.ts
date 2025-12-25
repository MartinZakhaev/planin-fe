import { useGenericCRUD } from './use-crud';
import { User, CreateUserDto, UpdateUserDto } from '@/types/user';

export function useUsers() {
    const { items, isLoading, error, create, update, remove, refresh } = useGenericCRUD<
        User,
        CreateUserDto,
        UpdateUserDto
    >('/users');

    return {
        users: items,
        isLoading,
        error,
        createUser: create,
        updateUser: update,
        deleteUser: remove,
        refreshUsers: refresh,
    };
}
