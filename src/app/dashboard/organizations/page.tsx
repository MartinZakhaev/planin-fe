"use client";

import { useState } from "react";
import { Organization, CreateOrgDto, UpdateOrgDto } from "@/types/organization";
import { useOrganizations } from "@/hooks/use-organizations";
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
import { ActionDialog } from "@/components/action-dialog";
import { OrganizationTable } from "./components/organization-table";
import { OrgDialog } from "./components/org-dialog";
import { toast } from "sonner";
import { Building2, Clock, BarChart3 } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function OrganizationsPage() {
    const { organizations, isLoading, createOrganization, updateOrganization, deleteOrganization, refreshOrganizations } = useOrganizations();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
    const [selectedOrgs, setSelectedOrgs] = useState<Organization[]>([]);

    const [showBulkDelete, setShowBulkDelete] = useState(false);
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);

    const handleCreate = async (data: any) => {
        try {
            await createOrganization(data);
            toast.success("Organization created successfully");
            setIsDialogOpen(false);
            refreshOrganizations();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleUpdate = async (data: any) => {
        if (!selectedOrg) return;
        try {
            await updateOrganization(selectedOrg.id, data);
            toast.success("Organization updated successfully");
            setIsDialogOpen(false);
            setSelectedOrg(null);
            refreshOrganizations();
        } catch (error: any) {
            toast.error(error.message);
        }
    };



    const handleBulkDelete = async () => {
        setIsBulkDeleting(true);
        try {
            for (const org of selectedOrgs) {
                await deleteOrganization(org.id);
            }
            toast.success(`${selectedOrgs.length} organizations deleted successfully`);
            setSelectedOrgs([]);
            setShowBulkDelete(false);
            refreshOrganizations();
        } catch (error: any) {
            toast.error("Failed to delete some organizations");
        } finally {
            setIsBulkDeleting(false);
        }
    };



    return (
        <SidebarInset>
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
                            <BreadcrumbPage>Organizations</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Organizations</CardTitle>
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{organizations.length}</div>
                            <p className="text-xs text-muted-foreground">Registered companies</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {organizations.filter(o => new Date(o.createdAt) > new Date(new Date().setDate(1))).length}
                            </div>
                            <p className="text-xs text-muted-foreground">Since first of month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Growth</CardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+12%</div>
                            <p className="text-xs text-muted-foreground">from last month</p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <div className="space-y-1">
                            <CardTitle>All Organizations</CardTitle>
                            <CardDescription>
                                Manage your organizations and companies.
                            </CardDescription>
                        </div>

                        <div className="flex items-center gap-2">
                            {selectedOrgs.length > 0 && (
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => setShowBulkDelete(true)}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete ({selectedOrgs.length})
                                </Button>
                            )}
                            <Button onClick={() => { setSelectedOrg(null); setIsDialogOpen(true); }}>
                                <Plus className="mr-2 h-4 w-4" /> Add Organization
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <OrganizationTable
                            organizations={organizations}
                            isLoading={isLoading}
                            onEdit={(org) => {
                                setSelectedOrg(org);
                                setIsDialogOpen(true);
                            }}
                            onDelete={(id) => {
                                deleteOrganization(id).then(() => {
                                    toast.success("Organization deleted successfully");
                                    refreshOrganizations();
                                }).catch((err) => toast.error(err.message));
                            }}
                            onSelectionChange={setSelectedOrgs}
                        />
                    </CardContent>
                </Card>
                <OrgDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    org={selectedOrg}
                    onSubmit={selectedOrg ? handleUpdate : handleCreate}
                />

                <ActionDialog
                    open={showBulkDelete}
                    onOpenChange={setShowBulkDelete}
                    title="Delete Selected Organizations"
                    description={`Are you sure you want to delete ${selectedOrgs.length} organizations? This action cannot be undone.`}
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
