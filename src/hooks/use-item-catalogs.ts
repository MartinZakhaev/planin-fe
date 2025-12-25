import { useGenericCRUD } from './use-crud';
import { ItemCatalog, CreateItemCatalogDto, UpdateItemCatalogDto } from '@/types/item-catalog';

export function useItemCatalogs() {
    const { items, isLoading, error, create, update, remove, refresh } = useGenericCRUD<
        ItemCatalog,
        CreateItemCatalogDto,
        UpdateItemCatalogDto
    >('/item-catalogs');

    return {
        itemCatalogs: items,
        isLoading,
        error,
        createItemCatalog: create,
        updateItemCatalog: update,
        deleteItemCatalog: remove,
        refreshItemCatalogs: refresh,
    };
}
