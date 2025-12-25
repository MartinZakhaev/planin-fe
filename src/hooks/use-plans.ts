import { useGenericCRUD } from './use-crud';
import { Plan, CreatePlanDto, UpdatePlanDto } from '@/types/plan';

export function usePlans() {
    const { items, isLoading, error, create, update, remove, refresh } = useGenericCRUD<
        Plan,
        CreatePlanDto,
        UpdatePlanDto
    >('/plans');

    return {
        plans: items,
        isLoading,
        error,
        createPlan: create,
        updatePlan: update,
        deletePlan: remove,
        refreshPlans: refresh,
    };
}
