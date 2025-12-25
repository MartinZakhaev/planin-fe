"use client";

import { useForm } from "react-hook-form";
import { TaskCatalog, CreateTaskCatalogDto, UpdateTaskCatalogDto } from "@/types/task-catalog";
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
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useWorkDivisions } from "@/hooks/use-work-divisions";

interface TaskCatalogDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    taskCatalog: TaskCatalog | null;
    onSubmit: (data: CreateTaskCatalogDto | UpdateTaskCatalogDto) => Promise<void>;
}

export function TaskCatalogDialog({ open, onOpenChange, taskCatalog, onSubmit }: TaskCatalogDialogProps) {
    const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<CreateTaskCatalogDto & UpdateTaskCatalogDto>();
    const { workDivisions } = useWorkDivisions();

    useEffect(() => {
        if (open) {
            if (taskCatalog) {
                setValue("name", taskCatalog.name);
                setValue("code", taskCatalog.code);
                setValue("description", taskCatalog.description);
                setValue("workDivisionId", taskCatalog.workDivisionId);
            } else {
                reset({ name: "", code: "", description: "", workDivisionId: "" });
            }
        }
    }, [open, taskCatalog, reset, setValue]);

    const onFormSubmit = async (data: any) => {
        await onSubmit(data);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{taskCatalog ? "Edit Task Catalog" : "Create Task Catalog"}</DialogTitle>
                    <DialogDescription>
                        {taskCatalog ? "Update task catalog details." : "Create a new task catalog entry."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onFormSubmit)} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="workDivisionId">Work Division</Label>
                        <Select onValueChange={(val) => setValue("workDivisionId", val)} defaultValue={taskCatalog?.workDivisionId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Division" />
                            </SelectTrigger>
                            <SelectContent>
                                {workDivisions?.map((div) => (
                                    <SelectItem key={div.id} value={div.id}>{div.name} ({div.code})</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.workDivisionId && <span className="text-destructive text-xs">Required</span>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="code">Code</Label>
                        <Input id="code" {...register("code", { required: true })} placeholder="TASK-001" />
                        {errors.code && <span className="text-destructive text-xs">Required</span>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" {...register("name", { required: true })} placeholder="Excavation" />
                        {errors.name && <span className="text-destructive text-xs">Required</span>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            {...register("description")}
                            placeholder="Description of the task..."
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
