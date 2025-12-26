"use client";

import { useState } from "react";
import { TaskCatalog } from "@/types/task-catalog";
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

interface TaskCatalogTableProps {
    taskCatalogs: TaskCatalog[];
    workDivisions: { id: string; name: string }[];
    isLoading: boolean;
    onEdit: (task: TaskCatalog) => void;
    onDelete: (id: string) => void;
    onSelectionChange?: (selectedTasks: TaskCatalog[]) => void;
}

export function TaskCatalogTable({ taskCatalogs, workDivisions, isLoading, onEdit, onDelete, onSelectionChange }: TaskCatalogTableProps) {
    const [deleteTask, setDeleteTask] = useState<TaskCatalog | null>(null);

    const columns: ColumnDef<TaskCatalog>[] = [
        createSelectColumn<TaskCatalog>(),
        {
            accessorKey: "divisionId",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="-ml-4"
                    >
                        Division
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const divId = row.original.divisionId;
                const division = workDivisions.find(d => d.id === divId);
                return division ? division.name : "N/A";
            }
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
            id: "actions",
            header: () => <span className="text-right">Actions</span>,
            cell: ({ row }) => {
                const task = row.original;
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
                                <DropdownMenuItem onClick={() => onEdit(task)}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setDeleteTask(task)}
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
                data={taskCatalogs}
                isLoading={isLoading}
                searchPlaceholder="Search task catalogs..."
                onRowSelectionChange={onSelectionChange}
            />

            <ActionDialog
                open={!!deleteTask}
                onOpenChange={(open) => !open && setDeleteTask(null)}
                type="warning"
                title="Delete Task Catalog?"
                description={
                    deleteTask ? (
                        <>
                            This action cannot be undone. This will permanently delete the task{' '}
                            <span className="font-medium">{deleteTask.name}</span>.
                        </>
                    ) : undefined
                }
                onConfirm={() => {
                    if (deleteTask) {
                        onDelete(deleteTask.id);
                        setDeleteTask(null);
                    }
                }}
                confirmLabel="Delete"
                icon={<AlertTriangle className="h-6 w-6 text-destructive" />}
                iconPosition="left"
            />
        </>
    );
}
