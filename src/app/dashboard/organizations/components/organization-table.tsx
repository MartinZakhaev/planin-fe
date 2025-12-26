"use client";

import { useState } from "react";
import { Organization } from "@/types/organization";
import { DataTable, createSelectColumn } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ArrowUpDown, MoreHorizontal, AlertTriangle } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ActionDialog } from "@/components/action-dialog";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

interface OrganizationTableProps {
    organizations: Organization[];
    isLoading: boolean;
    onEdit: (org: Organization) => void;
    onDelete: (id: string) => void;
    onSelectionChange?: (selectedOrgs: Organization[]) => void;
}

export function OrganizationTable({ organizations, isLoading, onEdit, onDelete, onSelectionChange }: OrganizationTableProps) {
    const [deleteOrg, setDeleteOrg] = useState<Organization | null>(null);

    const columns: ColumnDef<Organization>[] = [
        createSelectColumn<Organization>(),
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="-ml-4"
                    >
                        Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
        },
        {
            accessorKey: "code",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="-ml-4"
                    >
                        Code
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="-ml-4"
                    >
                        Created At
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString()
        },
        {
            id: "actions",
            header: () => <span className="text-right">Actions</span>,
            cell: ({ row }) => {
                const org = row.original;
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
                                <DropdownMenuItem asChild>
                                    <Link href={`/dashboard/organization-members?orgId=${org.id}`}>Manage Members</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onEdit(org)}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setDeleteOrg(org)}
                                    className="text-destructive focus:text-destructive"
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
                data={organizations}
                isLoading={isLoading}
                searchPlaceholder="Search organizations..."
                onRowSelectionChange={onSelectionChange}
            />

            <ActionDialog
                open={!!deleteOrg}
                onOpenChange={(open) => !open && setDeleteOrg(null)}
                type="warning"
                title="Delete Organization?"
                description={
                    deleteOrg ? (
                        <>
                            This action cannot be undone. This will permanently delete the organization{' '}
                            <span className="font-medium">{deleteOrg.name}</span> and all its data.
                        </>
                    ) : undefined
                }
                onConfirm={() => {
                    if (deleteOrg) {
                        onDelete(deleteOrg.id);
                        setDeleteOrg(null);
                    }
                }}
                confirmLabel="Delete"
                icon={<AlertTriangle className="h-6 w-6 text-destructive" />}
                iconPosition="left"
            />
        </>
    );
}
