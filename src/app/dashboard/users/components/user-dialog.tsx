"use client";

import { useForm } from "react-hook-form";
import { User, CreateUserDto, UpdateUserDto } from "@/types/user";
import { useRoles } from "@/hooks/use-roles";
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

interface UserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User | null; // null = create mode
    onSubmit: (data: CreateUserDto | UpdateUserDto) => Promise<void>;
}

export function UserDialog({ open, onOpenChange, user, onSubmit }: UserDialogProps) {
    const { roles, isLoading: rolesLoading } = useRoles();
    const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<CreateUserDto & UpdateUserDto>();

    const selectedRoleId = watch("roleId");

    useEffect(() => {
        if (open) {
            if (user) {
                setValue("fullName", user.fullName);
                setValue("roleId", user.roleId || "");
                setValue("email", user.email);
            } else {
                // Default to 'user' role for new users
                const defaultRole = roles.find(r => r.name === 'user');
                reset({
                    fullName: "",
                    email: "",
                    roleId: defaultRole?.id || "",
                    password: ""
                });
            }
        }
    }, [open, user, reset, setValue, roles]);

    const onFormSubmit = async (data: any) => {
        await onSubmit(data);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{user ? "Edit User" : "Create User"}</DialogTitle>
                    <DialogDescription>
                        {user ? "Update user details." : "Add a new user to the system."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onFormSubmit)} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" {...register("fullName", { required: true })} />
                        {errors.fullName && <span className="text-destructive text-xs">Required</span>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            disabled={!!user} // Disable email edit for now
                            {...register("email", { required: !user })}
                        />
                        {errors.email && <span className="text-destructive text-xs">Required</span>}
                    </div>
                    {!user && (
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" {...register("password", { required: true })} />
                            {errors.password && <span className="text-destructive text-xs">Required</span>}
                        </div>
                    )}
                    <div className="grid gap-2">
                        <Label htmlFor="role">Role</Label>
                        {rolesLoading ? (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Loading roles...
                            </div>
                        ) : (
                            <Select
                                onValueChange={(val) => setValue("roleId", val)}
                                value={selectedRoleId}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map(role => (
                                        <SelectItem key={role.id} value={role.id}>
                                            {role.displayName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
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

