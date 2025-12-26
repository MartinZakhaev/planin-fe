"use client";

import { useState } from "react";
import { WorkDivision } from "@/types/work-division";
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

interface WorkDivisionTableProps {
    workDivisions: WorkDivision[];
    isLoading: boolean;
    onEdit: (division: WorkDivision) => void;
    onDelete: (id: string) => void;
    onSelectionChange?: (selectedDivisions: WorkDivision[]) => void;
}

export function WorkDivisionTable({ workDivisions, isLoading, onEdit, onDelete, onSelectionChange }: WorkDivisionTableProps) {
    const [deleteDivision, setDeleteDivision] = useState<WorkDivision | null>(null);

    const columns: ColumnDef<WorkDivision>[] = [
        createSelectColumn<WorkDivision>(),
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
            accessorKey: "description",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="-ml-4"
                    >
                        Description
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
                const division = row.original;
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
                                <DropdownMenuItem onClick={() => onEdit(division)}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setDeleteDivision(division)}
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
                data={workDivisions}
                isLoading={isLoading}
                searchPlaceholder="Search divisions..."
                onRowSelectionChange={onSelectionChange}
            />

            <ActionDialog
                open={!!deleteDivision}
                onOpenChange={(open) => !open && setDeleteDivision(null)}
                type="warning"
                title="Delete Work Division?"
                description={
                    deleteDivision ? (
                        <>
                            This action cannot be undone. This will permanently delete the division{' '}
                            <span className="font-medium">{deleteDivision.name}</span>.
                        </>
                    ) : undefined
                }
                onConfirm={() => {
                    if (deleteDivision) {
                        onDelete(deleteDivision.id);
                        setDeleteDivision(null);
                    }
                }}
                confirmLabel="Delete"
                icon={<AlertTriangle className="h-6 w-6 text-destructive" />}
                iconPosition="left"
            />
        </>
    );
}
