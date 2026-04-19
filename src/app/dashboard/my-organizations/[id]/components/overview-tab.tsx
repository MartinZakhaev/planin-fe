"use client";

import { Organization, OrgMember } from "@/types/organization";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Building2, Hash, Calendar, Users, FolderOpen, Crown, Shield } from "lucide-react";

interface OverviewTabProps {
    org: Organization;
    members: OrgMember[];
    currentUserId: string;
}

function StatCard({ icon: Icon, label, value, description }: { icon: any; label: string; value: number | string; description: string }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}

function initials(name: string | null, email?: string) {
    if (name) return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    if (email) return email[0].toUpperCase();
    return "?";
}

export function OverviewTab({ org, members, currentUserId }: OverviewTabProps) {
    const isOwner = org.ownerUserId === currentUserId;
    const adminCount = members.filter(m => m.role === "ADMIN").length;
    const memberCount = members.filter(m => m.role === "MEMBER").length;
    const recentMembers = members.slice(0, 5);

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <StatCard icon={Users} label="Total Members" value={org.memberCount ?? members.length} description={`${adminCount} admin${adminCount !== 1 ? "s" : ""}, ${memberCount} member${memberCount !== 1 ? "s" : ""}`} />
                <StatCard icon={FolderOpen} label="Projects" value={org.projectCount ?? 0} description="Projects in this organization" />
                <StatCard icon={isOwner ? Crown : Shield} label="Your Role" value={isOwner ? "Owner" : "Member"} description={isOwner ? "Full administrative access" : "View and contribute access"} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {/* Organization Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Organization Info</CardTitle>
                        <CardDescription className="text-xs">Details about this organization</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                            <Building2 className="size-4 text-muted-foreground shrink-0" />
                            <div className="min-w-0">
                                <p className="text-xs text-muted-foreground">Name</p>
                                <p className="text-sm font-medium truncate">{org.name}</p>
                            </div>
                        </div>
                        {org.code && (
                            <div className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                                <Hash className="size-4 text-muted-foreground shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-xs text-muted-foreground">Code</p>
                                    <p className="text-sm font-mono">{org.code}</p>
                                </div>
                            </div>
                        )}
                        <div className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                            <Calendar className="size-4 text-muted-foreground shrink-0" />
                            <div className="min-w-0">
                                <p className="text-xs text-muted-foreground">Created</p>
                                <p className="text-sm">{new Date(org.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 py-2">
                            <Crown className="size-4 text-muted-foreground shrink-0" />
                            <div className="min-w-0">
                                <p className="text-xs text-muted-foreground">Your Role</p>
                                <Badge variant={isOwner ? "default" : "secondary"} className="text-xs mt-0.5">
                                    {isOwner ? "Owner" : "Member"}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Members */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Recent Members</CardTitle>
                        <CardDescription className="text-xs">Latest additions to this organization</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {recentMembers.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <Users className="size-8 text-muted-foreground/40 mb-2" />
                                <p className="text-sm text-muted-foreground">No members yet</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentMembers.map((member) => (
                                    <div key={member.id} className="flex items-center gap-3">
                                        <Avatar className="size-8">
                                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                                {initials(member.user?.fullName ?? null, member.user?.email)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium leading-tight truncate">
                                                {member.user?.fullName || member.user?.email || "Unknown"}
                                            </p>
                                            <p className="text-xs text-muted-foreground truncate">{member.user?.email}</p>
                                        </div>
                                        <Badge variant={member.role === "ADMIN" ? "default" : "secondary"} className="text-xs shrink-0">
                                            {member.role === "ADMIN" ? "Admin" : "Member"}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
