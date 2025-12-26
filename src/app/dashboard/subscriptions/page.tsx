"use client";

import { useState } from "react";
import { Subscription } from "@/types/subscription";
import { useSubscriptions } from "@/hooks/use-subscriptions";
import { DataTable, createSelectColumn } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, MoreHorizontal, AlertTriangle, ArrowUpDown } from "lucide-react";
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
import { SubDialog } from "./components/sub-dialog";
import { ActionDialog } from "@/components/action-dialog";
import { SubscriptionTable } from "./components/subscription-table";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function SubscriptionsPage() {
    const { subscriptions, isLoading, createSubscription, updateSubscription, deleteSubscription, refreshSubscriptions } = useSubscriptions();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);
    const [selectedSubs, setSelectedSubs] = useState<Subscription[]>([]);

    const [showBulkDelete, setShowBulkDelete] = useState(false);
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);

    const handleCreate = async (data: any) => {
        try {
            await createSubscription(data);
            toast.success("Subscription created successfully");
            setIsDialogOpen(false);
            refreshSubscriptions();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleUpdate = async (data: any) => {
        if (!selectedSub) return;
        try {
            await updateSubscription(selectedSub.id, data);
            toast.success("Subscription updated successfully");
            setIsDialogOpen(false);
            setSelectedSub(null);
            refreshSubscriptions();
        } catch (error: any) {
            toast.error(error.message);
        }
    };



    const handleBulkDelete = async () => {
        setIsBulkDeleting(true);
        try {
            for (const sub of selectedSubs) {
                await deleteSubscription(sub.id);
            }
            toast.success(`${selectedSubs.length} subscriptions deleted successfully`);
            setSelectedSubs([]);
            setShowBulkDelete(false);
            refreshSubscriptions();
        } catch (error: any) {
            toast.error("Failed to delete some subscriptions");
        } finally {
            setIsBulkDeleting(false);
        }
    };



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
                            <BreadcrumbPage>Subscriptions</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {subscriptions.filter(s => s.status === 'ACTIVE').length}
                            </div>
                            <p className="text-xs text-muted-foreground">Currently active</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {subscriptions.filter(s => {
                                    if (s.status !== 'ACTIVE') return false;
                                    if (!s.currentPeriodEnd) return false;
                                    const expiry = new Date(s.currentPeriodEnd);
                                    const now = new Date();
                                    const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                                    return diffDays <= 30 && diffDays > 0;
                                }).length}
                            </div>
                            <p className="text-xs text-muted-foreground">In next 30 days</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
                            <XCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {subscriptions.filter(s => s.status === 'CANCELLED').length}
                            </div>
                            <p className="text-xs text-muted-foreground">Churned subscriptions</p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <div className="space-y-1">
                            <CardTitle>All Subscriptions</CardTitle>
                            <CardDescription>
                                Manage organization subscriptions.
                            </CardDescription>
                        </div>

                        <div className="flex items-center gap-2">
                            {selectedSubs.length > 0 && (
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => setShowBulkDelete(true)}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete ({selectedSubs.length})
                                </Button>
                            )}
                            <Button onClick={() => { setSelectedSub(null); setIsDialogOpen(true); }}>
                                <Plus className="mr-2 h-4 w-4" /> Add Subscription
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <SubscriptionTable
                            subscriptions={subscriptions}
                            isLoading={isLoading}
                            onEdit={(sub) => {
                                setSelectedSub(sub);
                                setIsDialogOpen(true);
                            }}
                            onDelete={(id) => {
                                deleteSubscription(id).then(() => {
                                    toast.success("Subscription canceled/deleted successfully");
                                    refreshSubscriptions();
                                }).catch((err) => toast.error(err.message));
                            }}
                            onSelectionChange={setSelectedSubs}
                        />
                    </CardContent>
                </Card>

                <SubDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    subscription={selectedSub}
                    onSubmit={selectedSub ? handleUpdate : handleCreate}
                />



                <ActionDialog
                    open={showBulkDelete}
                    onOpenChange={setShowBulkDelete}
                    title="Delete Selected Subscriptions"
                    description={`Are you sure you want to delete ${selectedSubs.length} subscriptions? This action cannot be undone.`}
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
