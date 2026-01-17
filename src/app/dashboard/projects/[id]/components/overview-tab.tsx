"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Building2,
    User,
    MapPin,
    Percent,
    DollarSign,
    FolderOpen,
    ListTodo,
    Package,
    Calendar,
} from "lucide-react";
import { ProjectDetails } from "@/types/project-details";

interface OverviewTabProps {
    project: ProjectDetails;
    formatCurrency: (value: number, currency?: string) => string;
}

export function OverviewTab({ project, formatCurrency }: OverviewTabProps) {
    // Calculate totals
    const calculateProjectSubtotal = () => {
        return project.divisions.reduce((total, div) => {
            return total + div.tasks.reduce((taskTotal, task) => {
                return taskTotal + task.lineItems.reduce((itemTotal, item) => itemTotal + Number(item.lineTotal), 0);
            }, 0);
        }, 0);
    };

    const calculateTax = () => {
        return calculateProjectSubtotal() * (Number(project.taxRatePercent) / 100);
    };

    const calculateGrandTotal = () => {
        return calculateProjectSubtotal() + calculateTax();
    };

    const totalDivisions = project.divisions.length;
    const totalTasks = project.divisions.reduce((t, d) => t + d.tasks.length, 0);
    const totalItems = project.divisions.reduce((t, d) =>
        t + d.tasks.reduce((tt, task) => tt + task.lineItems.length, 0), 0
    );

    return (
        <div className="space-y-6">
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

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Work Divisions</CardTitle>
                        <FolderOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalDivisions}</div>
                        <p className="text-xs text-muted-foreground">
                            Sections of work
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tasks</CardTitle>
                        <ListTodo className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalTasks}</div>
                        <p className="text-xs text-muted-foreground">
                            Across all divisions
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Line Items</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalItems}</div>
                        <p className="text-xs text-muted-foreground">
                            Materials, manpower & tools
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* RAB Summary Card */}
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

            {/* Last Updated */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Last updated: {new Date(project.updatedAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                })}</span>
            </div>
        </div>
    );
}
