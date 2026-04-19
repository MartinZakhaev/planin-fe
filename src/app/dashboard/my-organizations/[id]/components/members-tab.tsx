"use client";

import { useState } from "react";
import { Organization, OrgMember, AddMemberDto } from "@/types/organization";
import { useOrgMembers } from "@/hooks/use-organization-members";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ActionDialog } from "@/components/action-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddMemberDialog } from "./add-member-dialog";
import { toast } from "sonner";
import { UserPlus, MoreHorizontal, Crown, Shield, Trash2, AlertTriangle, Users } from "lucide-react";

interface MembersTabProps {
    org: Organization;
    currentUserId: string;
}

function initials(name: string | null, email?: string) {
    if (name) return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    if (email) return email[0].toUpperCase();
    return "?";
}

export function MembersTab({ org, currentUserId }: MembersTabProps) {
    const { members, isLoading, addMember, updateRole, removeMember } = useOrgMembers(org.id);
    const [addOpen, setAddOpen] = useState(false);
    const [removeTarget, setRemoveTarget] = useState<OrgMember | null>(null);
    const [isRemoving, setIsRemoving] = useState(false);

    const isOwner = org.ownerUserId === currentUserId;
    const isCurrentUserAdmin = isOwner || members.some(m => m.userId === currentUserId && m.role === "ADMIN");

    const handleAdd = async (dto: AddMemberDto) => {
        await addMember(dto);
    };

    const handleChangeRole = async (member: OrgMember, newRole: "ADMIN" | "MEMBER") => {
        try {
            await updateRole(member.id, { role: newRole });
            toast.success(`Role updated to ${newRole.toLowerCase()}`);
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const handleRemove = async () => {
        if (!removeTarget) return;
        setIsRemoving(true);
        try {
            await removeMember(removeTarget.id);
            toast.success("Member removed");
            setRemoveTarget(null);
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setIsRemoving(false);
        }
    };

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div className="space-y-1">
                        <CardTitle className="text-base">Members</CardTitle>
                        <CardDescription className="text-xs">
                            {members.length} member{members.length !== 1 ? "s" : ""} in this organization
                        </CardDescription>
                    </div>
                    {isCurrentUserAdmin && (
                        <Button size="sm" onClick={() => setAddOpen(true)} className="gap-2">
                            <UserPlus className="size-4" />
                            Add Member
                        </Button>
                    )}
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center gap-3 py-3 border-b border-border/50 last:border-0 animate-pulse">
                                    <div className="size-10 rounded-full bg-muted" />
                                    <div className="flex-1 space-y-1.5">
                                        <div className="h-3 bg-muted rounded w-32" />
                                        <div className="h-2.5 bg-muted rounded w-48" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : members.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Users className="size-10 text-muted-foreground/30 mb-3" />
                            <p className="text-sm font-medium">No members yet</p>
                            <p className="text-xs text-muted-foreground mt-1">Add team members to collaborate on projects.</p>
                            {isCurrentUserAdmin && (
                                <Button size="sm" variant="outline" className="mt-4 gap-2" onClick={() => setAddOpen(true)}>
                                    <UserPlus className="size-4" />
                                    Add First Member
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="divide-y divide-border/50">
                            {/* Owner row */}
                            <div className="flex items-center gap-3 py-3">
                                <Avatar className="size-10">
                                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                                        {initials(null, org.ownerUserId)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium">Organization Owner</p>
                                        {org.ownerUserId === currentUserId && (
                                            <span className="text-xs text-muted-foreground">(you)</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground">ID: {org.ownerUserId.slice(0, 8)}…</p>
                                </div>
                                <Badge variant="default" className="gap-1 text-xs shrink-0">
                                    <Crown className="size-3" />
                                    Owner
                                </Badge>
                            </div>

                            {/* Member rows */}
                            {members.map((member) => {
                                const isSelf = member.userId === currentUserId;
                                const canManage = isCurrentUserAdmin && member.userId !== org.ownerUserId;

                                return (
                                    <div key={member.id} className="flex items-center gap-3 py-3">
                                        <Avatar className="size-10">
                                            <AvatarFallback className="bg-muted text-muted-foreground text-sm font-medium">
                                                {initials(member.user?.fullName ?? null, member.user?.email)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-medium truncate">
                                                    {member.user?.fullName || member.user?.email || "Unknown user"}
                                                </p>
                                                {isSelf && <span className="text-xs text-muted-foreground">(you)</span>}
                                            </div>
                                            <p className="text-xs text-muted-foreground truncate">{member.user?.email}</p>
                                        </div>
                                        <Badge variant={member.role === "ADMIN" ? "default" : "secondary"} className="text-xs shrink-0">
                                            {member.role === "ADMIN" ? "Admin" : "Member"}
                                        </Badge>
                                        {canManage && (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="size-8 shrink-0">
                                                        <MoreHorizontal className="size-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-44">
                                                    <DropdownMenuLabel className="text-xs">Change Role</DropdownMenuLabel>
                                                    <DropdownMenuItem
                                                        disabled={member.role === "ADMIN"}
                                                        onClick={() => handleChangeRole(member, "ADMIN")}
                                                    >
                                                        <Shield className="mr-2 size-4" />
                                                        Make Admin
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        disabled={member.role === "MEMBER"}
                                                        onClick={() => handleChangeRole(member, "MEMBER")}
                                                    >
                                                        <Users className="mr-2 size-4" />
                                                        Make Member
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="text-destructive focus:text-destructive"
                                                        onClick={() => setRemoveTarget(member)}
                                                    >
                                                        <Trash2 className="mr-2 size-4" />
                                                        Remove
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            <AddMemberDialog
                open={addOpen}
                onOpenChange={setAddOpen}
                orgId={org.id}
                existingMemberIds={members.map(m => m.userId)}
                onAdd={handleAdd}
            />

            <ActionDialog
                open={!!removeTarget}
                onOpenChange={(open) => !open && setRemoveTarget(null)}
                type="warning"
                title="Remove Member?"
                description={
                    removeTarget ? (
                        <>
                            Remove{" "}
                            <span className="font-semibold">{removeTarget.user?.fullName || removeTarget.user?.email || "this member"}</span>{" "}
                            from the organization? They will lose access to all projects in this organization.
                        </>
                    ) : undefined
                }
                onConfirm={handleRemove}
                confirmLabel="Remove Member"
                isLoading={isRemoving}
                icon={<AlertTriangle className="h-6 w-6 text-destructive" />}
                iconPosition="left"
            />
        </div>
    );
}
