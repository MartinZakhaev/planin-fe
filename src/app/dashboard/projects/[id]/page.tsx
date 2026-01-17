"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProjectDetails, ProjectDivision, ProjectTask, TaskLineItem } from "@/types/project-details";
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
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    ArrowLeft,
    MapPin,
    Building2,
    User,
    Calendar,
    Percent,
    DollarSign,
    Package,
    Wrench,
    Users,
} from "lucide-react";
import { apiFetch } from "@/lib/api-fetch";
import Link from "next/link";

const formatCurrency = (value: number, currency: string = "IDR") => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 0,
    }).format(value);
};

const getItemTypeIcon = (type: string) => {
    switch (type) {
        case "MATERIAL":
            return <Package className="h-4 w-4" />;
        case "MANPOWER":
            return <Users className="h-4 w-4" />;
        case "TOOL":
            return <Wrench className="h-4 w-4" />;
        default:
            return <Package className="h-4 w-4" />;
    }
};

const getItemTypeBadgeColor = (type: string) => {
    switch (type) {
        case "MATERIAL":
            return "bg-blue-100 text-blue-800";
        case "MANPOWER":
            return "bg-green-100 text-green-800";
        case "TOOL":
            return "bg-orange-100 text-orange-800";
        default:
            return "";
    }
};

export default function ProjectDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [project, setProject] = useState<ProjectDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                setIsLoading(true);
                const data = await apiFetch<ProjectDetails>(`/projects/${params.id}`);
                setProject(data);
            } catch (err: any) {
                setError(err.message || "Failed to load project");
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) {
            fetchProject();
        }
    }, [params.id]);

    // Calculate totals
    const calculateDivisionTotal = (division: ProjectDivision) => {
        return division.tasks.reduce((taskTotal, task) => {
            return taskTotal + task.lineItems.reduce((itemTotal, item) => itemTotal + Number(item.lineTotal), 0);
        }, 0);
    };

    const calculateProjectSubtotal = () => {
        if (!project) return 0;
        return project.divisions.reduce((total, div) => total + Number(calculateDivisionTotal(div)), 0);
    };

    const calculateTax = () => {
        if (!project) return 0;
        return calculateProjectSubtotal() * (Number(project.taxRatePercent) / 100);
    };

    const calculateGrandTotal = () => {
        return calculateProjectSubtotal() + calculateTax();
    };

    if (isLoading) {
        return (
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Skeleton className="h-4 w-48" />
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
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
                    <Separator orientation="vertical" className="mr-2 h-4" />
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
                <Separator orientation="vertical" className="mr-2 h-4" />
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
                {/* Back Button */}
                <div>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/dashboard/projects">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Projects
                        </Link>
                    </Button>
                </div>

                {/* Project Info Card */}
                <Card>
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div>
                                <CardTitle className="text-2xl">{project.name}</CardTitle>
                                {project.code && (
                                    <Badge variant="outline" className="mt-1">{project.code}</Badge>
                                )}
                                {project.description && (
                                    <CardDescription className="mt-2">{project.description}</CardDescription>
                                )}
                            </div>
                            <Badge variant="secondary" className="text-lg">{project.currency}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-4">
                            <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{project.organization.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{project.owner.fullName}</span>
                            </div>
                            {project.location && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{project.location}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <Percent className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">Tax: {project.taxRatePercent}%</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Summary Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5" />
                            RAB Summary
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="rounded-lg bg-muted p-4">
                                <p className="text-sm text-muted-foreground">Subtotal</p>
                                <p className="text-2xl font-bold">{formatCurrency(calculateProjectSubtotal(), project.currency)}</p>
                            </div>
                            <div className="rounded-lg bg-muted p-4">
                                <p className="text-sm text-muted-foreground">Tax ({project.taxRatePercent}%)</p>
                                <p className="text-2xl font-bold">{formatCurrency(calculateTax(), project.currency)}</p>
                            </div>
                            <div className="rounded-lg bg-primary/10 p-4">
                                <p className="text-sm text-muted-foreground">Grand Total</p>
                                <p className="text-2xl font-bold text-primary">{formatCurrency(calculateGrandTotal(), project.currency)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Divisions & Tasks */}
                <Card>
                    <CardHeader>
                        <CardTitle>Work Divisions & Tasks</CardTitle>
                        <CardDescription>
                            {project.divisions.length} divisions, {project.divisions.reduce((t, d) => t + d.tasks.length, 0)} tasks
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {project.divisions.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">No divisions added yet.</p>
                        ) : (
                            <Accordion type="multiple" className="w-full">
                                {project.divisions.map((division) => (
                                    <AccordionItem key={division.id} value={division.id}>
                                        <AccordionTrigger className="hover:no-underline">
                                            <div className="flex items-center justify-between w-full pr-4">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline">{division.division.code}</Badge>
                                                    <span>{division.displayName}</span>
                                                </div>
                                                <span className="text-sm font-medium">
                                                    {formatCurrency(calculateDivisionTotal(division), project.currency)}
                                                </span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            {division.tasks.length === 0 ? (
                                                <p className="text-sm text-muted-foreground pl-4">No tasks in this division.</p>
                                            ) : (
                                                <div className="space-y-4 pl-4">
                                                    {division.tasks.map((task) => (
                                                        <div key={task.id} className="border rounded-lg p-4">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <h4 className="font-medium">{task.displayName}</h4>
                                                                <span className="text-sm font-medium">
                                                                    {formatCurrency(
                                                                        task.lineItems.reduce((t, i) => t + Number(i.lineTotal), 0),
                                                                        project.currency
                                                                    )}
                                                                </span>
                                                            </div>
                                                            {task.lineItems.length > 0 && (
                                                                <Table>
                                                                    <TableHeader>
                                                                        <TableRow>
                                                                            <TableHead>Item</TableHead>
                                                                            <TableHead>Type</TableHead>
                                                                            <TableHead className="text-right">Qty</TableHead>
                                                                            <TableHead className="text-right">Unit Price</TableHead>
                                                                            <TableHead className="text-right">Total</TableHead>
                                                                        </TableRow>
                                                                    </TableHeader>
                                                                    <TableBody>
                                                                        {task.lineItems.map((item) => (
                                                                            <TableRow key={item.id}>
                                                                                <TableCell>
                                                                                    <div>
                                                                                        <div className="font-medium">
                                                                                            {item.itemCatalog?.name || item.description}
                                                                                        </div>
                                                                                        {item.description && item.itemCatalog && (
                                                                                            <div className="text-xs text-muted-foreground">
                                                                                                {item.description}
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    {item.itemCatalog && (
                                                                                        <Badge className={getItemTypeBadgeColor(item.itemCatalog.type)}>
                                                                                            {getItemTypeIcon(item.itemCatalog.type)}
                                                                                            <span className="ml-1">{item.itemCatalog.type}</span>
                                                                                        </Badge>
                                                                                    )}
                                                                                </TableCell>
                                                                                <TableCell className="text-right">
                                                                                    {item.quantity} {item.unit?.code}
                                                                                </TableCell>
                                                                                <TableCell className="text-right">
                                                                                    {formatCurrency(Number(item.unitPrice), project.currency)}
                                                                                </TableCell>
                                                                                <TableCell className="text-right font-medium">
                                                                                    {formatCurrency(Number(item.lineTotal), project.currency)}
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                    </TableBody>
                                                                </Table>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        )}
                    </CardContent>
                </Card>
            </div>
        </SidebarInset>
    );
}
