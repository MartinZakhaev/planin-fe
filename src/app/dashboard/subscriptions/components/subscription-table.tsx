"use client";

import { useState } from "react";
import { Subscription } from "@/types/subscription";
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
import { Badge } from "@/components/ui/badge";

interface SubscriptionTableProps {
    subscriptions: Subscription[];
    isLoading: boolean;
    onEdit: (subscription: Subscription) => void;
    onDelete: (id: string) => void;
    onSelectionChange?: (selectedSubscriptions: Subscription[]) => void;
}

export function SubscriptionTable({ subscriptions, isLoading, onEdit, onDelete, onSelectionChange }: SubscriptionTableProps) {
    const [deleteSub, setDeleteSub] = useState<Subscription | null>(null);

    const columns: ColumnDef<Subscription>[] = [
        createSelectColumn<Subscription>(),
        {
            accessorKey: "userId",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="-ml-4"
                    >
                        User ID
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => <span className="font-mono text-xs">{row.original.userId}</span>
        },
        {
            accessorKey: "planId",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="-ml-4"
                    >
                        Plan ID
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => <span className="font-mono text-xs">{row.original.planId}</span>
        },
        {
            accessorKey: "status",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="-ml-4"
                    >
                        Status
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const status = row.original.status;
                return (
                    <Badge variant={status === 'ACTIVE' ? 'default' : 'destructive'}>
                        {status}
                    </Badge>
                )
            }
        },
        {
            accessorKey: "currentPeriodStart",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="-ml-4"
                    >
                        Period Start
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => row.original.currentPeriodStart ? new Date(row.original.currentPeriodStart).toLocaleDateString() : "-"
        },
        {
            accessorKey: "currentPeriodEnd",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="-ml-4"
                    >
                        Period End
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => row.original.currentPeriodEnd ? new Date(row.original.currentPeriodEnd).toLocaleDateString() : "-"
        },
        {
            id: "actions",
            header: () => <span className="text-right">Actions</span>,
            cell: ({ row }) => {
                const subscription = row.original;
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
                                <DropdownMenuItem onClick={() => onEdit(subscription)}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setDeleteSub(subscription)}
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
                data={subscriptions}
                isLoading={isLoading}
                searchPlaceholder="Search subscriptions..."
                onRowSelectionChange={onSelectionChange}
            />

            <ActionDialog
                open={!!deleteSub}
                onOpenChange={(open) => !open && setDeleteSub(null)}
                type="warning"
                title="Cancel Subscription?"
                description={
                    deleteSub ? (
                        <>
                            This action cannot be undone. This will permanently cancel the subscription for user{' '}
                            <span className="font-medium">{deleteSub.userId}</span>.
                        </>
                    ) : undefined
                }
                onConfirm={() => {
                    if (deleteSub) {
                        onDelete(deleteSub.id);
                        setDeleteSub(null);
                    }
                }}
                confirmLabel="Cancel Subscription"
                icon={<AlertTriangle className="h-6 w-6 text-destructive" />}
                iconPosition="left"
            />
        </>
    );
}
