"use client";

import { use, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useOrganizations } from "@/hooks/use-organizations";
import { useOrgMembers } from "@/hooks/use-organization-members";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OverviewTab } from "./components/overview-tab";
import { MembersTab } from "./components/members-tab";
import { SettingsTab } from "./components/settings-tab";
import {
    Loader2,
    Building2,
    Crown,
    Users,
    Settings,
    BarChart3,
    FolderOpen,
    Calendar,
} from "lucide-react";
import Link from "next/link";

type TabValue = "overview" | "members" | "settings";

export default function OrgDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { user } = useAuth();
    const { organizations, isLoading: orgsLoading, refreshOrganizations } = useOrganizations();
    const { members } = useOrgMembers(id);
    const [activeTab, setActiveTab] = useState<TabValue>("overview");

    const org = organizations.find((o) => o.id === id);
    const isOwner = org?.ownerUserId === user?.id;

    if (orgsLoading) {
        return (
            <SidebarInset>
                <div className="flex flex-1 items-center justify-center min-h-[60vh]">
                    <Loader2 className="size-8 animate-spin text-muted-foreground" />
                </div>
            </SidebarInset>
        );
    }

    if (!org) {
        return (
            <SidebarInset>
                <div className="flex flex-1 flex-col items-center justify-center min-h-[60vh] gap-4">
                    <Building2 className="size-12 text-muted-foreground/30" />
                    <div className="text-center">
                        <p className="text-base font-medium">Organization not found</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            This organization doesn&apos;t exist or you don&apos;t have access.
                        </p>
                    </div>
                    <Button variant="outline" asChild className="gap-2">
                        <Link href="/dashboard/my-organizations">
                            Back to My Organizations
                        </Link>
                    </Button>
                </div>
            </SidebarInset>
        );
    }

    const memberCount = org.memberCount ?? members.length;
    const projectCount = org.projectCount ?? 0;
    const adminCount = members.filter((m) => m.role === "ADMIN").length;

    return (
        <SidebarInset className="flex flex-col">
            {/* ── Top breadcrumb bar ── */}
            <header className="flex h-16 shrink-0 items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard/my-organizations">My Organizations</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{org.name}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </header>

            {/* ── Hero section ── */}
            <div className="px-6 pb-6 pt-5">
                <div className="flex items-start justify-between gap-4">
                    {/* Left — org identity */}
                    <div className="flex items-center gap-4 min-w-0">
                        {/* Avatar mark */}
                        <div className="relative shrink-0">
                            <div className="size-14 rounded-2xl bg-gradient-to-br from-primary/90 to-primary flex items-center justify-center shadow-lg shadow-primary/20 ring-4 ring-background">
                                <Building2 className="size-7 text-primary-foreground" />
                            </div>
                            {/* Online indicator dot */}
                            <span className="absolute -bottom-0.5 -right-0.5 size-4 rounded-full bg-emerald-400 ring-2 ring-background" />
                        </div>

                        {/* Name + meta */}
                        <div className="min-w-0">
                            <div className="flex items-center gap-2.5 flex-wrap">
                                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                    {org.name}
                                </h1>
                                {isOwner ? (
                                    <Badge className="gap-1 text-[11px] font-semibold px-2 py-0.5 bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 hover:bg-amber-100 border-0">
                                        <Crown className="size-2.5" />
                                        Owner
                                    </Badge>
                                ) : (
                                    <Badge variant="secondary" className="text-[11px] font-medium px-2 py-0.5">
                                        Member
                                    </Badge>
                                )}
                                {org.code && (
                                    <Badge
                                        variant="outline"
                                        className="font-mono text-[11px] px-2 py-0.5 text-muted-foreground"
                                    >
                                        {org.code}
                                    </Badge>
                                )}
                            </div>

                            {/* Inline stat chips */}
                            <div className="flex items-center gap-3 mt-2.5 flex-wrap">
                                <StatChip icon={Users} value={memberCount} label="members" />
                                <div className="w-px h-3.5 bg-border" />
                                <StatChip icon={FolderOpen} value={projectCount} label="projects" />
                                <div className="w-px h-3.5 bg-border" />
                                <StatChip icon={Calendar} value={new Date(org.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })} label="created" />
                                {adminCount > 0 && (
                                    <>
                                        <div className="w-px h-3.5 bg-border" />
                                        <StatChip icon={Crown} value={adminCount} label={`admin${adminCount !== 1 ? "s" : ""}`} accent />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right — quick actions */}
                    <div className="flex items-center gap-2 shrink-0">
                        <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="gap-1.5 text-xs h-8 px-3 shadow-sm"
                        >
                            <Link href="/dashboard/my-organizations">
                                All Orgs
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* ── Tab navigation ── */}
            <div className="px-6 bg-background">
                <div className="flex items-center gap-0 -mb-px border-b border-border/60">
                    <button
                        onClick={() => setActiveTab("overview")}
                        className={`inline-flex items-center gap-1.5 px-1 py-2.5 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                            activeTab === "overview"
                                ? "border-foreground text-foreground"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        <BarChart3 className="size-3.5" />
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab("members")}
                        className={`inline-flex items-center gap-1.5 px-1 py-2.5 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                            activeTab === "members"
                                ? "border-foreground text-foreground"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        <Users className="size-3.5" />
                        Members
                        {members.length > 0 && (
                            <span className="ml-1 inline-flex items-center justify-center rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground min-w-[18px]">
                                {members.length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab("settings")}
                        className={`inline-flex items-center gap-1.5 px-1 py-2.5 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                            activeTab === "settings"
                                ? "border-foreground text-foreground"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        <Settings className="size-3.5" />
                        Settings
                    </button>
                </div>
            </div>

            {/* ── Tab panels ── */}
            <div className="px-6 pt-5">
                {activeTab === "overview" && (
                    <OverviewTab org={org} members={members} currentUserId={user?.id || ""} />
                )}
                {activeTab === "members" && (
                    <MembersTab org={org} currentUserId={user?.id || ""} />
                )}
                {activeTab === "settings" && (
                    <SettingsTab
                        org={org}
                        currentUserId={user?.id || ""}
                        onOrgUpdated={refreshOrganizations}
                    />
                )}
            </div>
        </SidebarInset>
    );
}

function StatChip({
    icon: Icon,
    value,
    label,
    accent,
}: {
    icon: any;
    value: number | string;
    label: string;
    accent?: boolean;
}) {
    return (
        <div className="flex items-center gap-1.5">
            <Icon className={`size-3 ${accent ? "text-amber-500" : "text-muted-foreground"}`} />
            <span className={`text-sm font-semibold ${accent ? "text-amber-700 dark:text-amber-400" : "text-foreground"}`}>
                {value}
            </span>
            <span className="text-xs text-muted-foreground">{label}</span>
        </div>
    );
}
