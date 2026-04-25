import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const plans = [
    {
        name: "Free",
        description: "For contractors validating their first estimates.",
        priceCents: 0,
        period: "/month",
        maxProjects: "3 projects",
        features: [
            { name: "Up to 3 active projects", included: true },
            { name: "Basic Cost Tracking", included: true },
            { name: "Mobile App Access", included: true },
            { name: "Material Estimation", included: false },
            { name: "Priority Support", included: false },
        ],
        cta: "Start Free",
        featured: false,
    },
    {
        name: "Starter",
        description: "For small teams managing active construction budgets.",
        priceCents: 9900000,
        period: "/month",
        maxProjects: "10 projects",
        features: [
            { name: "Up to 10 active projects", included: true },
            { name: "Project budget tracking", included: true },
            { name: "Material & Labor Estimation", included: true },
            { name: "RAB summaries and exports", included: true },
            { name: "Priority Email Support", included: false },
        ],
        cta: "Start 14-Day Free Trial",
        featured: true,
    },
    {
        name: "Professional",
        description: "For growing teams with multiple project controls.",
        priceCents: 29900000,
        period: "/month",
        maxProjects: "50 projects",
        features: [
            { name: "Up to 50 active projects", included: true },
            { name: "Advanced analytics and reports", included: true },
            { name: "Material & labor estimation", included: true },
            { name: "Receipt scanning workflows", included: true },
            { name: "Priority email support", included: true },
        ],
        cta: "Start 14-Day Free Trial",
        featured: false,
    },
    {
        name: "Enterprise",
        description: "For organizations standardizing project finance.",
        priceCents: 99900000,
        period: "/month",
        maxProjects: "Unlimited projects",
        features: [
            { name: "Unlimited active projects", included: true },
            { name: "All Professional features", included: true },
            { name: "Organization-wide controls", included: true },
            { name: "Dedicated onboarding support", included: true },
            { name: "Enterprise security workflows", included: true },
        ],
        cta: "Contact Us",
        featured: false,
    },
];

const formatRupiah = (priceCents: number) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(priceCents / 100);

export function Pricing() {
    return (
        <section id="pricing" className="scroll-mt-24 py-24 md:py-32 bg-muted/40">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-14">
                    <Badge variant="secondary" className="mb-3 text-xs">
                        Pricing
                    </Badge>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-muted-foreground">
                        Choose a plan that fits the scale of your construction projects.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-4 max-w-7xl mx-auto">
                    {plans.map((plan) => (
                        <Card
                            key={plan.name}
                            className={`relative flex min-h-[34rem] flex-col rounded-lg ${
                                plan.featured
                                    ? "border-primary shadow-xl shadow-primary/10"
                                    : "border-border/80 shadow-sm"
                            }`}
                        >
                            {plan.featured && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <Badge className="text-xs font-semibold">Most Popular</Badge>
                                </div>
                            )}

                            <CardHeader className="space-y-4 pb-4">
                                <CardTitle className="text-xl">{plan.name}</CardTitle>
                                <CardDescription className="min-h-11 text-sm leading-relaxed">
                                    {plan.description}
                                </CardDescription>
                                <div className="pt-2">
                                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                                        <span className="text-[2rem] font-bold leading-none tracking-tight md:text-4xl 2xl:text-[2.05rem]">
                                            {formatRupiah(plan.priceCents)}
                                        </span>
                                        {plan.period && (
                                            <span className="text-sm font-medium text-muted-foreground">
                                                per month
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-3 text-xs font-medium text-muted-foreground">
                                        {plan.maxProjects}
                                    </p>
                                </div>
                            </CardHeader>

                            <CardContent className="flex-1">
                                <ul className="space-y-3">
                                    {plan.features.map((feature) => (
                                        <li
                                            key={feature.name}
                                            className={`flex items-center gap-3 text-sm ${
                                                feature.included
                                                    ? "text-foreground"
                                                    : "text-muted-foreground"
                                            }`}
                                        >
                                            {feature.included ? (
                                                <Check
                                                    className={`size-4 shrink-0 ${
                                                        plan.featured
                                                            ? "text-primary"
                                                            : "text-green-500"
                                                    }`}
                                                />
                                            ) : (
                                                <X className="size-4 shrink-0 text-muted-foreground/50" />
                                            )}
                                            <span>{feature.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>

                            <CardFooter className="pt-4">
                                <Link href="/signup" className="w-full">
                                    <Button
                                        className="w-full whitespace-normal"
                                        variant={plan.featured ? "default" : "outline"}
                                    >
                                        {plan.cta}
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {/* Money Back Guarantee + Security Badge */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-12 text-center sm:text-left">
                    <p className="text-sm text-muted-foreground">
                        All plans include a{" "}
                        <span className="font-medium text-foreground">
                            30-day money-back guarantee
                        </span>
                        . No questions asked.
                    </p>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40">
                        <Image src="/doku_logo.svg" alt="Doku" width={20} height={20} className="shrink-0" />
                        <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                            Secured by Doku Payment Gateway
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
