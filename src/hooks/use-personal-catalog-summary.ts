import useSWR from "swr";
import { fetcher } from "@/lib/api";
import { PersonalCatalogSummary } from "@/types/personal-catalog-summary";

export function usePersonalCatalogSummary() {
    const { data, error, mutate, isLoading } = useSWR<PersonalCatalogSummary>(
        "/audit-logs/personal-catalogs",
        fetcher,
    );

    return {
        summary: data,
        isLoading,
        error,
        refreshSummary: mutate,
    };
}
