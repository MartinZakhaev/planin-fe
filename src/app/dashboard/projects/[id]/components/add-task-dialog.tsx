"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Hash, Loader2, PenLine } from "lucide-react";
import { CreatePersonalTaskCatalogDto, TaskCatalog } from "@/types/task-catalog";
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
    const [mode, setMode] = useState<"catalog" | "custom">("catalog");
    const { control, register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<CreateProjectTaskDto>();

    const selectedTaskId = useWatch({ control, name: "taskCatalogId" });
    const displayName = useWatch({ control, name: "displayName" });
    const selectedTask = taskCatalogs.find((task) => task.id === selectedTaskId);

    useEffect(() => {
        if (open) {
            // Loading state mirrors the dialog's fetch lifecycle.
            // eslint-disable-next-line react-hooks/set-state-in-effect
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
                personalCatalogPrefix: "TASK",
                sortOrder: 1,
            });
            setMode("catalog");
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
            let taskCatalogId = mode === "catalog" ? data.taskCatalogId : undefined;
            let displayName = data.displayName;

            if (!taskCatalogId) {
                const personalCatalog = await apiFetch<TaskCatalog>("/task-catalogs/personal", {
                    method: "POST",
                    body: JSON.stringify({
                        divisionId,
                        name: data.displayName,
                        prefix: data.personalCatalogPrefix || "TASK",
                    } satisfies CreatePersonalTaskCatalogDto),
                });
                taskCatalogId = personalCatalog.id;
                displayName = personalCatalog.name;
            }

            const payload = {
                projectId: data.projectId,
                projectDivisionId: data.projectDivisionId,
                taskCatalogId,
                displayName,
                sortOrder: data.sortOrder,
            };
            await apiFetch("/project-tasks", {
                method: "POST",
                body: JSON.stringify(payload),
            });
            onOpenChange(false);
            onSuccess();
        } catch (error: unknown) {
            console.error("Failed to add task:", error);
        }
    };

    const handleModeChange = (value: string) => {
        const nextMode = value as "catalog" | "custom";
        setMode(nextMode);
        if (nextMode === "catalog") {
            setValue("displayName", selectedTask?.name || "");
        } else {
            setValue("taskCatalogId", "");
            setValue("displayName", "");
            setValue("personalCatalogPrefix", "TASK");
        }
    };

    const canSubmit = mode === "catalog" ? Boolean(selectedTaskId) : Boolean(displayName?.trim());

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[560px]">
                <DialogHeader className="space-y-2">
                    <DialogTitle>Add Task</DialogTitle>
                    <DialogDescription>
                        Add a task to &quot;{divisionName}&quot; division.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onFormSubmit)} className="grid gap-5 py-4">
                    <Tabs value={mode} onValueChange={handleModeChange} className="gap-4">
                        <TabsList className="grid h-11 w-full grid-cols-2 rounded-md">
                            <TabsTrigger value="catalog" className="gap-2">
                                <BookOpen className="h-4 w-4" />
                                Pilih Task
                            </TabsTrigger>
                            <TabsTrigger value="custom" className="gap-2">
                                <PenLine className="h-4 w-4" />
                                Buat Sendiri
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="catalog" className="mt-0 space-y-4 rounded-md border p-4">
                            <div className="space-y-1">
                                <h3 className="text-sm font-medium">Gunakan task yang sudah tersedia</h3>
                                <p className="text-xs text-muted-foreground">
                                    Pilih dari task global atau task personal yang sudah pernah kamu buat.
                                </p>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="taskCatalogId">Task Catalog *</Label>
                                {isLoadingTasks ? (
                                    <div className="flex h-10 items-center gap-2 rounded-md border px-3 text-sm text-muted-foreground">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Loading tasks...
                                    </div>
                                ) : taskCatalogs.length === 0 ? (
                                    <div className="rounded-md border border-dashed bg-muted/30 p-4 text-sm text-muted-foreground">
                                        Belum ada task catalog untuk divisi ini. Gunakan tab <span className="font-medium text-foreground">Buat Sendiri</span>.
                                    </div>
                                ) : (
                                    <Select
                                        value={selectedTaskId || ""}
                                        onValueChange={(value) => setValue("taskCatalogId", value)}
                                    >
                                        <SelectTrigger className="h-11">
                                            <SelectValue placeholder="Pilih task dari catalog" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {taskCatalogs.map((task) => (
                                                <SelectItem key={task.id} value={task.id}>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono text-xs text-muted-foreground">
                                                            {task.code}
                                                        </span>
                                                        <span>{task.name}</span>
                                                        <Badge variant="outline" className="ml-1 text-[10px]">
                                                            {task.ownerUserId ? "Personal" : "Global"}
                                                        </Badge>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>

                            {selectedTask && (
                                <div className="rounded-md bg-muted/50 p-3">
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-medium">{selectedTask.name}</p>
                                            <p className="font-mono text-xs text-muted-foreground">{selectedTask.code}</p>
                                        </div>
                                        <Badge variant="secondary">{selectedTask.ownerUserId ? "Personal" : "Global"}</Badge>
                                    </div>
                                </div>
                            )}

                            <div className="grid gap-2">
                                <Label htmlFor="catalogDisplayName">Display Name</Label>
                                <Input
                                    id="catalogDisplayName"
                                    {...register("displayName", { required: true })}
                                    placeholder="Nama task di project"
                                />
                                <span className="text-xs text-muted-foreground">
                                    Bisa disesuaikan khusus untuk project ini tanpa mengubah catalog.
                                </span>
                                {errors.displayName && <span className="text-destructive text-xs">Required</span>}
                            </div>
                        </TabsContent>

                        <TabsContent value="custom" className="mt-0 space-y-4 rounded-md border p-4">
                            <div className="space-y-1">
                                <h3 className="text-sm font-medium">Buat task personal</h3>
                                <p className="text-xs text-muted-foreground">
                                    Task ini akan tersimpan di catalog pribadi kamu dan bisa dipakai lagi nanti.
                                </p>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="customTaskName">Task Name *</Label>
                                <Input
                                    id="customTaskName"
                                    {...register("displayName", { required: true })}
                                    placeholder="e.g., Pemasangan Bekisting"
                                />
                                {errors.displayName && <span className="text-destructive text-xs">Required</span>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="personalCatalogPrefix">Task Code Prefix</Label>
                                <div className="relative">
                                    <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="personalCatalogPrefix"
                                        className="pl-9"
                                        {...register("personalCatalogPrefix")}
                                        placeholder="TASK"
                                    />
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    Kode dibuat otomatis, misalnya TASK-001, TASK-002.
                                </span>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <div className="rounded-md border bg-muted/20 p-4">
                        <div className="grid gap-2">
                            <Label htmlFor="sortOrder">Sort Order</Label>
                            <Input
                                id="sortOrder"
                                type="number"
                                {...register("sortOrder", { valueAsNumber: true })}
                                placeholder="1"
                            />
                            <span className="text-xs text-muted-foreground">
                                Angka kecil tampil lebih atas dalam divisi.
                            </span>
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting || !canSubmit}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {mode === "catalog" ? "Add Selected Task" : "Create & Add Task"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
