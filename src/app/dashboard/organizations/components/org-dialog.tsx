"use client";

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
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface OrgDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    org: Organization | null;
    onSubmit: (data: CreateOrgDto | UpdateOrgDto) => Promise<void>;
}

export function OrgDialog({ open, onOpenChange, org, onSubmit }: OrgDialogProps) {
    const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<CreateOrgDto & UpdateOrgDto>();
    const { user } = useAuth(); // Need current user ID for ownerUserId

    useEffect(() => {
        if (open) {
            if (org) {
                setValue("name", org.name);
                setValue("code", org.code);
            } else {
                reset({ name: "", code: "" });
            }
        }
    }, [open, org, reset, setValue]);

    const onFormSubmit = async (data: any) => {
        // In a real app, you might pick owner from a list of users. 
        // For now, we'll default to current user if creating.
        if (!org && user) {
            data.ownerUserId = user.id;
        }
        await onSubmit(data);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{org ? "Edit Organization" : "Create Organization"}</DialogTitle>
                    <DialogDescription>
                        {org ? "Update organization details." : "Create a new organization."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onFormSubmit)} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" {...register("name", { required: true })} placeholder="Acme Inc." />
                        {errors.name && <span className="text-destructive text-xs">Required</span>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="code">Code</Label>
                        <Input id="code" {...register("code", { required: true })} placeholder="ACME" />
                        {errors.code && <span className="text-destructive text-xs">Required</span>}
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
