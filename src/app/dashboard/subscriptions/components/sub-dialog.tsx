"use client";

import { useForm } from "react-hook-form";
import { Subscription, CreateSubDto } from "@/types/subscription";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useOrganizations } from "@/hooks/use-organizations";
import { usePlans } from "@/hooks/use-plans";

interface SubDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    subscription: Subscription | null;
    onSubmit: (data: CreateSubDto) => Promise<void>;
}

export function SubDialog({ open, onOpenChange, subscription, onSubmit }: SubDialogProps) {
    const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<CreateSubDto>();
    const { organizations } = useOrganizations();
    const { plans } = usePlans();

    useEffect(() => {
        if (open) {
            if (subscription) {
                setValue("organizationId", subscription.organizationId);
                setValue("planId", subscription.planId);
                setValue("startDate", subscription.startDate.split('T')[0]);
                setValue("endDate", subscription.endDate.split('T')[0]);
                setValue("status", subscription.status);
            } else {
                reset({
                    organizationId: "",
                    planId: "",
                    startDate: new Date().toISOString().split('T')[0],
                    endDate: "",
                    status: "ACTIVE"
                });
            }
        }
    }, [open, subscription, reset, setValue]);

    const onFormSubmit = async (data: any) => {
        // Ensure dates are properly formatted if needed by backend, simple string YYYY-MM-DD usually fine
        await onSubmit(data);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{subscription ? "Edit Subscription" : "Create Subscription"}</DialogTitle>
                    <DialogDescription>
                        Manage organization subscription details.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onFormSubmit)} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="organizationId">Organization</Label>
                        <Select onValueChange={(val) => setValue("organizationId", val)} defaultValue={subscription?.organizationId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Organization" />
                            </SelectTrigger>
                            <SelectContent>
                                {organizations?.map((org) => (
                                    <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.organizationId && <span className="text-destructive text-xs">Required</span>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="planId">Plan</Label>
                        <Select onValueChange={(val) => setValue("planId", val)} defaultValue={subscription?.planId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Plan" />
                            </SelectTrigger>
                            <SelectContent>
                                {plans?.map((plan) => (
                                    <SelectItem key={plan.id} value={plan.id}>
                                        {plan.name} - {new Intl.NumberFormat('id-ID', { style: 'currency', currency: plan.currency || 'IDR' }).format(plan.priceCents)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.planId && <span className="text-destructive text-xs">Required</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="startDate">Start Date</Label>
                            <Input id="startDate" type="date" {...register("startDate", { required: true })} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="endDate">End Date</Label>
                            <Input id="endDate" type="date" {...register("endDate", { required: true })} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select onValueChange={(val: any) => setValue("status", val)} defaultValue={subscription?.status || "ACTIVE"}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ACTIVE">Active</SelectItem>
                                <SelectItem value="EXPIRED">Expired</SelectItem>
                                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
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
