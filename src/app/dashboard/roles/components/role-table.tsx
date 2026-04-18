"use client";

import { useState } from "react";
import { Role } from "@/types/role";
import { DataTable, createSelectColumn } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ArrowUpDown, MoreHorizontal, AlertTriangle, Shield, ShieldCheck, Users } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ActionDialog } from "@/components/action-dialog";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";

interface RoleTableProps {
    roles: Role[];
    isLoading: boolean;
    onEdit: (role: Role) => void;
    onDelete: (id: string) => void;
    onSelectionChange?: (selectedRoles: Role[]) => void;
}

export function RoleTable({ roles, isLoading, onEdit, onDelete, onSelectionChange }: RoleTableProps) {
    const [deleteRole, setDeleteRole] = useState<Role | null>(null);

    const columns: ColumnDef<Role>[] = [
        createSelectColumn<Role>(),
        {
            accessorKey: "displayName",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="-ml-4"
                    >
                        <Shield className="mr-2 h-4 w-4" />
                        Role
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const role = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{role.displayName}</span>
                        {role.isSystem && (
                            <Badge variant="secondary" className="text-xs">System</Badge>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: "name",
            header: "Identifier",
            cell: ({ row }) => (
                <code className="text-sm bg-muted px-1.5 py-0.5 rounded">{row.original.name}</code>
            ),
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({ row }) => (
                <span className="text-muted-foreground text-sm">
                    {row.original.description || "-"}
                </span>
            ),
        },
        {
            accessorKey: "userCount",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="-ml-4"
                    >
                        <Users className="mr-2 h-4 w-4" />
                        Users
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <Badge variant="outline">{row.original.userCount || 0}</Badge>
            ),
        },
        {
            accessorKey: "permissions",
            header: "Permissions",
            cell: ({ row }) => (
                <Badge variant="secondary">
                    {row.original.permissions?.length || 0} permissions
                </Badge>
            ),
        },
        {
            id: "actions",
            header: () => <span className="text-right">Actions</span>,
            cell: ({ row }) => {
                const role = row.original;
                return (
                    <div className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => onEdit(role)}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setDeleteRole(role)}
                                    className="text-destructive focus:text-destructive"
                                    disabled={role.isSystem}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
            enableHiding: false,
        },
    ];

    return (
        <>
            <DataTable
                columns={columns}
                data={roles}
                isLoading={isLoading}
                searchPlaceholder="Search roles..."
                onRowSelectionChange={onSelectionChange}
            />

            <ActionDialog
                open={!!deleteRole}
                onOpenChange={(open) => !open && setDeleteRole(null)}
                type="warning"
                title="Delete Role?"
                description={
                    deleteRole ? (
                        deleteRole.isSystem ? (
                            <>System roles cannot be deleted.</>
                        ) : (
                            <>
                                This action cannot be undone. This will permanently delete the role{' '}
                                <span className="font-medium">{deleteRole.displayName}</span>.
                                {(deleteRole.userCount ?? 0) > 0 && (
                                    <span className="block mt-2 text-destructive">
                                        Warning: This role has {deleteRole.userCount} users assigned.
                                    </span>
                                )}
                            </>
                        )
                    ) : undefined
                }
                onConfirm={() => {
                    if (deleteRole && !deleteRole.isSystem) {
                        onDelete(deleteRole.id);
                        setDeleteRole(null);
                    }
                }}
                confirmLabel="Delete"
                icon={<AlertTriangle className="h-6 w-6 text-destructive" />}
                iconPosition="left"
            />
        </>
    );
}
