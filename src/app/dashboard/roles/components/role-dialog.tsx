"use client";

import { useForm } from "react-hook-form";
import { Role, CreateRoleDto, UpdateRoleDto, Permission } from "@/types/role";
import { usePermissions } from "@/hooks/use-permissions";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { Loader2, Shield } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface RoleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    role: Role | null; // null = create mode
    onSubmit: (data: CreateRoleDto | UpdateRoleDto) => Promise<void>;
}

export function RoleDialog({ open, onOpenChange, role, onSubmit }: RoleDialogProps) {
    const { groupedPermissions, isLoading: permissionsLoading } = usePermissions();
    const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());

    const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<CreateRoleDto & UpdateRoleDto>();

    useEffect(() => {
        if (open) {
            if (role) {
                setValue("name", role.name);
                setValue("displayName", role.displayName);
                setValue("description", role.description || "");
                // Set selected permissions from role
                const permIds = new Set(role.permissions?.map(p => p.id) || []);
                setSelectedPermissions(permIds);
            } else {
                reset({ name: "", displayName: "", description: "" });
                setSelectedPermissions(new Set());
            }
        }
    }, [open, role, reset, setValue]);

    const togglePermission = (permId: string) => {
        const newSet = new Set(selectedPermissions);
        if (newSet.has(permId)) {
            newSet.delete(permId);
        } else {
            newSet.add(permId);
        }
        setSelectedPermissions(newSet);
    };

    const toggleResourcePermissions = (resource: string) => {
        const resourcePerms = groupedPermissions[resource] || [];
        const allSelected = resourcePerms.every(p => selectedPermissions.has(p.id));

        const newSet = new Set(selectedPermissions);
        if (allSelected) {
            // Deselect all
            resourcePerms.forEach(p => newSet.delete(p.id));
        } else {
            // Select all
            resourcePerms.forEach(p => newSet.add(p.id));
        }
        setSelectedPermissions(newSet);
    };

    const onFormSubmit = async (data: CreateRoleDto | UpdateRoleDto) => {
        await onSubmit({
            ...data,
            permissionIds: Array.from(selectedPermissions),
        });
    };

    const formatResourceName = (resource: string) => {
        return resource.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        {role ? "Edit Role" : "Create Role"}
                    </DialogTitle>
                    <DialogDescription>
                        {role ? "Update role details and permissions." : "Create a new role with specific permissions."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name (Identifier)</Label>
                            <Input
                                id="name"
                                placeholder="e.g., project_manager"
                                disabled={role?.isSystem}
                                {...register("name", { required: true })}
                            />
                            {errors.name && <span className="text-destructive text-xs">Required</span>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="displayName">Display Name</Label>
                            <Input
                                id="displayName"
                                placeholder="e.g., Project Manager"
                                {...register("displayName", { required: true })}
                            />
                            {errors.displayName && <span className="text-destructive text-xs">Required</span>}
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Describe what this role can do..."
                            {...register("description")}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Permissions</Label>
                        <p className="text-xs text-muted-foreground">
                            Selected: {selectedPermissions.size} permissions
                        </p>
                        <ScrollArea className="h-[280px] border rounded-lg p-4">
                            {permissionsLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {Object.entries(groupedPermissions).map(([resource, perms]) => {
                                        const allSelected = perms.every(p => selectedPermissions.has(p.id));
                                        const someSelected = perms.some(p => selectedPermissions.has(p.id));

                                        return (
                                            <div key={resource} className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Checkbox
                                                            checked={allSelected}
                                                            onCheckedChange={() => toggleResourcePermissions(resource)}
                                                            className={someSelected && !allSelected ? "opacity-50" : ""}
                                                        />
                                                        <span className="font-medium text-sm">
                                                            {formatResourceName(resource)}
                                                        </span>
                                                    </div>
                                                    <Badge variant="outline" className="text-xs">
                                                        {perms.filter(p => selectedPermissions.has(p.id)).length}/{perms.length}
                                                    </Badge>
                                                </div>
                                                <div className="ml-6 grid grid-cols-2 gap-2">
                                                    {perms.map(perm => (
                                                        <div key={perm.id} className="flex items-center gap-2">
                                                            <Checkbox
                                                                id={perm.id}
                                                                checked={selectedPermissions.has(perm.id)}
                                                                onCheckedChange={() => togglePermission(perm.id)}
                                                            />
                                                            <label
                                                                htmlFor={perm.id}
                                                                className="text-sm text-muted-foreground cursor-pointer"
                                                            >
                                                                {perm.action}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </ScrollArea>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {role ? "Save Changes" : "Create Role"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
