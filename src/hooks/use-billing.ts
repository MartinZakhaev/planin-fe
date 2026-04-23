"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/api";

export interface Plan {
    id: string;
    code: string;
    name: string;
    priceCents: number;
    currency: string;
    interval: string;
    maxProjects: number;
    createdAt: string;
    updatedAt: string;
}

export interface ActiveSubscription {
    id: string;
    userId: string;
    planId: string;
    status: "TRIALING" | "ACTIVE" | "PAST_DUE" | "CANCELED" | "EXPIRED";
    trialEndsAt: string | null;
    currentPeriodStart: string | null;
    currentPeriodEnd: string | null;
    canceledAt: string | null;
    midtransOrderId: string | null;
    createdAt: string;
    updatedAt: string;
    plan: Plan;
}

export function useBilling() {
    const {
        data: subscription,
        isLoading: subLoading,
        mutate: mutateSub,
    } = useSWR<ActiveSubscription | null>("/subscriptions/my", fetcher);

    const { data: plans, isLoading: plansLoading } = useSWR<Plan[]>("/subscriptions/plans", fetcher);

    const checkout = async (planId: string): Promise<void> => {
        const res = await fetcher<{ snapToken: string; redirectUrl: string }>("/subscriptions/checkout", {
            method: "POST",
            body: JSON.stringify({ planId }),
        });
        window.location.href = res.redirectUrl;
    };

    const checkoutDoku = async (planId: string): Promise<{ paymentUrl: string; tokenId: string; expiredDate?: string; expiredDatetime?: string }> => {
        const res = await fetcher<{ paymentUrl: string; tokenId: string; expiredDate?: string; expiredDatetime?: string }>("/subscriptions/checkout-doku", {
            method: "POST",
            body: JSON.stringify({ planId }),
        });
        return res;
    };

    return {
        subscription: subscription ?? null,
        plans: plans ?? [],
        isLoading: subLoading || plansLoading,
        checkout,
        checkoutDoku,
        mutate: mutateSub,
    };
}
