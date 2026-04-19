"use client";

import { useState } from "react";
import Link from "next/link";
import { Organization } from "@/types/organization";
import { DataTable, createSelectColumn } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ActionDialog } from "@/components/action-dialog";
import { ColumnDef } from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pencil, Trash2, ArrowUpDown, MoreHorizontal, AlertTriangle, ExternalLink, Users, FolderOpen, Crown } from "lucide-react";

interface MyOrgTableProps {
    organizations: Organization[];
    isLoading: boolean;
    currentUserId: string;
    onEdit: (org: Organization) => void;
    onDelete: (id: string) => void;
    onSelectionChange?: (selected: Organization[]) => void;
}

function RoleBadge({ org, currentUserId }: { org: Organization; currentUserId: string }) {
    const isOwner = org.ownerUserId === currentUserId;
    if (isOwner) {
        return (
            <Badge variant="default" className="gap-1 text-xs font-medium">
                <Crown className="size-3" />
                Owner
            </Badge>
        );
    }
    return (
        <Badge variant="secondary" className="text-xs font-medium">
            Member
        </Badge>
    );
}

export function MyOrgTable({ organizations, isLoading, currentUserId, onEdit, onDelete, onSelectionChange }: MyOrgTableProps) {
    const [deleteOrg, setDeleteOrg] = useState<Organization | null>(null);

    const columns: ColumnDef<Organization>[] = [
        createSelectColumn<Organization>(),
        {
            accessorKey: "name",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-4">
                    Name <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <Link
                    href={`/dashboard/my-organizations/${row.original.id}`}
                    className="font-medium hover:underline text-foreground"
                    onClick={(e) => e.stopPropagation()}
                >
                    {row.original.name}
                </Link>
            ),
        },
        {
            accessorKey: "code",
            header: "Code",
            cell: ({ row }) => (
                <span className="font-mono text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                    {row.original.code || "—"}
                </span>
            ),
        },
        {
            id: "role",
            header: "Your Role",
            cell: ({ row }) => <RoleBadge org={row.original} currentUserId={currentUserId} />,
        },
        {
            id: "members",
            header: () => <span className="flex items-center gap-1"><Users className="size-3.5" />Members</span>,
            cell: ({ row }) => (
                <span className="text-sm text-muted-foreground">
                    {row.original.memberCount ?? "—"}
                </span>
            ),
        },
        {
            id: "projects",
            header: () => <span className="flex items-center gap-1"><FolderOpen className="size-3.5" />Projects</span>,
            cell: ({ row }) => (
                <span className="text-sm text-muted-foreground">
                    {row.original.projectCount ?? "—"}
                </span>
            ),
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-4">
                    Created <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <span className="text-sm text-muted-foreground">
                    {new Date(row.original.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                </span>
            ),
        },
        {
            id: "actions",
            header: () => <span className="text-right sr-only">Actions</span>,
            cell: ({ row }) => {
                const org = row.original;
                const isOwner = org.ownerUserId === currentUserId;
                return (
                    <div className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href={`/dashboard/my-organizations/${org.id}`}>
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        View Details
                                    </Link>
                                </DropdownMenuItem>
                                {isOwner && (
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(org); }}>
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Edit
                                    </DropdownMenuItem>
                                )}
                                {isOwner && (
                                    <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={(e) => { e.stopPropagation(); setDeleteOrg(org); }}
                                            className="text-destructive focus:text-destructive"
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    </>
                                )}
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
                            This will permanently delete{" "}
                            <span className="font-semibold">{deleteOrg.name}</span>{" "}
                            and all its data. This action cannot be undone.
                        </>
                    ) : undefined
                }
                onConfirm={() => { if (deleteOrg) { onDelete(deleteOrg.id); setDeleteOrg(null); } }}
                confirmLabel="Delete Organization"
                icon={<AlertTriangle className="h-6 w-6 text-destructive" />}
                iconPosition="left"
            />
        </>
    );
}
