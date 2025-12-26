"use client";

import { useState } from "react";
import { TaskCatalog } from "@/types/task-catalog";
import { useTaskCatalogs } from "@/hooks/use-task-catalogs";
import { Plus, Pencil, Trash2, MoreHorizontal, ClipboardList, CheckSquare, LayoutList, AlertTriangle, ArrowUpDown } from "lucide-react";
import { DataTable, createSelectColumn } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
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
import { TaskCatalogTable } from "./components/task-catalog-table";
import { TaskCatalogDialog } from "./components/task-catalog-dialog";
import { toast } from "sonner";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { useWorkDivisions } from "@/hooks/use-work-divisions";

export default function TaskCatalogsPage() {
    const { taskCatalogs, isLoading, createTaskCatalog, updateTaskCatalog, deleteTaskCatalog, refreshTaskCatalogs } = useTaskCatalogs();
    const { workDivisions } = useWorkDivisions();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<TaskCatalog | null>(null);
    const [selectedTasks, setSelectedTasks] = useState<TaskCatalog[]>([]);

    const [showBulkDelete, setShowBulkDelete] = useState(false);
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);

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



    const handleBulkDelete = async () => {
        setIsBulkDeleting(true);
        try {
            for (const task of selectedTasks) {
                await deleteTaskCatalog(task.id);
            }
            toast.success(`${selectedTasks.length} tasks deleted successfully`);
            setSelectedTasks([]);
            setShowBulkDelete(false);
            refreshTaskCatalogs();
        } catch (error: any) {
            toast.error("Failed to delete some task catalogs");
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
                                {new Set(taskCatalogs.map(t => t.divisionId)).size}
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

                        <div className="flex items-center gap-2">
                            {selectedTasks.length > 0 && (
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => setShowBulkDelete(true)}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete ({selectedTasks.length})
                                </Button>
                            )}
                            <Button onClick={() => { setSelectedTask(null); setIsDialogOpen(true); }}>
                                <Plus className="mr-2 h-4 w-4" /> Add Task
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <TaskCatalogTable
                            taskCatalogs={taskCatalogs}
                            workDivisions={workDivisions || []}
                            isLoading={isLoading}
                            onEdit={(task) => {
                                setSelectedTask(task);
                                setIsDialogOpen(true);
                            }}
                            onDelete={(id) => {
                                deleteTaskCatalog(id).then(() => {
                                    toast.success("Task Catalog deleted successfully");
                                    refreshTaskCatalogs();
                                }).catch((err) => toast.error(err.message));
                            }}
                            onSelectionChange={setSelectedTasks}
                        />
                    </CardContent>
                </Card>

                <TaskCatalogDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    taskCatalog={selectedTask}
                    onSubmit={selectedTask ? handleUpdate : handleCreate}
                />



                <ActionDialog
                    open={showBulkDelete}
                    onOpenChange={setShowBulkDelete}
                    title="Delete Selected Tasks"
                    description={`Are you sure you want to delete ${selectedTasks.length} task catalogs? This action cannot be undone.`}
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
