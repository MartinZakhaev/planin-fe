"use client";

import { useState, useMemo } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    Plus,
    MoreHorizontal,
    Trash2,
    Package,
    Users,
    Wrench,
    ChevronDown,
    ChevronRight,
    List,
    LayoutGrid,
    ChevronsUpDown,
} from "lucide-react";
import { ProjectDetails, ProjectDivision, ProjectTask } from "@/types/project-details";
import { EmptyState } from "./empty-state";
import { AddDivisionDialog } from "./add-division-dialog";
import { AddTaskDialog } from "./add-task-dialog";
import { AddLineItemDialog } from "./add-line-item-dialog";
import { apiFetch } from "@/lib/api-fetch";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DetailsTabProps {
    project: ProjectDetails;
    formatCurrency: (value: number, currency?: string) => string;
    onRefresh: () => void;
}

type ViewMode = "compact" | "detailed";

const getItemTypeIcon = (type: string) => {
    switch (type) {
        case "MATERIAL":
            return <Package className="h-4 w-4" />;
        case "MANPOWER":
            return <Users className="h-4 w-4" />;
        case "TOOL":
            return <Wrench className="h-4 w-4" />;
        default:
            return <Package className="h-4 w-4" />;
    }
};

const getItemTypeBadgeColor = (type: string) => {
    switch (type) {
        case "MATERIAL":
            return "bg-blue-100 text-blue-800";
        case "MANPOWER":
            return "bg-green-100 text-green-800";
        case "TOOL":
            return "bg-orange-100 text-orange-800";
        default:
            return "";
    }
};

export function DetailsTab({ project, formatCurrency, onRefresh }: DetailsTabProps) {
    const [isDivisionDialogOpen, setIsDivisionDialogOpen] = useState(false);
    const [taskDialogState, setTaskDialogState] = useState<{
        open: boolean;
        projectDivisionId: string;
        divisionId: string;
        divisionName: string;
    }>({ open: false, projectDivisionId: "", divisionId: "", divisionName: "" });
    const [lineItemDialogState, setLineItemDialogState] = useState<{
        open: boolean;
        projectTaskId: string;
        taskName: string;
    }>({ open: false, projectTaskId: "", taskName: "" });

    // View mode state
    const [viewMode, setViewMode] = useState<ViewMode>("compact");

    // Track expanded tasks
    const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

    // Get all task IDs for expand/collapse all
    const allTaskIds = useMemo(() => {
        const ids: string[] = [];
        project.divisions.forEach(div => {
            div.tasks.forEach(task => ids.push(task.id));
        });
        return ids;
    }, [project.divisions]);

    const toggleTask = (taskId: string) => {
        setExpandedTasks(prev => {
            const newSet = new Set(prev);
            if (newSet.has(taskId)) {
                newSet.delete(taskId);
            } else {
                newSet.add(taskId);
            }
            return newSet;
        });
    };

    const expandAllTasks = () => {
        setExpandedTasks(new Set(allTaskIds));
    };

    const collapseAllTasks = () => {
        setExpandedTasks(new Set());
    };

    const areAllExpanded = expandedTasks.size === allTaskIds.length && allTaskIds.length > 0;

    const calculateDivisionTotal = (division: ProjectDivision) => {
        return division.tasks.reduce((taskTotal, task) => {
            return taskTotal + task.lineItems.reduce((itemTotal, item) => itemTotal + Number(item.lineTotal), 0);
        }, 0);
    };

    const calculateTaskTotal = (task: ProjectTask) => {
        return task.lineItems.reduce((t, i) => t + Number(i.lineTotal), 0);
    };

    const handleDeleteDivision = async (divisionId: string) => {
        if (!confirm("Are you sure you want to delete this division? All tasks and items within will also be deleted.")) return;
        try {
            await apiFetch(`/project-divisions/${divisionId}`, { method: "DELETE" });
            toast.success("Division deleted successfully");
            onRefresh();
        } catch (error: any) {
            toast.error("Failed to delete division");
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        if (!confirm("Are you sure you want to delete this task? All items within will also be deleted.")) return;
        try {
            await apiFetch(`/project-tasks/${taskId}`, { method: "DELETE" });
            toast.success("Task deleted successfully");
            onRefresh();
        } catch (error: any) {
            toast.error("Failed to delete task");
        }
    };

    const handleDeleteLineItem = async (itemId: string) => {
        if (!confirm("Are you sure you want to delete this item?")) return;
        try {
            await apiFetch(`/task-line-items/${itemId}`, { method: "DELETE" });
            toast.success("Item deleted successfully");
            onRefresh();
        } catch (error: any) {
            toast.error("Failed to delete item");
        }
    };

    const existingDivisionIds = project.divisions.map(d => d.divisionId);

    // Render task in compact mode (collapsible row)
    const renderCompactTask = (task: ProjectTask, divisionId: string) => {
        const isExpanded = expandedTasks.has(task.id);
        const taskTotal = calculateTaskTotal(task);

        return (
            <Collapsible
                key={task.id}
                open={isExpanded}
                onOpenChange={() => toggleTask(task.id)}
            >
                <div className="border rounded-lg overflow-hidden">
                    <CollapsibleTrigger asChild>
                        <div className="flex items-center justify-between p-3 hover:bg-muted/50 cursor-pointer transition-colors">
                            <div className="flex items-center gap-3">
                                {isExpanded ? (
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                )}
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">{task.displayName}</span>
                                    {task.taskCatalog && (
                                        <Badge variant="outline" className="text-xs">
                                            {task.taskCatalog.code}
                                        </Badge>
                                    )}
                                    <Badge variant="secondary" className="text-xs">
                                        {task.lineItems.length} items
                                    </Badge>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">
                                    {formatCurrency(taskTotal, project.currency)}
                                </span>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setLineItemDialogState({
                                                    open: true,
                                                    projectTaskId: task.id,
                                                    taskName: task.displayName,
                                                });
                                            }}
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Item
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="text-destructive"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteTask(task.id);
                                            }}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete Task
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <div className="border-t px-4 py-3 bg-muted/20">
                            {task.lineItems.length === 0 ? (
                                <EmptyState
                                    variant="items"
                                    title="No items added"
                                    description="Add materials, manpower, or tools to this task."
                                    actionLabel="Add Item"
                                    onAction={() => setLineItemDialogState({
                                        open: true,
                                        projectTaskId: task.id,
                                        taskName: task.displayName,
                                    })}
                                    className="py-4"
                                />
                            ) : (
                                <>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Item</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead className="text-right">Qty</TableHead>
                                                <TableHead className="text-right">Unit Price</TableHead>
                                                <TableHead className="text-right">Total</TableHead>
                                                <TableHead className="w-10"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {task.lineItems.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell>
                                                        <div>
                                                            <div className="font-medium">
                                                                {item.itemCatalog?.name || item.description}
                                                            </div>
                                                            {item.description && item.itemCatalog && (
                                                                <div className="text-xs text-muted-foreground">
                                                                    {item.description}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.itemCatalog && (
                                                            <Badge className={getItemTypeBadgeColor(item.itemCatalog.type)}>
                                                                {getItemTypeIcon(item.itemCatalog.type)}
                                                                <span className="ml-1">{item.itemCatalog.type}</span>
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {item.quantity} {item.unit?.code}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {formatCurrency(Number(item.unitPrice), project.currency)}
                                                    </TableCell>
                                                    <TableCell className="text-right font-medium">
                                                        {formatCurrency(Number(item.lineTotal), project.currency)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem
                                                                    className="text-destructive"
                                                                    onClick={() => handleDeleteLineItem(item.id)}
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Delete Item
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    <div className="mt-3">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setLineItemDialogState({
                                                open: true,
                                                projectTaskId: task.id,
                                                taskName: task.displayName,
                                            })}
                                        >
                                            <Plus className="mr-2 h-3 w-3" />
                                            Add Item
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    </CollapsibleContent>
                </div>
            </Collapsible>
        );
    };

    // Render task in detailed mode (always expanded)
    const renderDetailedTask = (task: ProjectTask) => {
        const taskTotal = calculateTaskTotal(task);

        return (
            <div key={task.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <h4 className="font-medium">{task.displayName}</h4>
                        {task.taskCatalog && (
                            <Badge variant="outline" className="text-xs">
                                {task.taskCatalog.code}
                            </Badge>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                            {formatCurrency(taskTotal, project.currency)}
                        </span>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => handleDeleteTask(task.id)}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Task
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Line Items */}
                {task.lineItems.length === 0 ? (
                    <EmptyState
                        variant="items"
                        title="No items added"
                        description="Add materials, manpower, or tools to this task."
                        actionLabel="Add Item"
                        onAction={() => setLineItemDialogState({
                            open: true,
                            projectTaskId: task.id,
                            taskName: task.displayName,
                        })}
                        className="py-4"
                    />
                ) : (
                    <>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead className="text-right">Qty</TableHead>
                                    <TableHead className="text-right">Unit Price</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                    <TableHead className="w-10"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {task.lineItems.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">
                                                    {item.itemCatalog?.name || item.description}
                                                </div>
                                                {item.description && item.itemCatalog && (
                                                    <div className="text-xs text-muted-foreground">
                                                        {item.description}
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {item.itemCatalog && (
                                                <Badge className={getItemTypeBadgeColor(item.itemCatalog.type)}>
                                                    {getItemTypeIcon(item.itemCatalog.type)}
                                                    <span className="ml-1">{item.itemCatalog.type}</span>
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {item.quantity} {item.unit?.code}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {formatCurrency(Number(item.unitPrice), project.currency)}
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            {formatCurrency(Number(item.lineTotal), project.currency)}
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        className="text-destructive"
                                                        onClick={() => handleDeleteLineItem(item.id)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete Item
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="mt-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setLineItemDialogState({
                                    open: true,
                                    projectTaskId: task.id,
                                    taskName: task.displayName,
                                })}
                            >
                                <Plus className="mr-2 h-3 w-3" />
                                Add Item
                            </Button>
                        </div>
                    </>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Divisions & Tasks Card */}
            <Card>
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                    <div>
                        <CardTitle>Work Divisions & Tasks</CardTitle>
                        <CardDescription>
                            {project.divisions.length} divisions, {project.divisions.reduce((t, d) => t + d.tasks.length, 0)} tasks
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* View Mode Toggle */}
                        <div className="flex items-center border rounded-lg">
                            <Button
                                variant={viewMode === "compact" ? "secondary" : "ghost"}
                                onClick={() => setViewMode("compact")}
                                className="rounded-r-none"
                            >
                                <List className="h-4 w-4 mr-1" />
                                Compact
                            </Button>
                            <Button
                                variant={viewMode === "detailed" ? "secondary" : "ghost"}
                                onClick={() => setViewMode("detailed")}
                                className="rounded-l-none"
                            >
                                <LayoutGrid className="h-4 w-4 mr-1" />
                                Detailed
                            </Button>
                        </div>
                        <Button onClick={() => setIsDivisionDialogOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Division
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {project.divisions.length === 0 ? (
                        <EmptyState
                            variant="divisions"
                            title="No work divisions added yet"
                            description="Work divisions organize your project into sections. Add your first division to start building your RAB."
                            actionLabel="Add Division"
                            onAction={() => setIsDivisionDialogOpen(true)}
                        />
                    ) : (
                        <>
                            {/* Expand/Collapse All (only in compact mode) */}
                            {viewMode === "compact" && allTaskIds.length > 0 && (
                                <div className="flex justify-end mb-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={areAllExpanded ? collapseAllTasks : expandAllTasks}
                                    >
                                        <ChevronsUpDown className="h-4 w-4 mr-2" />
                                        {areAllExpanded ? "Collapse All" : "Expand All"}
                                    </Button>
                                </div>
                            )}

                            <Accordion type="multiple" className="w-full">
                                {project.divisions.map((division) => (
                                    <AccordionItem key={division.id} value={division.id}>
                                        <AccordionTrigger className="hover:no-underline">
                                            <div className="flex items-center justify-between w-full pr-4">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline">{division.division.code}</Badge>
                                                    <span>{division.displayName}</span>
                                                    <Badge variant="secondary" className="text-xs">
                                                        {division.tasks.length} tasks
                                                    </Badge>
                                                </div>
                                                <span className="text-sm font-medium">
                                                    {formatCurrency(calculateDivisionTotal(division), project.currency)}
                                                </span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="pl-4 space-y-4">
                                                {/* Division Actions */}
                                                <div className="flex items-center justify-between">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setTaskDialogState({
                                                            open: true,
                                                            projectDivisionId: division.id,
                                                            divisionId: division.divisionId,
                                                            divisionName: division.displayName,
                                                        })}
                                                    >
                                                        <Plus className="mr-2 h-3 w-3" />
                                                        Add Task
                                                    </Button>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem
                                                                className="text-destructive"
                                                                onClick={() => handleDeleteDivision(division.id)}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete Division
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>

                                                {/* Tasks */}
                                                {division.tasks.length === 0 ? (
                                                    <EmptyState
                                                        variant="tasks"
                                                        title="No tasks in this division"
                                                        description="Add tasks to define the work items for this division."
                                                        actionLabel="Add Task"
                                                        onAction={() => setTaskDialogState({
                                                            open: true,
                                                            projectDivisionId: division.id,
                                                            divisionId: division.divisionId,
                                                            divisionName: division.displayName,
                                                        })}
                                                        className="py-6"
                                                    />
                                                ) : (
                                                    <div className="space-y-3">
                                                        {division.tasks.map((task) =>
                                                            viewMode === "compact"
                                                                ? renderCompactTask(task, division.id)
                                                                : renderDetailedTask(task)
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Dialogs */}
            <AddDivisionDialog
                open={isDivisionDialogOpen}
                onOpenChange={setIsDivisionDialogOpen}
                projectId={project.id}
                existingDivisionIds={existingDivisionIds}
                onSuccess={() => {
                    toast.success("Division added successfully");
                    onRefresh();
                }}
            />

            <AddTaskDialog
                open={taskDialogState.open}
                onOpenChange={(open) => setTaskDialogState(prev => ({ ...prev, open }))}
                projectId={project.id}
                projectDivisionId={taskDialogState.projectDivisionId}
                divisionId={taskDialogState.divisionId}
                divisionName={taskDialogState.divisionName}
                onSuccess={() => {
                    toast.success("Task added successfully");
                    onRefresh();
                }}
            />

            <AddLineItemDialog
                open={lineItemDialogState.open}
                onOpenChange={(open) => setLineItemDialogState(prev => ({ ...prev, open }))}
                projectId={project.id}
                projectTaskId={lineItemDialogState.projectTaskId}
                taskName={lineItemDialogState.taskName}
                currency={project.currency}
                onSuccess={() => {
                    toast.success("Item added successfully");
                    onRefresh();
                }}
            />
        </div>
    );
}
