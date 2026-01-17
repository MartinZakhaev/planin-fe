"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { TaskCatalog } from "@/types/task-catalog";
import { CreateProjectTaskDto } from "@/types/project-mutations";
import { apiFetch } from "@/lib/api-fetch";

interface AddTaskDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    projectId: string;
    projectDivisionId: string;
    divisionId: string; // Base division ID for filtering tasks
    divisionName: string;
    onSuccess: () => void;
}

export function AddTaskDialog({
    open,
    onOpenChange,
    projectId,
    projectDivisionId,
    divisionId,
    divisionName,
    onSuccess,
}: AddTaskDialogProps) {
    const [taskCatalogs, setTaskCatalogs] = useState<TaskCatalog[]>([]);
    const [isLoadingTasks, setIsLoadingTasks] = useState(false);
    const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<CreateProjectTaskDto>();

    const selectedTaskId = watch("taskCatalogId");

    useEffect(() => {
        if (open) {
            setIsLoadingTasks(true);
            apiFetch<TaskCatalog[]>("/task-catalogs")
                .then((data) => {
                    // Filter tasks by division
                    const filtered = data.filter(t => t.divisionId === divisionId);
                    setTaskCatalogs(filtered);
                })
                .catch(console.error)
                .finally(() => setIsLoadingTasks(false));

            reset({
                projectId,
                projectDivisionId,
                taskCatalogId: "",
                displayName: "",
                sortOrder: 1,
            });
        }
    }, [open, projectId, projectDivisionId, divisionId, reset]);

    // Auto-fill display name when task is selected
    useEffect(() => {
        if (selectedTaskId) {
            const task = taskCatalogs.find(t => t.id === selectedTaskId);
            if (task) {
                setValue("displayName", task.name);
            }
        }
    }, [selectedTaskId, taskCatalogs, setValue]);

    const onFormSubmit = async (data: CreateProjectTaskDto) => {
        try {
            // Clean up empty taskCatalogId
            const payload = {
                ...data,
                taskCatalogId: data.taskCatalogId || undefined,
            };
            await apiFetch("/project-tasks", {
                method: "POST",
                body: JSON.stringify(payload),
            });
            onOpenChange(false);
            onSuccess();
        } catch (error: any) {
            console.error("Failed to add task:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Task</DialogTitle>
                    <DialogDescription>
                        Add a task to "{divisionName}" division.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onFormSubmit)} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="taskCatalogId">Task Catalog (Optional)</Label>
                        {isLoadingTasks ? (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Loading tasks...
                            </div>
                        ) : taskCatalogs.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                No task catalogs available for this division. Enter a custom name below.
                            </p>
                        ) : (
                            <Select
                                value={selectedTaskId || ""}
                                onValueChange={(value) => setValue("taskCatalogId", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select from catalog (optional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    {taskCatalogs.map((task) => (
                                        <SelectItem key={task.id} value={task.id}>
                                            <span className="font-mono text-xs text-muted-foreground mr-2">
                                                {task.code}
                                            </span>
                                            {task.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="displayName">Task Name *</Label>
                        <Input
                            id="displayName"
                            {...register("displayName", { required: true })}
                            placeholder="e.g., Pemasangan Bekisting"
                        />
                        {errors.displayName && <span className="text-destructive text-xs">Required</span>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="sortOrder">Sort Order</Label>
                        <Input
                            id="sortOrder"
                            type="number"
                            {...register("sortOrder", { valueAsNumber: true })}
                            placeholder="1"
                        />
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Add Task
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
