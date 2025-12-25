"use client";

import { useForm } from "react-hook-form";
import { Plan, CreatePlanDto, UpdatePlanDto } from "@/types/plan";
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
import { Loader2, Plus, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface PlanDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    plan: Plan | null;
    onSubmit: (data: CreatePlanDto | UpdatePlanDto) => Promise<void>;
}

export function PlanDialog({ open, onOpenChange, plan, onSubmit }: PlanDialogProps) {
    const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<CreatePlanDto & UpdatePlanDto>();


    useEffect(() => {
        if (open) {
            if (plan) {
                setValue("code", plan.code);
                setValue("name", plan.name);
                setValue("priceCents", plan.priceCents);
                setValue("currency", plan.currency);
                setValue("interval", plan.interval);
                setValue("maxProjects", plan.maxProjects);
            } else {
                reset({
                    code: "",
                    name: "",
                    priceCents: 0,
                    currency: "IDR",
                    interval: "monthly",
                    maxProjects: 10
                });
            }
        }
    }, [open, plan, reset, setValue]);

    const onFormSubmit = async (data: any) => {
        await onSubmit(data);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{plan ? "Edit Plan" : "Create Plan"}</DialogTitle>
                    <DialogDescription>
                        {plan ? "Update subscription plan details." : "Create a new subscription plan."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onFormSubmit)} className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="code">Code</Label>
                            <Input id="code" {...register("code", { required: true })} placeholder="PRO" />
                            {errors.code && <span className="text-destructive text-xs">Required</span>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" {...register("name", { required: true })} placeholder="Professional" />
                            {errors.name && <span className="text-destructive text-xs">Required</span>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="priceCents">Price</Label>
                            <Input
                                id="priceCents"
                                type="number"
                                {...register("priceCents", { required: true, valueAsNumber: true })}
                            />
                            {errors.priceCents && <span className="text-destructive text-xs">Required</span>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="currency">Currency</Label>
                            <select
                                id="currency"
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                {...register("currency", { required: true })}
                            >
                                <option value="IDR">IDR</option>
                                <option value="USD">USD</option>
                            </select>
                            {errors.currency && <span className="text-destructive text-xs">Required</span>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="interval">Interval</Label>
                            <select
                                id="interval"
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                {...register("interval", { required: true })}
                            >
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                            {errors.interval && <span className="text-destructive text-xs">Required</span>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="maxProjects">Max Projects</Label>
                            <Input
                                id="maxProjects"
                                type="number"
                                {...register("maxProjects", { required: true, valueAsNumber: true })}
                            />
                            {errors.maxProjects && <span className="text-destructive text-xs">Required</span>}
                        </div>
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
