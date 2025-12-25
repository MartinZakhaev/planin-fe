import { useGenericCRUD } from './use-crud';
import { Subscription, CreateSubDto } from '@/types/subscription';

export function useSubscriptions() {
    const { items, isLoading, error, create, update, remove, refresh } = useGenericCRUD<
        Subscription,
        CreateSubDto,
        CreateSubDto // Update DTO same as Create for now or Partial
    >('/subscriptions');

    return {
        subscriptions: items,
        isLoading,
        error,
        createSubscription: create,
        updateSubscription: update,
        deleteSubscription: remove,
        refreshSubscriptions: refresh,
    };
}
