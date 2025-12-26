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
import { usePlans } from "@/hooks/use-plans";
import { useUsers } from "@/hooks/use-users";

interface SubDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    subscription: Subscription | null;
    onSubmit: (data: CreateSubDto) => Promise<void>;
}

export function SubDialog({ open, onOpenChange, subscription, onSubmit }: SubDialogProps) {
    const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<CreateSubDto>();
    const { plans } = usePlans();
    const { users } = useUsers();

    useEffect(() => {
        if (open) {
            if (subscription) {
                setValue("userId", subscription.userId);
                setValue("planId", subscription.planId);
                setValue("status", subscription.status);
                setValue("trialEndsAt", subscription.trialEndsAt ? subscription.trialEndsAt.split('T')[0] : "");
                setValue("currentPeriodStart", subscription.currentPeriodStart ? subscription.currentPeriodStart.split('T')[0] : "");
                setValue("currentPeriodEnd", subscription.currentPeriodEnd ? subscription.currentPeriodEnd.split('T')[0] : "");
                setValue("canceledAt", subscription.canceledAt ? subscription.canceledAt.split('T')[0] : "");
            } else {
                reset({
                    userId: "",
                    planId: "",
                    status: "ACTIVE",
                    trialEndsAt: "",
                    currentPeriodStart: new Date().toISOString().split('T')[0],
                    currentPeriodEnd: "",
                    canceledAt: ""
                });
            }
        }
    }, [open, subscription, reset, setValue]);

    const onFormSubmit = async (data: any) => {
        // Sanitize empty strings to undefined/null for Prisma
        const payload = {
            ...data,
            // Convert empty strings to undefined so they are not sent, or null if explicit clear is needed (but for create, undefined is safer)
            trialEndsAt: data.trialEndsAt ? new Date(data.trialEndsAt).toISOString() : undefined,
            currentPeriodStart: data.currentPeriodStart ? new Date(data.currentPeriodStart).toISOString() : undefined,
            currentPeriodEnd: data.currentPeriodEnd ? new Date(data.currentPeriodEnd).toISOString() : undefined,
            canceledAt: data.canceledAt ? new Date(data.canceledAt).toISOString() : undefined,
        };
        await onSubmit(payload);
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
                        <Label htmlFor="userId">User (Owner)</Label>
                        <Select onValueChange={(val) => setValue("userId", val)} defaultValue={subscription?.userId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select User" />
                            </SelectTrigger>
                            <SelectContent>
                                {users?.map((user) => (
                                    <SelectItem key={user.id} value={user.id}>{user.fullName} ({user.email})</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.userId && <span className="text-destructive text-xs">Required</span>}
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
                            <Label htmlFor="currentPeriodStart">Period Start</Label>
                            <Input id="currentPeriodStart" type="date" {...register("currentPeriodStart")} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="currentPeriodEnd">Period End</Label>
                            <Input id="currentPeriodEnd" type="date" {...register("currentPeriodEnd")} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="trialEndsAt">Trial Ends (Optional)</Label>
                            <Input id="trialEndsAt" type="date" {...register("trialEndsAt")} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="canceledAt">Canceled At (Optional)</Label>
                            <Input id="canceledAt" type="date" {...register("canceledAt")} />
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
