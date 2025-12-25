"use client";

import { useState } from "react";
import { TaskCatalog } from "@/types/task-catalog";
import { useTaskCatalogs } from "@/hooks/use-task-catalogs";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, MoreHorizontal, ClipboardList, CheckSquare, LayoutList } from "lucide-react";
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
import { TaskCatalogDialog } from "./components/task-catalog-dialog";
import { ActionDialog } from "@/components/action-dialog";
import { toast } from "sonner";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function TaskCatalogsPage() {
    const { taskCatalogs, isLoading, createTaskCatalog, updateTaskCatalog, deleteTaskCatalog, refreshTaskCatalogs } = useTaskCatalogs();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<TaskCatalog | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const handleCreate = async (data: any) => {
        try {
            await createTaskCatalog(data);
            toast.success("Task Catalog created successfully");
            setIsDialogOpen(false);
            refreshTaskCatalogs();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleUpdate = async (data: any) => {
        if (!selectedTask) return;
        try {
            await updateTaskCatalog(selectedTask.id, data);
            toast.success("Task Catalog updated successfully");
            setIsDialogOpen(false);
            setSelectedTask(null);
            refreshTaskCatalogs();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await deleteTaskCatalog(deleteId);
            toast.success("Task Catalog deleted successfully");
            setDeleteId(null);
            refreshTaskCatalogs();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const columns: ColumnDef<TaskCatalog>[] = [
        {
            accessorKey: "workDivision.name",
            header: "Division",
            cell: ({ row }) => row.original.workDivision?.name || "N/A"
        },
        { accessorKey: "code", header: "Code" },
        { accessorKey: "name", header: "Name" },
        { accessorKey: "description", header: "Description" },
        {
            id: "actions",
            cell: ({ row }) => {
                const task = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => {
                                    setSelectedTask(task);
                                    setIsDialogOpen(true);
                                }}
                            >
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => setDeleteId(task.id)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

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
                            <BreadcrumbPage>Task Catalogs</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                            <ClipboardList className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{taskCatalogs.length}</div>
                            <p className="text-xs text-muted-foreground">Defined tasks in catalog</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Divisions Covered</CardTitle>
                            <LayoutList className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {new Set(taskCatalogs.map(t => t.workDivisionId)).size}
                            </div>
                            <p className="text-xs text-muted-foreground">Unique divisions</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Recent Updates</CardTitle>
                            <CheckSquare className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {taskCatalogs.filter(t => new Date(t.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                            </div>
                            <p className="text-xs text-muted-foreground">in last 7 days</p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <div className="space-y-1">
                            <CardTitle>Task Catalogs</CardTitle>
                            <CardDescription>
                                Manage standard tasks within work divisions.
                            </CardDescription>
                        </div>
                        <Button onClick={() => { setSelectedTask(null); setIsDialogOpen(true); }}>
                            <Plus className="mr-2 h-4 w-4" /> Add Task
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <DataTable columns={columns} data={taskCatalogs} isLoading={isLoading} />
                    </CardContent>
                </Card>

                <TaskCatalogDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    taskCatalog={selectedTask}
                    onSubmit={selectedTask ? handleUpdate : handleCreate}
                />

                <ActionDialog
                    open={!!deleteId}
                    onOpenChange={(open) => !open && setDeleteId(null)}
                    title="Delete Task Catalog"
                    description="Are you sure? This action cannot be undone."
                    onConfirm={handleDelete}
                    confirmLabel="Delete"
                    isLoading={false}
                    type="warning"
                    variant="destructive"
                />
            </div>
        </SidebarInset>
    );
}
