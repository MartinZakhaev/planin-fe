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
import { WorkDivision } from "@/types/work-division";
import { CreateProjectDivisionDto } from "@/types/project-mutations";
import { apiFetch } from "@/lib/api-fetch";

interface AddDivisionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    projectId: string;
    onSuccess: () => void;
    existingDivisionIds?: string[];
}

export function AddDivisionDialog({
    open,
    onOpenChange,
    projectId,
    onSuccess,
    existingDivisionIds = [],
}: AddDivisionDialogProps) {
    const [divisions, setDivisions] = useState<WorkDivision[]>([]);
    const [isLoadingDivisions, setIsLoadingDivisions] = useState(false);
    const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<CreateProjectDivisionDto>();

    const selectedDivisionId = watch("divisionId");

    useEffect(() => {
        if (open) {
            setIsLoadingDivisions(true);
            apiFetch<WorkDivision[]>("/work-division-catalogs")
                .then((data) => {
                    // Filter out already added divisions
                    const filtered = data.filter(d => !existingDivisionIds.includes(d.id));
                    setDivisions(filtered);
                })
                .catch(console.error)
                .finally(() => setIsLoadingDivisions(false));

            reset({
                projectId,
                divisionId: "",
                displayName: "",
                sortOrder: 1,
            });
        }
    }, [open, projectId, existingDivisionIds, reset]);

    // Auto-fill display name when division is selected
    useEffect(() => {
        if (selectedDivisionId) {
            const division = divisions.find(d => d.id === selectedDivisionId);
            if (division) {
                setValue("displayName", division.name);
            }
        }
    }, [selectedDivisionId, divisions, setValue]);

    const onFormSubmit = async (data: CreateProjectDivisionDto) => {
        try {
            await apiFetch("/project-divisions", {
                method: "POST",
                body: JSON.stringify(data),
            });
            onOpenChange(false);
            onSuccess();
        } catch (error: any) {
            console.error("Failed to add division:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Division</DialogTitle>
                    <DialogDescription>
                        Select a work division from the catalog to add to this project.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onFormSubmit)} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="divisionId">Work Division *</Label>
                        {isLoadingDivisions ? (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Loading divisions...
                            </div>
                        ) : divisions.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                No available divisions. All divisions have been added.
                            </p>
                        ) : (
                            <Select
                                value={selectedDivisionId}
                                onValueChange={(value) => setValue("divisionId", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a division" />
                                </SelectTrigger>
                                <SelectContent>
                                    {divisions.map((division) => (
                                        <SelectItem key={division.id} value={division.id}>
                                            <span className="font-mono text-xs text-muted-foreground mr-2">
                                                {division.code}
                                            </span>
                                            {division.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                        {errors.divisionId && <span className="text-destructive text-xs">Required</span>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="displayName">Display Name *</Label>
                        <Input
                            id="displayName"
                            {...register("displayName", { required: true })}
                            placeholder="e.g., Pekerjaan Pondasi"
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
                        <Button type="submit" disabled={isSubmitting || divisions.length === 0}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Add Division
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
