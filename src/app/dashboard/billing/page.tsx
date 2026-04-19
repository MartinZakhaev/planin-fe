"use client";

import { useState } from "react";
import { useBilling, type Plan } from "@/hooks/use-billing";
import { useAuth } from "@/hooks/use-auth";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    Loader2,
    CreditCard,
    CheckCircle2,
    FolderOpen,
    Calendar,
    ArrowRight,
    Zap,
    Building2,
    Sparkles,
} from "lucide-react";

const formatIDR = (priceCents: number) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(priceCents / 100);

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
    ACTIVE: { label: "Active", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border-0" },
    TRIALING: { label: "Pending payment", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border-0" },
    PAST_DUE: { label: "Past due", className: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400 border-0" },
    CANCELED: { label: "Canceled", className: "bg-muted text-muted-foreground border-0" },
    EXPIRED: { label: "Expired", className: "bg-muted text-muted-foreground border-0" },
};

const PLAN_ICONS: Record<string, React.ElementType> = {
    STARTER: Zap,
    PRO: Sparkles,
    ENTERPRISE: Building2,
};

function PlanCard({
    plan,
    isCurrent,
    isCheckingOut,
    onUpgrade,
}: {
    plan: Plan;
    isCurrent: boolean;
    isCheckingOut: boolean;
    onUpgrade: (planId: string) => void;
}) {
    const Icon = PLAN_ICONS[plan.code] ?? Zap;
    const isFree = plan.priceCents === 0;

    return (
        <Card
            className={`relative flex flex-col border transition-shadow ${
                isCurrent
                    ? "border-foreground/30 shadow-md"
                    : "border-border/60 shadow-sm hover:shadow-md hover:border-border"
            }`}
        >
            {isCurrent && (
                <div className="absolute -top-px left-4 right-4 h-px bg-foreground/30 rounded-full" />
            )}

            <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <Icon className="size-4.5 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-foreground">{plan.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5 capitalize">{plan.interval}</p>
                        </div>
                    </div>
                    {isCurrent && (
                        <Badge className="text-[10px] font-semibold px-2 py-0.5 bg-foreground text-background border-0 shrink-0">
                            Current Plan
                        </Badge>
                    )}
                </div>

                <div className="mt-4">
                    {isFree ? (
                        <p className="text-3xl font-bold tracking-tight">Free</p>
                    ) : (
                        <div className="flex items-baseline gap-1">
                            <p className="text-3xl font-bold tracking-tight">{formatIDR(plan.priceCents)}</p>
                            <span className="text-sm text-muted-foreground">/ mo</span>
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent className="flex flex-col flex-1 pt-0">
                <div className="space-y-2.5 flex-1">
                    <FeatureRow
                        icon={FolderOpen}
                        label={plan.maxProjects === -1 ? "Unlimited projects" : `Up to ${plan.maxProjects} projects`}
                    />
                    <FeatureRow icon={CheckCircle2} label="Full organization management" />
                    <FeatureRow icon={CheckCircle2} label="Member role management" />
                </div>

                <div className="mt-6">
                    {isCurrent ? (
                        <Button variant="outline" className="w-full h-9 text-sm" disabled>
                            Current Plan
                        </Button>
                    ) : isFree ? (
                        <Button variant="outline" className="w-full h-9 text-sm" disabled>
                            Included
                        </Button>
                    ) : (
                        <Button
                            className="w-full h-9 text-sm gap-2"
                            onClick={() => onUpgrade(plan.id)}
                            disabled={isCheckingOut}
                        >
                            {isCheckingOut ? (
                                <><Loader2 className="size-3.5 animate-spin" />Processing...</>
                            ) : (
                                <>Upgrade <ArrowRight className="size-3.5" /></>
                            )}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

function FeatureRow({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
    return (
        <div className="flex items-center gap-2.5">
            <Icon className="size-3.5 text-muted-foreground shrink-0" />
            <span className="text-sm text-muted-foreground">{label}</span>
        </div>
    );
}

export default function BillingPage() {
    const { subscription, plans, isLoading } = useBilling();
    const [checkingOutPlanId, setCheckingOutPlanId] = useState<string | null>(null);
    const { checkout } = useBilling();

    const handleUpgrade = async (planId: string) => {
        setCheckingOutPlanId(planId);
        try {
            await checkout(planId);
        } catch (err: any) {
            setCheckingOutPlanId(null);
        }
    };

    const currentPlan = subscription?.plan;
    const paidPlans = plans.filter((p) => p.priceCents > 0);
    const statusInfo = subscription?.status ? STATUS_BADGE[subscription.status] : null;

    return (
        <SidebarInset className="flex flex-col">
            <header className="flex h-16 shrink-0 items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Billing</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </header>

            <div className="px-6 pt-5 pb-8 space-y-8 max-w-4xl">
                {/* Page title */}
                <div>
                    <h1 className="text-xl font-semibold tracking-tight">Billing & Plans</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage your subscription and upgrade your plan.
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="size-6 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <>
                        {/* Current Plan */}
                        <section>
                            <h2 className="text-sm font-semibold mb-3 text-foreground/70 uppercase tracking-wide">
                                Current Plan
                            </h2>
                            <Card className="border-border/60 shadow-sm">
                                <CardContent className="p-5">
                                    <div className="flex items-center justify-between gap-4 flex-wrap">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                                <CreditCard className="size-5 text-primary" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <p className="text-sm font-semibold">
                                                        {currentPlan?.name ?? "Free"}
                                                    </p>
                                                    {statusInfo && (
                                                        <Badge className={`text-[10px] font-medium px-1.5 py-0 ${statusInfo.className}`}>
                                                            {statusInfo.label}
                                                        </Badge>
                                                    )}
                                                </div>
                                                {subscription?.currentPeriodStart && subscription.currentPeriodEnd ? (
                                                    <div className="flex items-center gap-1.5 mt-1">
                                                        <Calendar className="size-3 text-muted-foreground" />
                                                        <p className="text-xs text-muted-foreground">
                                                            {new Date(subscription.currentPeriodStart).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                                            {" — "}
                                                            {new Date(subscription.currentPeriodEnd).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {currentPlan
                                                            ? `${formatIDR(currentPlan.priceCents)} / month`
                                                            : "No active subscription"}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {currentPlan && (
                                                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                                    <FolderOpen className="size-3.5" />
                                                    <span>
                                                        {currentPlan.maxProjects === -1
                                                            ? "Unlimited projects"
                                                            : `${currentPlan.maxProjects} projects`}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </section>

                        {/* Available Plans */}
                        <section>
                            <h2 className="text-sm font-semibold mb-3 text-foreground/70 uppercase tracking-wide">
                                Available Plans
                            </h2>
                            <div className="grid gap-4 sm:grid-cols-3">
                                {paidPlans.map((plan) => (
                                    <PlanCard
                                        key={plan.id}
                                        plan={plan}
                                        isCurrent={currentPlan?.id === plan.id && subscription?.status === "ACTIVE"}
                                        isCheckingOut={checkingOutPlanId === plan.id}
                                        onUpgrade={handleUpgrade}
                                    />
                                ))}
                                {paidPlans.length === 0 && (
                                    <p className="text-sm text-muted-foreground col-span-3">No plans available.</p>
                                )}
                            </div>
                        </section>
                    </>
                )}
            </div>
        </SidebarInset>
    );
}
