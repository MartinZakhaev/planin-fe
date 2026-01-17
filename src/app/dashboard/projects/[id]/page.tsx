"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProjectDetails } from "@/types/project-details";
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
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    ArrowLeft,
    LayoutDashboard,
    BarChart3,
    List,
} from "lucide-react";
import { apiFetch } from "@/lib/api-fetch";
import Link from "next/link";
import { OverviewTab } from "./components/overview-tab";
import { StatisticsTab } from "./components/statistics-tab";
import { DetailsTab } from "./components/details-tab";

const formatCurrency = (value: number, currency: string = "IDR") => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 0,
    }).format(value);
};

export default function ProjectDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [project, setProject] = useState<ProjectDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("overview");

    const fetchProject = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await apiFetch<ProjectDetails>(`/projects/${params.id}`);
            setProject(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || "Failed to load project");
        } finally {
            setIsLoading(false);
        }
    }, [params.id]);

    useEffect(() => {
        if (params.id) {
            fetchProject();
        }
    }, [params.id, fetchProject]);

    const handleRefresh = useCallback(() => {
        fetchProject();
    }, [fetchProject]);

    if (isLoading) {
        return (
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                    <Skeleton className="h-4 w-48" />
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </SidebarInset>
        );
    }

    if (error || !project) {
        return (
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                    <span className="text-destructive">Error loading project</span>
                </header>
                <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
                    <p className="text-muted-foreground">{error || "Project not found"}</p>
                    <Button onClick={() => router.push("/dashboard/projects")}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Projects
                    </Button>
                </div>
            </SidebarInset>
        );
    }

    return (
        <SidebarInset>
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
                            <BreadcrumbLink href="/dashboard/projects">Projects</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{project.name}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </header>

            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                {/* Navigation Row: Back Button + Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/dashboard/projects">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Projects
                            </Link>
                        </Button>
                        <TabsList className="grid w-full max-w-md grid-cols-3">
                            <TabsTrigger value="overview" className="flex items-center gap-2">
                                <LayoutDashboard className="h-4 w-4" />
                                <span className="hidden sm:inline">Overview</span>
                            </TabsTrigger>
                            <TabsTrigger value="statistics" className="flex items-center gap-2">
                                <BarChart3 className="h-4 w-4" />
                                <span className="hidden sm:inline">Statistics</span>
                            </TabsTrigger>
                            <TabsTrigger value="details" className="flex items-center gap-2">
                                <List className="h-4 w-4" />
                                <span className="hidden sm:inline">Details</span>
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="overview" className="mt-6">
                        <OverviewTab project={project} formatCurrency={formatCurrency} />
                    </TabsContent>

                    <TabsContent value="statistics" className="mt-6">
                        <StatisticsTab project={project} formatCurrency={formatCurrency} />
                    </TabsContent>

                    <TabsContent value="details" className="mt-6">
                        <DetailsTab
                            project={project}
                            formatCurrency={formatCurrency}
                            onRefresh={handleRefresh}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </SidebarInset>
    );
}
