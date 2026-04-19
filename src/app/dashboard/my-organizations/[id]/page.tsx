"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OverviewTab } from "./components/overview-tab";
import { MembersTab } from "./components/members-tab";
import { SettingsTab } from "./components/settings-tab";
import { Loader2, Building2, Crown, Users, Settings, BarChart3, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function OrgDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { user } = useAuth();
    const router = useRouter();
    const { organizations, isLoading: orgsLoading, refreshOrganizations } = useOrganizations();
    const { members, isLoading: membersLoading } = useOrgMembers(id);

    const org = organizations.find(o => o.id === id);
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
                        <p className="text-sm text-muted-foreground mt-1">This organization doesn't exist or you don't have access.</p>
                    </div>
                    <Button variant="outline" asChild className="gap-2">
                        <Link href="/dashboard/my-organizations">
                            <ArrowLeft className="size-4" />
                            Back to My Organizations
                        </Link>
                    </Button>
                </div>
            </SidebarInset>
        );
    }

    return (
        <SidebarInset>
            {/* Header */}
            <header className="flex h-16 shrink-0 items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
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
                            <BreadcrumbPage className="max-w-[200px] truncate">{org.name}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </header>

            <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
                {/* Org identity header */}
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                            <Building2 className="size-6" />
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-xl font-semibold leading-tight truncate">{org.name}</h1>
                                {isOwner ? (
                                    <Badge variant="default" className="gap-1 text-xs shrink-0">
                                        <Crown className="size-3" />
                                        Owner
                                    </Badge>
                                ) : (
                                    <Badge variant="secondary" className="text-xs shrink-0">Member</Badge>
                                )}
                                {org.code && (
                                    <Badge variant="outline" className="font-mono text-xs shrink-0">{org.code}</Badge>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-0.5">
                                {org.memberCount ?? members.length} member{(org.memberCount ?? members.length) !== 1 ? "s" : ""} ·{" "}
                                {org.projectCount ?? 0} project{(org.projectCount ?? 0) !== 1 ? "s" : ""}
                            </p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" asChild className="shrink-0 gap-2">
                        <Link href="/dashboard/my-organizations">
                            <ArrowLeft className="size-4" />
                            Back
                        </Link>
                    </Button>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="overview" className="flex-1">
                    <TabsList className="mb-4">
                        <TabsTrigger value="overview" className="gap-1.5">
                            <BarChart3 className="size-3.5" />
                            Overview
                        </TabsTrigger>
                        <TabsTrigger value="members" className="gap-1.5">
                            <Users className="size-3.5" />
                            Members
                            {members.length > 0 && (
                                <Badge variant="secondary" className="text-xs h-4 px-1 ml-0.5">{members.length}</Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="gap-1.5">
                            <Settings className="size-3.5" />
                            Settings
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-0">
                        <OverviewTab org={org} members={members} currentUserId={user?.id || ""} />
                    </TabsContent>
                    <TabsContent value="members" className="mt-0">
                        <MembersTab org={org} currentUserId={user?.id || ""} />
                    </TabsContent>
                    <TabsContent value="settings" className="mt-0">
                        <SettingsTab org={org} currentUserId={user?.id || ""} onOrgUpdated={refreshOrganizations} />
                    </TabsContent>
                </Tabs>
            </div>
        </SidebarInset>
    );
}
