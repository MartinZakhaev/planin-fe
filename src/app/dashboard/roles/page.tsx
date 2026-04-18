"use client";

import { useState } from "react";
import { Role, CreateRoleDto, UpdateRoleDto } from "@/types/role";
import { useRoles } from "@/hooks/use-roles";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, AlertTriangle, Shield } from "lucide-react";
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
import { RoleTable } from "./components/role-table";
import { RoleDialog } from "./components/role-dialog";
import { toast } from "sonner";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function RolesPage() {
    const { roles, isLoading, createRole, updateRole, deleteRole, refreshRoles } = useRoles();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);

    const [showBulkDelete, setShowBulkDelete] = useState(false);
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);

    const handleCreate = async (data: CreateRoleDto) => {
        try {
            await createRole(data);
            toast.success("Role created successfully");
            setIsDialogOpen(false);
            refreshRoles();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleUpdate = async (data: UpdateRoleDto) => {
        if (!selectedRole) return;
        try {
            await updateRole(selectedRole.id, data);
            toast.success("Role updated successfully");
            setIsDialogOpen(false);
            setSelectedRole(null);
            refreshRoles();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleBulkDelete = async () => {
        setIsBulkDeleting(true);
        try {
            const deletableRoles = selectedRoles.filter(r => !r.isSystem);
            for (const role of deletableRoles) {
                await deleteRole(role.id);
            }
            toast.success(`${deletableRoles.length} roles deleted successfully`);
            setSelectedRoles([]);
            setShowBulkDelete(false);
            refreshRoles();
        } catch (error: any) {
            toast.error("Failed to delete some roles");
        } finally {
            setIsBulkDeleting(false);
        }
    };

    const systemRolesCount = roles.filter(r => r.isSystem).length;
    const customRolesCount = roles.filter(r => !r.isSystem).length;

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
                            <BreadcrumbPage>Roles</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
                            <Shield className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{roles.length}</div>
                            <p className="text-xs text-muted-foreground">Available roles</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">System Roles</CardTitle>
                            <Shield className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{systemRolesCount}</div>
                            <p className="text-xs text-muted-foreground">Protected roles</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Custom Roles</CardTitle>
                            <Shield className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{customRolesCount}</div>
                            <p className="text-xs text-muted-foreground">User-defined roles</p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <div className="space-y-1">
                            <CardTitle>All Roles</CardTitle>
                            <CardDescription>
                                Manage user roles and their permissions.
                            </CardDescription>
                        </div>

                        <div className="flex items-center gap-2">
                            {selectedRoles.filter(r => !r.isSystem).length > 0 && (
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => setShowBulkDelete(true)}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete ({selectedRoles.filter(r => !r.isSystem).length})
                                </Button>
                            )}
                            <Button onClick={() => { setSelectedRole(null); setIsDialogOpen(true); }}>
                                <Plus className="mr-2 h-4 w-4" /> Add Role
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <RoleTable
                            roles={roles}
                            isLoading={isLoading}
                            onEdit={(role) => {
                                setSelectedRole(role);
                                setIsDialogOpen(true);
                            }}
                            onDelete={(id) => {
                                deleteRole(id).then(() => {
                                    toast.success("Role deleted successfully");
                                    refreshRoles();
                                }).catch((err) => toast.error(err.message));
                            }}
                            onSelectionChange={setSelectedRoles}
                        />
                    </CardContent>
                </Card>
                <RoleDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    role={selectedRole}
                    onSubmit={selectedRole ? handleUpdate : handleCreate as any}
                />

                <ActionDialog
                    open={showBulkDelete}
                    onOpenChange={setShowBulkDelete}
                    title="Delete Selected Roles"
                    description={`Are you sure you want to delete ${selectedRoles.filter(r => !r.isSystem).length} custom roles? System roles will be skipped.`}
                    onConfirm={handleBulkDelete}
                    confirmLabel="Delete All"
                    isLoading={isBulkDeleting}
                    type="warning"
                    variant="destructive"
                    icon={<AlertTriangle className="h-6 w-6 text-destructive" />}
                    iconPosition="left"
                />
            </div>
        </SidebarInset>
    );
}
