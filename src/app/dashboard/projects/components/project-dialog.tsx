"use client";

import { useForm } from "react-hook-form";
import { Project, CreateProjectDto, UpdateProjectDto } from "@/types/project";
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
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useOrganizations } from "@/hooks/use-organizations";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ProjectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    project: Project | null;
    onSubmit: (data: CreateProjectDto | UpdateProjectDto) => Promise<void>;
}

export function ProjectDialog({ open, onOpenChange, project, onSubmit }: ProjectDialogProps) {
    const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<CreateProjectDto & UpdateProjectDto>();
    const { user } = useAuth();
    const { organizations } = useOrganizations();

    const selectedOrgId = watch("organizationId");

    useEffect(() => {
        if (open) {
            if (project) {
                setValue("name", project.name);
                setValue("code", project.code || "");
                setValue("description", project.description || "");
                setValue("location", project.location || "");
                setValue("taxRatePercent", project.taxRatePercent);
                setValue("currency", project.currency);
                setValue("organizationId", project.organizationId);
            } else {
                reset({
                    name: "",
                    code: "",
                    description: "",
                    location: "",
                    taxRatePercent: 11,
                    currency: "IDR",
                    organizationId: organizations[0]?.id || "",
                });
            }
        }
    }, [open, project, reset, setValue, organizations]);

    const onFormSubmit = async (data: any) => {
        if (!project && user) {
            data.ownerUserId = user.id;
        }
        // Convert taxRatePercent to number
        data.taxRatePercent = Number(data.taxRatePercent);
        await onSubmit(data);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>{project ? "Edit Project" : "Create Project"}</DialogTitle>
                    <DialogDescription>
                        {project ? "Update project details." : "Create a new RAB project."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onFormSubmit)} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Project Name *</Label>
                        <Input id="name" {...register("name", { required: true })} placeholder="Rumah Tinggal 2 Lantai" />
                        {errors.name && <span className="text-destructive text-xs">Required</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="code">Project Code</Label>
                            <Input id="code" {...register("code")} placeholder="PRJ-001" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="organizationId">Organization *</Label>
                            <Select
                                value={selectedOrgId}
                                onValueChange={(value) => setValue("organizationId", value)}
                                disabled={!!project}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select organization" />
                                </SelectTrigger>
                                <SelectContent>
                                    {organizations.map((org) => (
                                        <SelectItem key={org.id} value={org.id}>
                                            {org.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.organizationId && <span className="text-destructive text-xs">Required</span>}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" {...register("location")} placeholder="Jakarta Selatan" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            {...register("description")}
                            placeholder="Project description..."
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="taxRatePercent">Tax Rate (%)</Label>
                            <Input
                                id="taxRatePercent"
                                type="number"
                                step="0.01"
                                {...register("taxRatePercent")}
                                placeholder="11"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="currency">Currency</Label>
                            <Select
                                value={watch("currency") || "IDR"}
                                onValueChange={(value) => setValue("currency", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="IDR">IDR</SelectItem>
                                    <SelectItem value="USD">USD</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {project ? "Save Changes" : "Create Project"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
