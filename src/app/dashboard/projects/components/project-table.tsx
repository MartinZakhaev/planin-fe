"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Project } from "@/types/project";
import { DataTable, createSelectColumn } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ArrowUpDown, MoreHorizontal, AlertTriangle, Eye } from "lucide-react";
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
import Link from "next/link";

interface ProjectTableProps {
    projects: Project[];
    isLoading: boolean;
    onEdit: (project: Project) => void;
    onDelete: (id: string) => void;
    onSelectionChange?: (selectedProjects: Project[]) => void;
}

export function ProjectTable({ projects, isLoading, onEdit, onDelete, onSelectionChange }: ProjectTableProps) {
    const router = useRouter();
    const [deleteProject, setDeleteProject] = useState<Project | null>(null);

    const columns: ColumnDef<Project>[] = [
        createSelectColumn<Project>(),
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="-ml-4"
                    >
                        Project Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div>
                    <Link
                        href={`/dashboard/projects/${row.original.id}`}
                        className="font-medium hover:underline text-primary"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {row.original.name}
                    </Link>
                    {row.original.code && (
                        <div className="text-xs text-muted-foreground">{row.original.code}</div>
                    )}
                </div>
            ),
        },
        {
            accessorKey: "location",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="-ml-4"
                    >
                        Location
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => row.original.location || "-",
        },
        {
            accessorKey: "taxRatePercent",
            header: "Tax Rate",
            cell: ({ row }) => (
                <Badge variant="outline">{row.original.taxRatePercent}%</Badge>
            ),
        },
        {
            accessorKey: "currency",
            header: "Currency",
            cell: ({ row }) => (
                <Badge variant="secondary">{row.original.currency}</Badge>
            ),
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
                        Created
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
                const project = row.original;
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
                                    <Link href={`/dashboard/projects/${project.id}`}>
                                        <Eye className="mr-2 h-4 w-4" />
                                        View Details
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onEdit(project)}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setDeleteProject(project)}
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
                data={projects}
                isLoading={isLoading}
                searchPlaceholder="Search projects..."
                onRowSelectionChange={onSelectionChange}
                onRowClick={(project) => router.push(`/dashboard/projects/${project.id}`)}
            />

            <ActionDialog
                open={!!deleteProject}
                onOpenChange={(open) => !open && setDeleteProject(null)}
                type="warning"
                title="Delete Project?"
                description={
                    deleteProject ? (
                        <>
                            This action cannot be undone. This will permanently delete the project{' '}
                            <span className="font-medium">{deleteProject.name}</span> and all its data.
                        </>
                    ) : undefined
                }
                onConfirm={() => {
                    if (deleteProject) {
                        onDelete(deleteProject.id);
                        setDeleteProject(null);
                    }
                }}
                confirmLabel="Delete"
                icon={<AlertTriangle className="h-6 w-6 text-destructive" />}
                iconPosition="left"
            />
        </>
    );
}
