"use client";

import { useState } from "react";
import { Plan } from "@/types/plan";
import { usePlans } from "@/hooks/use-plans";
import { DataTable, createSelectColumn } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, MoreHorizontal, AlertTriangle } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { PlanDialog } from "./components/plan-dialog";
import { ActionDialog } from "@/components/action-dialog";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { FileText, CreditCard } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function PlansPage() {
    const { plans, isLoading, createPlan, updatePlan, deletePlan, refreshPlans } = usePlans();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [selectedPlans, setSelectedPlans] = useState<Plan[]>([]);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [showBulkDelete, setShowBulkDelete] = useState(false);
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);

    const handleCreate = async (data: any) => {
        try {
            await createPlan(data);
            toast.success("Plan created successfully");
            setIsDialogOpen(false);
            refreshPlans();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleUpdate = async (data: any) => {
        if (!selectedPlan) return;
        try {
            await updatePlan(selectedPlan.id, data);
            toast.success("Plan updated successfully");
            setIsDialogOpen(false);
            setSelectedPlan(null);
            refreshPlans();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await deletePlan(deleteId);
            toast.success("Plan deleted successfully");
            setDeleteId(null);
            refreshPlans();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleBulkDelete = async () => {
        setIsBulkDeleting(true);
        try {
            for (const plan of selectedPlans) {
                await deletePlan(plan.id);
            }
            toast.success(`${selectedPlans.length} plans deleted successfully`);
            setSelectedPlans([]);
            setShowBulkDelete(false);
            refreshPlans();
        } catch (error: any) {
            toast.error("Failed to delete some plans");
        } finally {
            setIsBulkDeleting(false);
        }
    };

    const columns: ColumnDef<Plan>[] = [
        createSelectColumn<Plan>(),
        { accessorKey: "code", header: "Code" },
        { accessorKey: "name", header: "Name" },
        {
            accessorKey: "priceCents",
            header: "Price",
            cell: ({ row }) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: row.original.currency }).format(row.original.priceCents)
        },
        { accessorKey: "interval", header: "Interval" },
        { accessorKey: "maxProjects", header: "Projects" },

        {
            id: "actions",
            cell: ({ row }) => {
                const plan = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => {
                                    setSelectedPlan(plan);
                                    setIsDialogOpen(true);
                                }}
                            >
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => setDeleteId(plan.id)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    return (
        <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Plans</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Plans</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{plans.length}</div>
                            <p className="text-xs text-muted-foreground">Available subscription tiers</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Average Price</CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {plans.length > 0
                                    ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(
                                        plans.reduce((acc, p) => acc + (p.priceCents || 0), 0) / plans.length
                                    )
                                    : 0}
                            </div>
                            <p className="text-xs text-muted-foreground">Per active plan</p>
                        </CardContent>
                    </Card>

                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <div className="space-y-1">
                            <CardTitle>All Plans</CardTitle>
                            <CardDescription>
                                Manage subscription tiers and pricing.
                            </CardDescription>
                        </div>

                        <div className="flex items-center gap-2">
                            {selectedPlans.length > 0 && (
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => setShowBulkDelete(true)}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete ({selectedPlans.length})
                                </Button>
                            )}
                            <Button onClick={() => { setSelectedPlan(null); setIsDialogOpen(true); }}>
                                <Plus className="mr-2 h-4 w-4" /> Add Plan
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={plans}
                            isLoading={isLoading}
                            onRowSelectionChange={setSelectedPlans}
                        />
                    </CardContent>
                </Card>

                <PlanDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    plan={selectedPlan}
                    onSubmit={selectedPlan ? handleUpdate : handleCreate}
                />

                <ActionDialog
                    open={!!deleteId}
                    onOpenChange={(open) => !open && setDeleteId(null)}
                    title="Delete Plan"
                    description="Are you sure? Existing subscriptions might be affected."
                    onConfirm={handleDelete}
                    confirmLabel="Delete"
                    isLoading={false}
                    type="warning"
                    variant="destructive"
                />

                <ActionDialog
                    open={showBulkDelete}
                    onOpenChange={setShowBulkDelete}
                    title="Delete Selected Plans"
                    description={`Are you sure you want to delete ${selectedPlans.length} plans? This action cannot be undone.`}
                    onConfirm={handleBulkDelete}
                    confirmLabel="Delete All"
                    isLoading={isBulkDeleting}
                    type="warning"
                    variant="destructive"
                    icon={<AlertTriangle className="h-6 w-6 text-destructive" />}
                    iconPosition="left"
                />
            </div>
        </SidebarInset >
    );
}
