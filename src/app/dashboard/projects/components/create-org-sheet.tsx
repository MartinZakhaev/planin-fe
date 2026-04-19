"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, Building2, Hash, X, CheckCircle2 } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { fetcher } from "@/lib/api";
import { Organization } from "@/types/organization";

interface CreateOrgSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreated: (orgId: string) => void;
}

interface CreateOrgFormValues {
    name: string;
    code: string;
}

export function CreateOrgSheet({ open, onOpenChange, onCreated }: CreateOrgSheetProps) {
    const { user } = useAuth();
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreateOrgFormValues>({ defaultValues: { name: "", code: "" } });

    const onSubmit = async (data: CreateOrgFormValues) => {
        if (!user) return;
        setError(null);
        try {
            const org = await fetcher<Organization>("/organizations", {
                method: "POST",
                body: JSON.stringify({
                    name: data.name,
                    code: data.code || undefined,
                    ownerUserId: user.id,
                }),
            });
            reset();
            onCreated(org.id);
        } catch (err: any) {
            setError(err.message || "Failed to create organization.");
        }
    };

    const handleClose = (val: boolean) => {
        if (!val) reset();
        setError(null);
        onOpenChange(val);
    };

    return (
        <Sheet open={open} onOpenChange={handleClose}>
            <SheetContent side="right" className="w-full sm:max-w-[420px] flex flex-col p-0 gap-0">
                {/* Header */}
                <SheetHeader className="px-6 py-5 border-b border-border/50 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                            <Building2 className="size-5" />
                        </div>
                        <div className="min-w-0">
                            <SheetTitle className="text-base leading-tight">New Organization</SheetTitle>
                            <SheetDescription className="text-xs mt-0.5 leading-tight">
                                Create an organization to group your projects.
                            </SheetDescription>
                        </div>
                    </div>
                </SheetHeader>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-y-auto">
                    <div className="flex-1 px-6 py-5 space-y-5">
                        {/* Info callout */}
                        <div className="rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-800 px-4 py-3 flex gap-3 items-start">
                            <CheckCircle2 className="size-4 text-blue-500 shrink-0 mt-0.5" />
                            <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                                You will be the owner and administrator of this organization. You can invite team members later from the organization settings.
                            </p>
                        </div>

                        {/* Fields */}
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
                                {errors.name && (
                                    <p className="text-xs text-destructive">{errors.name.message}</p>
                                )}
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
                                        className="pl-8 uppercase"
                                        {...register("code", { maxLength: { value: 80, message: "Max 80 characters" } })}
                                        aria-invalid={!!errors.code}
                                    />
                                </div>
                                {errors.code && (
                                    <p className="text-xs text-destructive">{errors.code.message}</p>
                                )}
                                <p className="text-[11px] text-muted-foreground">
                                    A short unique identifier for your organization (up to 80 characters).
                                </p>
                            </div>
                        </div>

                        {/* API error */}
                        {error && (
                            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 flex items-start gap-2">
                                <X className="size-4 text-destructive shrink-0 mt-0.5" />
                                <p className="text-xs text-destructive">{error}</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <SheetFooter className="px-6 py-4 border-t border-border/50 bg-muted/20 shrink-0 gap-2 flex-row justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleClose(false)}
                            disabled={isSubmitting}
                            className="h-9 px-4"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="h-9 px-4 gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Organization"
                            )}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
