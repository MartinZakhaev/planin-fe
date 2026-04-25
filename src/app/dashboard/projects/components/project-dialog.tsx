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
import { useEffect, useState } from "react";
import { Loader2, Building2, Hash, MapPin, Percent, Coins, FileText, ArrowRight, Plus, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useOrganizations } from "@/hooks/use-organizations";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CreateOrgSheet } from "./create-org-sheet";

interface ProjectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    project: Project | null;
    onSubmit: (data: CreateProjectDto | UpdateProjectDto) => Promise<void>;
}

export function ProjectDialog({ open, onOpenChange, project, onSubmit }: ProjectDialogProps) {
    const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<CreateProjectDto & UpdateProjectDto>();
    const { user } = useAuth();
    const { organizations, isLoading: orgsLoading, refreshOrganizations } = useOrganizations();
    const [createOrgOpen, setCreateOrgOpen] = useState(false);

    const handleOrgCreated = (newOrgId: string) => {
        refreshOrganizations();
        setValue("organizationId", newOrgId);
        setCreateOrgOpen(false);
    };

    const selectedOrgId = watch("organizationId");
    const selectedCurrency = watch("currency") || "IDR";

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
        if (!data.organizationId) return;
        if (!project && user) {
            data.ownerUserId = user.id;
        }
        data.taxRatePercent = Number(data.taxRatePercent);
        await onSubmit(data);
    };

    return (
        <>
        <CreateOrgSheet
            open={createOrgOpen}
            onOpenChange={setCreateOrgOpen}
            onCreated={handleOrgCreated}
        />
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[560px] max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
                {/* Header */}
                <DialogHeader className="px-6 py-5 pb-4 border-b border-border/50 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                            <Building2 className="size-5" />
                        </div>
                        <div className="min-w-0">
                            <DialogTitle className="text-base leading-tight">
                                {project ? "Edit Project" : "Create New Project"}
                            </DialogTitle>
                            <DialogDescription className="text-xs mt-0.5 leading-tight">
                                {project
                                    ? "Update the project details below."
                                    : "Set up a new RAB project for your organization."}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Scrollable Form Content */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                    <div className="space-y-5">
                        {/* Project Details */}
                        <div className="space-y-3">
                            <div className="space-y-1.5">
                                <h3 className="text-xs font-medium text-foreground/80 uppercase tracking-wide">Project Details</h3>
                                <p className="text-[11px] text-muted-foreground">Basic information about the project</p>
                            </div>
                            <div className="rounded-lg border border-border/50 bg-muted/20 p-4 space-y-3">
                                {/* Project Name */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="name" className="text-xs font-medium text-foreground/80">
                                            Project Name <span className="text-destructive ml-0.5">*</span>
                                        </Label>
                                    </div>
                                    <Input
                                        id="name"
                                        placeholder="e.g., Rumah Tinggal 2 Lantai"
                                        {...register("name", { required: "Project name is required" })}
                                        aria-invalid={!!errors.name}
                                    />
                                    {errors.name && (
                                        <p className="text-xs text-destructive">{errors.name.message}</p>
                                    )}
                                </div>

                                {/* Project Code & Organization */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="code" className="text-xs font-medium text-foreground/80">
                                            Project Code
                                        </Label>
                                        <Input
                                            id="code"
                                            placeholder="PRJ-001"
                                            {...register("code")}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="organizationId" className="text-xs font-medium text-foreground/80">
                                            Organization <span className="text-destructive ml-0.5">*</span>
                                        </Label>
                                        {!orgsLoading && organizations.length === 0 && !project ? (
                                            <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 px-3 py-2.5 flex items-start gap-2">
                                                <AlertCircle className="size-3.5 text-amber-500 shrink-0 mt-0.5" />
                                                <div className="min-w-0">
                                                    <p className="text-xs text-amber-700 dark:text-amber-300 leading-snug">No organizations yet.</p>
                                                    <button
                                                        type="button"
                                                        className="text-xs text-amber-700 dark:text-amber-300 underline underline-offset-2 mt-0.5 hover:opacity-80 transition-opacity"
                                                        onClick={() => setCreateOrgOpen(true)}
                                                    >
                                                        Create your first organization →
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex gap-1.5">
                                                <Select
                                                    value={selectedOrgId}
                                                    onValueChange={(value) => setValue("organizationId", value)}
                                                    disabled={!!project}
                                                >
                                                    <SelectTrigger id="organizationId" className="w-full">
                                                        <SelectValue placeholder="Select org" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {organizations.map((org) => (
                                                            <SelectItem key={org.id} value={org.id}>
                                                                {org.name}
                                                            </SelectItem>
                                                        ))}
                                                        {!project && (
                                                            <>
                                                                <SelectSeparator />
                                                                <div
                                                                    className="flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-sm select-none"
                                                                    onMouseDown={(e) => {
                                                                        e.preventDefault();
                                                                        setCreateOrgOpen(true);
                                                                    }}
                                                                >
                                                                    <Plus className="size-3.5" />
                                                                    New organization...
                                                                </div>
                                                            </>
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}
                                        {errors.organizationId && (
                                            <p className="text-xs text-destructive">{errors.organizationId.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Location & Finance */}
                        <div className="space-y-3">
                            <div className="space-y-1.5">
                                <h3 className="text-xs font-medium text-foreground/80 uppercase tracking-wide">Location & Finance</h3>
                                <p className="text-[11px] text-muted-foreground">Project location and tax configuration</p>
                            </div>
                            <div className="rounded-lg border border-border/50 bg-muted/20 p-4 space-y-3">
                                {/* Location */}
                                <div className="space-y-2">
                                    <Label htmlFor="location" className="text-xs font-medium text-foreground/80">
                                        Location
                                    </Label>
                                    <Input
                                        id="location"
                                        placeholder="e.g., Jakarta Selatan"
                                        {...register("location")}
                                    />
                                </div>

                                {/* Tax Rate & Currency */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="taxRatePercent" className="text-xs font-medium text-foreground/80">
                                            Tax Rate (%)
                                        </Label>
                                        <Input
                                            id="taxRatePercent"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            max="100"
                                            placeholder="11"
                                            {...register("taxRatePercent")}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="currency" className="text-xs font-medium text-foreground/80">
                                            Currency
                                        </Label>
                                        <Select
                                            value={selectedCurrency}
                                            onValueChange={(value) => setValue("currency", value)}
                                        >
                                            <SelectTrigger id="currency" className="w-full">
                                                <SelectValue placeholder="Select currency" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="IDR">IDR (Indonesian Rupiah)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-3">
                            <div className="space-y-1.5">
                                <h3 className="text-xs font-medium text-foreground/80 uppercase tracking-wide">Additional Info</h3>
                                <p className="text-[11px] text-muted-foreground">Optional project description</p>
                            </div>
                            <div className="rounded-lg border border-border/50 bg-muted/20 p-4">
                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-xs font-medium text-foreground/80">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Describe the project scope, objectives, or any relevant details..."
                                        rows={3}
                                        className="resize-none"
                                        {...register("description")}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer - Fixed at bottom */}
                <DialogFooter className="px-6 py-4 border-t border-border/50 bg-muted/20 shrink-0 gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isSubmitting}
                        className="h-9 px-4"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting || (!project && !selectedOrgId)}
                        onClick={handleSubmit(onFormSubmit)}
                        className="h-9 px-4 gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                {project ? "Save Changes" : "Create Project"}
                                <ArrowRight className="size-4" />
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        </>
    );
}
