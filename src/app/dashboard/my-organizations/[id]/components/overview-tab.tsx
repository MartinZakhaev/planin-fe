"use client";

import { Organization, OrgMember } from "@/types/organization";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Building2, Hash, Calendar, Users, Crown, Shield, ArrowRight } from "lucide-react";
import Link from "next/link";

interface OverviewTabProps {
    org: Organization;
    members: OrgMember[];
    currentUserId: string;
}

function initials(name: string | null, email?: string) {
    if (name) return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    if (email) return (email[0] || "?").toUpperCase();
    return "?";
}

function MemberRow({ member }: { member: OrgMember }) {
    const isAdmin = member.role === "ADMIN";
    return (
        <div className="flex items-center gap-3 py-2.5 group">
            <Avatar className="size-8 shrink-0">
                <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                    {initials(member.user?.fullName ?? null, member.user?.email)}
                </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
                <p className="text-sm font-medium leading-tight truncate">
                    {member.user?.fullName || member.user?.email || "Unknown"}
                </p>
                <p className="text-xs text-muted-foreground truncate">{member.user?.email}</p>
            </div>
            <Badge
                variant={isAdmin ? "default" : "secondary"}
                className={`text-[10px] font-semibold shrink-0 px-1.5 py-0 ${isAdmin ? "bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900" : ""}`}
            >
                {isAdmin ? "Admin" : "Member"}
            </Badge>
        </div>
    );
}

export function OverviewTab({ org, members, currentUserId }: OverviewTabProps) {
    const isOwner = org.ownerUserId === currentUserId;
    const recentMembers = [...members]
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        .slice(0, 6);
    const adminCount = members.filter((m) => m.role === "ADMIN").length;
    const memberOnlyCount = members.filter((m) => m.role === "MEMBER").length;

    return (
        <div className="space-y-5">
            {/* Two-column grid */}
            <div className="grid gap-5 md:grid-cols-2">
                {/* Organization Details */}
                <Card className="border-border/60 shadow-sm">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-sm font-semibold">Organization Details</CardTitle>
                                <CardDescription className="text-xs mt-0.5">Core information</CardDescription>
                            </div>
                            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Building2 className="size-4 text-primary" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-0 divide-y divide-border/60">
                        <DetailRow icon={Building2} label="Organization Name" value={org.name} />
                        {org.code && <DetailRow icon={Hash} label="Code" value={org.code} mono />}
                        <DetailRow
                            icon={Calendar}
                            label="Created"
                            value={new Date(org.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        />
                        <DetailRow
                            icon={isOwner ? Crown : Shield}
                            label="Your Access"
                            value={isOwner ? "Owner — full control" : "Member — view & contribute"}
                            badge={isOwner ? "Owner" : "Member"}
                            badgeVariant={isOwner ? "default" : "secondary"}
                        />
                    </CardContent>
                </Card>

                {/* Team Summary */}
                <Card className="border-border/60 shadow-sm">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-sm font-semibold">Team Summary</CardTitle>
                                <CardDescription className="text-xs mt-0.5">Members breakdown</CardDescription>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="flex -space-x-2">
                                    {members.slice(0, 4).map((m) => (
                                        <Avatar key={m.id} className="size-7 ring-2 ring-background">
                                            <AvatarFallback className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                                                {initials(m.user?.fullName ?? null, m.user?.email)}
                                            </AvatarFallback>
                                        </Avatar>
                                    ))}
                                </div>
                                {members.length > 4 && (
                                    <span className="text-[10px] text-muted-foreground ml-1">
                                        +{members.length - 4}
                                    </span>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <BreakdownBar
                            label="Admins"
                            count={adminCount}
                            total={members.length || 1}
                            color="bg-slate-800 dark:bg-slate-200"
                        />
                        <BreakdownBar
                            label="Members"
                            count={memberOnlyCount}
                            total={members.length || 1}
                            color="bg-muted"
                        />
                        <div className="pt-1 flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">
                                {members.length === 0
                                    ? "No members added yet"
                                    : `${members.length} total member${members.length !== 1 ? "s" : ""}`}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Member list */}
            <Card className="border-border/60 shadow-sm">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-sm font-semibold">All Members</CardTitle>
                            <CardDescription className="text-xs mt-0.5">
                                {members.length} member{members.length !== 1 ? "s" : ""} in this organization
                            </CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" asChild className="text-xs gap-1 h-7">
                            <Link href="/dashboard/my-organizations">
                                Manage
                                <ArrowRight className="size-3" />
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {recentMembers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-3">
                                <Users className="size-6 text-muted-foreground/50" />
                            </div>
                            <p className="text-sm font-medium">No members yet</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Go to Members tab to add team members.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-border/50 px-5">
                            {recentMembers.map((member) => (
                                <MemberRow key={member.id} member={member} />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function DetailRow({
    icon: Icon,
    label,
    value,
    mono,
    badge,
    badgeVariant,
}: {
    icon: any;
    label: string;
    value: string;
    mono?: boolean;
    badge?: string;
    badgeVariant?: string;
}) {
    return (
        <div className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
            <Icon className="size-3.5 text-muted-foreground shrink-0" />
            <div className="min-w-0 flex-1">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wide">{label}</p>
            </div>
            {badge ? (
                <Badge variant={badgeVariant as any} className="text-[10px] font-semibold px-1.5 py-0 shrink-0">
                    {badge}
                </Badge>
            ) : (
                <p
                    className={`text-sm font-medium truncate ${mono ? "font-mono text-xs text-muted-foreground" : ""}`}
                >
                    {value}
                </p>
            )}
        </div>
    );
}

function BreakdownBar({
    label,
    count,
    total,
    color,
}: {
    label: string;
    count: number;
    total: number;
    color: string;
}) {
    const pct = total > 0 ? (count / total) * 100 : 0;
    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{label}</span>
                <span className="text-xs font-semibold text-foreground">{count}</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all ${color}`}
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}
