"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Organization, CreateOrgDto, UpdateOrgDto } from "@/types/organization";
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
import { Loader2, Building2, Hash, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface MyOrgDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    org: Organization | null;
    onSubmit: (data: CreateOrgDto | UpdateOrgDto) => Promise<void>;
}

export function MyOrgDialog({ open, onOpenChange, org, onSubmit }: MyOrgDialogProps) {
    const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<CreateOrgDto & UpdateOrgDto>();
    const { user } = useAuth();

    useEffect(() => {
        if (open) {
            if (org) {
                setValue("name", org.name);
                setValue("code", org.code || "");
            } else {
                reset({ name: "", code: "" });
            }
        }
    }, [open, org, reset, setValue]);

    const onFormSubmit = async (data: any) => {
        if (!org && user) {
            data.ownerUserId = user.id;
        }
        await onSubmit(data);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px] p-0 gap-0 overflow-hidden">
                <DialogHeader className="px-6 py-5 pb-4 border-b border-border/50">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                            <Building2 className="size-5" />
                        </div>
                        <div className="min-w-0">
                            <DialogTitle className="text-base leading-tight">
                                {org ? "Edit Organization" : "Create Organization"}
                            </DialogTitle>
                            <DialogDescription className="text-xs mt-0.5 leading-tight">
                                {org ? "Update your organization details." : "Create a new organization to group your projects."}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit(onFormSubmit)}>
                    <div className="px-6 py-5 space-y-4">
                        <div className="rounded-lg border border-border/50 bg-muted/20 p-4 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="org-name" className="text-xs font-medium text-foreground/80">
                                    Organization Name <span className="text-destructive ml-0.5">*</span>
                                </Label>
                                <Input
                                    id="org-name"
                                    autoFocus
                                    placeholder="e.g., Acme Construction"
                                    {...register("name", { required: "Organization name is required" })}
                                    aria-invalid={!!errors.name}
                                />
                                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="org-code" className="text-xs font-medium text-foreground/80">
                                    Organization Code
                                    <span className="text-muted-foreground font-normal ml-1">(optional)</span>
                                </Label>
                                <div className="relative">
                                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                                    <Input
                                        id="org-code"
                                        placeholder="ACME"
                                        className="pl-8"
                                        {...register("code", { maxLength: { value: 80, message: "Max 80 characters" } })}
                                        aria-invalid={!!errors.code}
                                    />
                                </div>
                                {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
                                <p className="text-[11px] text-muted-foreground">A short unique identifier (up to 80 characters).</p>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="px-6 py-4 border-t border-border/50 bg-muted/20 gap-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting} className="h-9 px-4">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="h-9 px-4 gap-2">
                            {isSubmitting ? (
                                <><Loader2 className="size-4 animate-spin" />Saving...</>
                            ) : (
                                <>{org ? "Save Changes" : "Create Organization"}<ArrowRight className="size-4" /></>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
