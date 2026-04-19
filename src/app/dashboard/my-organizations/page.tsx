"use client";

import { useState } from "react";
import { Organization, CreateOrgDto, UpdateOrgDto } from "@/types/organization";
import { useOrganizations } from "@/hooks/use-organizations";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ActionDialog } from "@/components/action-dialog";
import { MyOrgTable } from "./components/my-org-table";
import { MyOrgDialog } from "./components/my-org-dialog";
import { toast } from "sonner";
import { Building2, Users, Crown, Plus, Trash2, AlertTriangle } from "lucide-react";

export default function MyOrganizationsPage() {
    const { user } = useAuth();
    const { organizations, isLoading, createOrganization, updateOrganization, deleteOrganization, refreshOrganizations } = useOrganizations();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
    const [selectedOrgs, setSelectedOrgs] = useState<Organization[]>([]);
    const [showBulkDelete, setShowBulkDelete] = useState(false);
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);

    const totalMembers = organizations.reduce((sum, o) => sum + (o.memberCount ?? 0), 0);
    const ownedCount = organizations.filter(o => o.ownerUserId === user?.id).length;

    const handleCreate = async (data: any) => {
        try {
            await createOrganization(data);
            toast.success("Organization created successfully");
            setIsDialogOpen(false);
            refreshOrganizations();
        } catch (err: any) {
            toast.error(err.message);
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
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const handleDelete = (id: string) => {
        deleteOrganization(id)
            .then(() => { toast.success("Organization deleted"); refreshOrganizations(); })
            .catch((err) => toast.error(err.message));
    };

    const handleBulkDelete = async () => {
        setIsBulkDeleting(true);
        try {
            for (const org of selectedOrgs) {
                await deleteOrganization(org.id);
            }
            toast.success(`${selectedOrgs.length} organizations deleted`);
            setSelectedOrgs([]);
            setShowBulkDelete(false);
            refreshOrganizations();
        } catch {
            toast.error("Failed to delete some organizations");
        } finally {
            setIsBulkDeleting(false);
        }
    };

    return (
        <SidebarInset>
            {/* Header */}
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
                            <BreadcrumbPage>My Organizations</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </header>

            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">My Organizations</CardTitle>
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{organizations.length}</div>
                            <p className="text-xs text-muted-foreground">Organizations you belong to</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalMembers}</div>
                            <p className="text-xs text-muted-foreground">Across all organizations</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">I Own</CardTitle>
                            <Crown className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{ownedCount}</div>
                            <p className="text-xs text-muted-foreground">Organizations where you are owner</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Table */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <div className="space-y-1">
                            <CardTitle>My Organizations</CardTitle>
                            <CardDescription>
                                Manage organizations you own or are a member of.
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            {selectedOrgs.length > 0 && (
                                <Button variant="destructive" size="sm" onClick={() => setShowBulkDelete(true)}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete ({selectedOrgs.length})
                                </Button>
                            )}
                            <Button onClick={() => { setSelectedOrg(null); setIsDialogOpen(true); }}>
                                <Plus className="mr-2 h-4 w-4" />
                                New Organization
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <MyOrgTable
                            organizations={organizations}
                            isLoading={isLoading}
                            currentUserId={user?.id || ""}
                            onEdit={(org) => { setSelectedOrg(org); setIsDialogOpen(true); }}
                            onDelete={handleDelete}
                            onSelectionChange={setSelectedOrgs}
                        />
                    </CardContent>
                </Card>
            </div>

            <MyOrgDialog
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
        </SidebarInset>
    );
}
