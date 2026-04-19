"use client";

import { useEffect } from "react";
import { useBilling } from "@/hooks/use-billing";
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
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function BillingSuccessPage() {
    const { mutate } = useBilling();

    useEffect(() => {
        mutate();
    }, [mutate]);

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
                            <BreadcrumbLink href="/dashboard/billing">Billing</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Payment Received</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </header>

            <div className="flex flex-1 flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-6">
                <div className="size-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <CheckCircle2 className="size-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                    <h1 className="text-xl font-semibold">Payment received</h1>
                    <p className="text-sm text-muted-foreground mt-1.5 max-w-sm">
                        Your subscription is being activated. This may take a moment — your plan will update shortly.
                    </p>
                </div>
                <Button asChild className="mt-2 gap-2">
                    <Link href="/dashboard/billing">Back to Billing</Link>
                </Button>
            </div>
        </SidebarInset>
    );
}
