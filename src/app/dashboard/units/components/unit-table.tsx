'use client';

import { useState } from 'react';
import { Unit } from '@/types/unit';
import { DataTable, createSelectColumn } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, ArrowUpDown, MoreHorizontal, AlertTriangle } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ActionDialog } from '@/components/action-dialog';
import { ColumnDef } from '@tanstack/react-table';

interface UnitTableProps {
    units: Unit[];
    isLoading: boolean;
    onEdit: (unit: Unit) => void;
    onDelete: (id: string) => void;
    onSelectionChange?: (selectedUnits: Unit[]) => void;
}

export function UnitTable({ units, isLoading, onEdit, onDelete, onSelectionChange }: UnitTableProps) {
    // We need to manage state for the delete dialog here because it's triggered from a dropdown
    const [deleteUnit, setDeleteUnit] = useState<Unit | null>(null);

    const columns: ColumnDef<Unit>[] = [
        createSelectColumn<Unit>(),
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
            cell: ({ row }) => <span className="font-medium">{row.getValue("code")}</span>,
        },
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
            cell: ({ row }) => row.getValue("name"),
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
            cell: ({ row }) => {
                const date = new Date(row.getValue("createdAt"));
                return date.toLocaleDateString();
            },
        },
        {
            id: "actions",
            header: () => <span className="text-right">Actions</span>,
            cell: ({ row }) => {
                const unit = row.original;
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
                                <DropdownMenuItem onClick={() => onEdit(unit)}>
                                    <Edit2 className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setDeleteUnit(unit)}
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
                data={units}
                isLoading={isLoading}
                searchPlaceholder="Search units..."
                onRowSelectionChange={onSelectionChange}
            />

            <ActionDialog
                open={!!deleteUnit}
                onOpenChange={(open) => !open && setDeleteUnit(null)}
                type="warning"
                title="Delete Unit?"
                description={
                    deleteUnit ? (
                        <>
                            This action cannot be undone. This will permanently delete the unit{' '}
                            <span className="font-medium">{deleteUnit.name}</span>.
                        </>
                    ) : undefined
                }
                onConfirm={() => {
                    if (deleteUnit) {
                        onDelete(deleteUnit.id);
                        setDeleteUnit(null);
                    }
                }}
                confirmLabel="Delete"
                icon={<AlertTriangle className="h-6 w-6 text-destructive" />}
                iconPosition="left"
            />
        </>
    );
}
