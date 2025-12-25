"use client";

import { useForm } from "react-hook-form";
import { WorkDivision, CreateWorkDivisionDto, UpdateWorkDivisionDto } from "@/types/work-division";
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

interface WorkDivisionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    workDivision: WorkDivision | null;
    onSubmit: (data: CreateWorkDivisionDto | UpdateWorkDivisionDto) => Promise<void>;
}

export function WorkDivisionDialog({ open, onOpenChange, workDivision, onSubmit }: WorkDivisionDialogProps) {
    const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<CreateWorkDivisionDto & UpdateWorkDivisionDto>();

    useEffect(() => {
        if (open) {
            if (workDivision) {
                setValue("name", workDivision.name);
                setValue("code", workDivision.code);
                setValue("description", workDivision.description);
            } else {
                reset({ name: "", code: "", description: "" });
            }
        }
    }, [open, workDivision, reset, setValue]);

    const onFormSubmit = async (data: any) => {
        await onSubmit(data);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{workDivision ? "Edit Work Division" : "Create Work Division"}</DialogTitle>
                    <DialogDescription>
                        {workDivision ? "Update work division details." : "Create a new work division category."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onFormSubmit)} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="code">Code</Label>
                        <Input id="code" {...register("code", { required: true })} placeholder="DIV-001" />
                        {errors.code && <span className="text-destructive text-xs">Required</span>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" {...register("name", { required: true })} placeholder="Structure Works" />
                        {errors.name && <span className="text-destructive text-xs">Required</span>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            {...register("description")}
                            placeholder="Description of the work division..."
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
