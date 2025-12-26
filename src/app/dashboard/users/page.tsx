"use client";

import { useState } from "react";
import { User, CreateUserDto, UpdateUserDto } from "@/types/user";
import { useUsers } from "@/hooks/use-users";
import { DataTable, createSelectColumn } from "@/components/ui/data-table"; // Assuming generic table exists or will be created
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
import { UserTable } from "./components/user-table";
import { UserDialog } from "./components/user-dialog";
import { toast } from "sonner";
import { Users as UsersIcon, ShieldCheck, Clock } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function UsersPage() {
    const { users, isLoading, createUser, updateUser, deleteUser, refreshUsers } = useUsers();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

    const [showBulkDelete, setShowBulkDelete] = useState(false);
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);

    const handleCreate = async (data: any) => {
        try {
            await createUser(data);
            toast.success("User created successfully");
            setIsDialogOpen(false);
            refreshUsers();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleUpdate = async (data: any) => {
        if (!selectedUser) return;
        try {
            await updateUser(selectedUser.id, data);
            toast.success("User updated successfully");
            setIsDialogOpen(false);
            setSelectedUser(null);
            refreshUsers();
        } catch (error: any) {
            toast.error(error.message);
        }
    };



    const handleBulkDelete = async () => {
        setIsBulkDeleting(true);
        try {
            // Sequential delete for now as API might not support bulk
            for (const user of selectedUsers) {
                await deleteUser(user.id);
            }
            toast.success(`${selectedUsers.length} users deleted successfully`);
            setSelectedUsers([]);
            setShowBulkDelete(false);
            refreshUsers();
        } catch (error: any) {
            toast.error("Failed to delete some users");
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
                            <BreadcrumbPage>Users</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <UsersIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{users.length}</div>
                            <p className="text-xs text-muted-foreground">Registered users</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Admins</CardTitle>
                            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {users.filter(u => u.role === 'admin' || u.role === 'ADMIN').length}
                            </div>
                            <p className="text-xs text-muted-foreground">Admin privileges</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Recently Joined</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {users.filter(u => new Date(u.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
                            </div>
                            <p className="text-xs text-muted-foreground">+ from last 30 days</p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <div className="space-y-1">
                            <CardTitle>All Users</CardTitle>
                            <CardDescription>
                                Manage system users and roles.
                            </CardDescription>
                        </div>

                        <div className="flex items-center gap-2">
                            {selectedUsers.length > 0 && (
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => setShowBulkDelete(true)}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete ({selectedUsers.length})
                                </Button>
                            )}
                            <Button onClick={() => { setSelectedUser(null); setIsDialogOpen(true); }}>
                                <Plus className="mr-2 h-4 w-4" /> Add User
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <UserTable
                            users={users}
                            isLoading={isLoading}
                            onEdit={(user) => {
                                setSelectedUser(user);
                                setIsDialogOpen(true);
                            }}
                            onDelete={(id) => {
                                deleteUser(id).then(() => {
                                    toast.success("User deleted successfully");
                                    refreshUsers();
                                }).catch((err) => toast.error(err.message));
                            }}
                            onSelectionChange={setSelectedUsers}
                        />
                    </CardContent>
                </Card>
                <UserDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    user={selectedUser}
                    onSubmit={selectedUser ? handleUpdate : handleCreate}
                />

                <ActionDialog
                    open={showBulkDelete}
                    onOpenChange={setShowBulkDelete}
                    title="Delete Selected Users"
                    description={`Are you sure you want to delete ${selectedUsers.length} users? This action cannot be undone.`}
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
