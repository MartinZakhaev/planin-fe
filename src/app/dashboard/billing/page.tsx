"use client";

import { useState } from "react";
import { useBilling, type Plan, type ActiveSubscription } from "@/hooks/use-billing";
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
import { Card, CardContent } from "@/components/ui/card";
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
    Crown,
    LayoutGrid,
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const formatIDR = (priceCents: number) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(priceCents / 100);

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
    ACTIVE: {
        label: "Active",
        className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border-0",
    },
    TRIALING: {
        label: "Pending payment",
        className: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border-0",
    },
    PAST_DUE: {
        label: "Past due",
        className: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400 border-0",
    },
    CANCELED: {
        label: "Canceled",
        className: "bg-muted text-muted-foreground border-0",
    },
    EXPIRED: {
        label: "Expired",
        className: "bg-muted text-muted-foreground border-0",
    },
};

const PLAN_META: Record<
    string,
    { icon: React.ElementType; label: string; description: string }
> = {
    STARTER: {
        icon: Zap,
        label: "Starter",
        description: "For small teams getting started",
    },
    PRO: {
        icon: Sparkles,
        label: "Professional",
        description: "For growing organizations",
    },
    ENTERPRISE: {
        icon: Building2,
        label: "Enterprise",
        description: "For large-scale operations",
    },
};

const PLAN_FEATURES: Record<string, string[]> = {
    STARTER: [
        "Up to 10 projects",
        "Organization management",
        "Member role management",
        "Project collaboration",
    ],
    PRO: [
        "Up to 50 projects",
        "Everything in Starter",
        "Advanced reporting",
        "Priority support",
    ],
    ENTERPRISE: [
        "Unlimited projects",
        "Everything in Pro",
        "Dedicated account manager",
        "SLA guarantee",
    ],
};

function PlanCard({
    plan,
    subscription,
    isCurrent,
    isCheckingOut,
    onUpgrade,
    paymentMethod,
    onPaymentMethodChange,
}: {
    plan: Plan;
    subscription: ActiveSubscription | null;
    isCurrent: boolean;
    isCheckingOut: boolean;
    onUpgrade: (planId: string) => void;
    paymentMethod: string;
    onPaymentMethodChange: (method: string) => void;
}) {
    const meta = PLAN_META[plan.code] ?? PLAN_META["STARTER"];
    const Icon = meta.icon;
    const features = PLAN_FEATURES[plan.code] ?? [];
    const isActive = isCurrent && subscription?.status === "ACTIVE";

    return (
        <Card
            className={`relative flex flex-col border overflow-hidden transition-shadow ${
                isActive
                    ? "border-foreground/20 shadow-md"
                    : "border-border/60 shadow-sm hover:shadow-md hover:border-border"
            }`}
        >
            {isActive && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-foreground" />
            )}

            <CardContent className="flex flex-col flex-1 p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div
                            className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${
                                isActive ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                            }`}
                        >
                            <Icon className="size-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-foreground">{meta.label}</p>
                                {isActive && (
                                    <Badge className="text-[10px] font-semibold px-1.5 py-0 bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border-0">
                                        <Crown className="size-2.5 mr-0.5" />
                                        Current
                                    </Badge>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{meta.description}</p>
                        </div>
                    </div>
                </div>

                {/* Price */}
                <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold tracking-tight text-foreground">
                            {formatIDR(plan.priceCents)}
                        </span>
                        <span className="text-sm text-muted-foreground">/ mo</span>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-border/60 mb-4" />

                {/* Features */}
                <div className="space-y-2 flex-1">
                    {features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2.5">
                            <CheckCircle2 className="size-3.5 text-primary shrink-0" />
                            <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>
                    ))}
                </div>

                {/* Payment method selector */}
                {!isActive && (
                    <div className="mt-4">
                        <Select value={paymentMethod} onValueChange={onPaymentMethodChange}>
                            <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder="Select payment" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="midtrans">Midtrans</SelectItem>
                                <SelectItem value="doku">Doku</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {/* CTA */}
                <div className="mt-5">
                    {isActive ? (
                        <Button
                            variant="outline"
                            className="w-full h-9 text-sm font-medium border-border/60 text-muted-foreground cursor-default"
                            disabled
                        >
                            Current Plan
                        </Button>
                    ) : (
                        <Button
                            className="w-full h-9 text-sm gap-2"
                            onClick={() => onUpgrade(plan.id)}
                            disabled={isCheckingOut}
                        >
                            {isCheckingOut ? (
                                <>
                                    <Loader2 className="size-3.5 animate-spin" />
                                    Redirecting...
                                </>
                            ) : (
                                <>
                                    {isCurrent ? "Reactivate" : "Upgrade"}
                                    <ArrowRight className="size-3.5" />
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default function BillingPage() {
    const { subscription, plans, isLoading, checkout, checkoutDoku } = useBilling();
    const [checkingOutPlanId, setCheckingOutPlanId] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<Record<string, string>>({});

    const handleUpgrade = async (planId: string) => {
        setCheckingOutPlanId(planId);
        try {
            const method = paymentMethod[planId] || "midtrans";
            if (method === "doku") {
                const result = await checkoutDoku(planId);
                window.location.href = result.paymentUrl;
            } else {
                await checkout(planId);
            }
        } catch {
            setCheckingOutPlanId(null);
        }
    };

    const currentPlan = subscription?.plan;
    const paidPlans = plans.filter((p) => p.priceCents > 0);
    const statusBadge =
        subscription?.status && STATUS_BADGE[subscription.status]
            ? STATUS_BADGE[subscription.status]
            : null;

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

            <div className="px-6 pt-5 pb-8 max-w-5xl">
                {/* Page title */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Billing &amp; Plans</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Choose the plan that fits your organization&apos;s needs.
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="size-6 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left — plan cards */}
                        <div className="lg:col-span-2">
                            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                                Available Plans
                            </h2>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {paidPlans.map((plan) => (
                                    <PlanCard
                                        key={plan.id}
                                        plan={plan}
                                        subscription={subscription}
                                        isCurrent={currentPlan?.id === plan.id}
                                        isCheckingOut={checkingOutPlanId === plan.id}
                                        onUpgrade={handleUpgrade}
                                        paymentMethod={paymentMethod[plan.id] || "midtrans"}
                                        onPaymentMethodChange={(method) =>
                                            setPaymentMethod((prev) => ({ ...prev, [plan.id]: method }))
                                        }
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Right — subscription summary */}
                        <div className="space-y-4">
                            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                                Current Subscription
                            </h2>

                            {/* Subscription card */}
                            <Card className="border-border/60 shadow-sm">
                                <CardContent className="p-5 space-y-0">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                                <CreditCard className="size-5 text-primary" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <p className="text-sm font-semibold text-foreground">
                                                        {currentPlan?.name ?? "Free"}
                                                    </p>
                                                    {statusBadge && (
                                                        <Badge
                                                            className={`text-[10px] font-medium px-1.5 py-0 ${statusBadge.className}`}
                                                        >
                                                            {statusBadge.label}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-px bg-border/60 my-3" />

                                    <div className="space-y-2.5">
                                        {/* Projects limit */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <FolderOpen className="size-3.5" />
                                                <span>Projects</span>
                                            </div>
                                            <span className="text-xs font-semibold text-foreground">
                                                {currentPlan
                                                    ? currentPlan.maxProjects === -1
                                                        ? "Unlimited"
                                                        : currentPlan.maxProjects
                                                    : "—"}
                                            </span>
                                        </div>

                                        {/* Monthly rate */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <CreditCard className="size-3.5" />
                                                <span>Monthly rate</span>
                                            </div>
                                            <span className="text-xs font-semibold text-foreground">
                                                {currentPlan ? formatIDR(currentPlan.priceCents) : "—"}
                                            </span>
                                        </div>

                                        {/* Renewal date */}
                                        {subscription?.currentPeriodEnd && (
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <Calendar className="size-3.5" />
                                                    <span>Renews</span>
                                                </div>
                                                <span className="text-xs font-semibold text-foreground">
                                                    {new Date(subscription.currentPeriodEnd).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                        }
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {!currentPlan && (
                                        <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                                            No active subscription. Upgrade to a paid plan to unlock more
                                            projects and features.
                                        </p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Quick stats */}
                            <div className="grid grid-cols-2 gap-2">
                                <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-muted/60 border border-border/40">
                                    <LayoutGrid className="size-3.5 text-muted-foreground shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                                            Plan
                                        </p>
                                        <p className="text-xs font-semibold text-foreground truncate">
                                            {currentPlan?.name ?? "Free"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-muted/60 border border-border/40">
                                    <FolderOpen className="size-3.5 text-muted-foreground shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                                            Projects
                                        </p>
                                        <p className="text-xs font-semibold text-foreground truncate">
                                            {currentPlan
                                                ? currentPlan.maxProjects === -1
                                                    ? "Unlimited"
                                                    : currentPlan.maxProjects
                                                : "—"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Contact note */}
                            <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 p-4">
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Need a custom plan or invoice billing?{" "}
                                    <button className="underline underline-offset-2 text-foreground/70 hover:text-foreground transition-colors">
                                        Contact us
                                    </button>{" "}
                                    for enterprise arrangements.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </SidebarInset>
    );
}
