"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Organization, UpdateOrgDto } from "@/types/organization";
import { useOrganizations } from "@/hooks/use-organizations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ActionDialog } from "@/components/action-dialog";
import { toast } from "sonner";
import { Loader2, Save, Trash2, AlertTriangle, Hash } from "lucide-react";

interface SettingsTabProps {
    org: Organization;
    currentUserId: string;
    onOrgUpdated: () => void;
}

export function SettingsTab({ org, currentUserId, onOrgUpdated }: SettingsTabProps) {
    const router = useRouter();
    const { updateOrganization, deleteOrganization } = useOrganizations();
    const [showDelete, setShowDelete] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const isOwner = org.ownerUserId === currentUserId;

    const { register, handleSubmit, reset, formState: { errors, isSubmitting, isDirty } } = useForm<UpdateOrgDto>({
        defaultValues: { name: org.name, code: org.code || "" },
    });

    useEffect(() => {
        reset({ name: org.name, code: org.code || "" });
    }, [org, reset]);

    const onSave = async (data: UpdateOrgDto) => {
        try {
            await updateOrganization(org.id, data);
            toast.success("Organization updated successfully");
            onOrgUpdated();
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteOrganization(org.id);
            toast.success("Organization deleted");
            router.push("/dashboard/my-organizations");
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-6 max-w-2xl">
            {/* Organization Info */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Organization Information</CardTitle>
                    <CardDescription className="text-xs">
                        Update your organization's name and code.
                        {!isOwner && " You need to be the owner to edit these settings."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSave)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-xs font-medium">
                                Organization Name <span className="text-destructive ml-0.5">*</span>
                            </Label>
                            <Input
                                id="name"
                                placeholder="Acme Construction"
                                disabled={!isOwner}
                                {...register("name", { required: "Name is required" })}
                                aria-invalid={!!errors.name}
                            />
                            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="code" className="text-xs font-medium">
                                Organization Code
                                <span className="text-muted-foreground font-normal ml-1">(optional)</span>
                            </Label>
                            <div className="relative">
                                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                                <Input
                                    id="code"
                                    placeholder="ACME"
                                    className="pl-8"
                                    disabled={!isOwner}
                                    {...register("code", { maxLength: { value: 80, message: "Max 80 characters" } })}
                                    aria-invalid={!!errors.code}
                                />
                            </div>
                            {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
                        </div>

                        {isOwner && (
                            <div className="flex justify-end pt-2">
                                <Button type="submit" disabled={isSubmitting || !isDirty} className="gap-2 h-9 px-4">
                                    {isSubmitting ? (
                                        <><Loader2 className="size-4 animate-spin" />Saving...</>
                                    ) : (
                                        <><Save className="size-4" />Save Changes</>
                                    )}
                                </Button>
                            </div>
                        )}
                    </form>
                </CardContent>
            </Card>

            {/* Danger Zone — owner only */}
            {isOwner && (
                <Card className="border-destructive/30">
                    <CardHeader>
                        <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
                        <CardDescription className="text-xs">
                            Irreversible actions. Proceed with caution.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-start justify-between gap-4 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                            <div>
                                <p className="text-sm font-medium">Delete this organization</p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Permanently delete this organization and all its data. This action cannot be undone.
                                </p>
                            </div>
                            <Button
                                variant="destructive"
                                size="sm"
                                className="shrink-0 gap-2"
                                onClick={() => setShowDelete(true)}
                            >
                                <Trash2 className="size-4" />
                                Delete
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <ActionDialog
                open={showDelete}
                onOpenChange={setShowDelete}
                type="warning"
                title="Delete Organization?"
                description={
                    <>
                        This will permanently delete{" "}
                        <span className="font-semibold">{org.name}</span>{" "}
                        and all its data including projects and members. This action cannot be undone.
                    </>
                }
                onConfirm={handleDelete}
                confirmLabel="Delete Organization"
                isLoading={isDeleting}
                variant="destructive"
                icon={<AlertTriangle className="h-6 w-6 text-destructive" />}
                iconPosition="left"
            />
        </div>
    );
}
