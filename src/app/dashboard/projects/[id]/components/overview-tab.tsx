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
    Banknote,
    FolderOpen,
    ListTodo,
    Package,
    Calendar,
} from "lucide-react";
import { ProjectDetails } from "@/types/project-details";
import { ExportPdfButton } from "./export-pdf-button";

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
            <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle className="text-2xl font-semibold tracking-tight">{project.name}</CardTitle>
                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                {project.code && (
                                    <Badge variant="outline" className="font-mono">{project.code}</Badge>
                                )}
                                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                                    <Calendar className="size-3.5" />
                                    Updated {new Date(project.updatedAt).toLocaleDateString("id-ID", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                            </div>
                            {project.description && (
                                <CardDescription className="mt-3 text-sm leading-relaxed max-w-2xl text-slate-600 dark:text-slate-400">{project.description}</CardDescription>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge variant="secondary" className="px-3 py-1 font-mono tracking-tight text-sm font-semibold">{project.currency}</Badge>
                            <ExportPdfButton project={project} formatCurrency={formatCurrency} />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-x-6 gap-y-4 md:grid-cols-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2.5">
                            <Building2 className="size-4 max-w-fit shrink-0 text-slate-400" />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{project.organization.name}</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <User className="size-4 max-w-fit shrink-0 text-slate-400" />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{project.owner.fullName}</span>
                        </div>
                        {project.location && (
                            <div className="flex items-center gap-2.5">
                                <MapPin className="size-4 max-w-fit shrink-0 text-slate-400" />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{project.location}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2.5">
                            <Percent className="size-4 max-w-fit shrink-0 text-slate-400" />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">Tax: <span className="font-mono">{project.taxRatePercent}%</span></span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Work Divisions</CardTitle>
                        <FolderOpen className="size-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-semibold font-mono tracking-tight text-slate-900 dark:text-slate-100">{totalDivisions}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Sections of work
                        </p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Tasks</CardTitle>
                        <ListTodo className="size-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-semibold font-mono tracking-tight text-slate-900 dark:text-slate-100">{totalTasks}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Across all divisions
                        </p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Line Items</CardTitle>
                        <Package className="size-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-semibold font-mono tracking-tight text-slate-900 dark:text-slate-100">{totalItems}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Materials, manpower & tools
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* RAB Summary Card */}
            <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                <CardHeader className="border-b border-slate-100 dark:border-slate-800/50 pb-4">
                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                        <Banknote className="size-4 text-slate-500" />
                        RAB Summary
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-5 border border-slate-100 dark:border-slate-800">
                            <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 mb-1.5">Subtotal</p>
                            <p className="text-2xl font-semibold font-mono tracking-tight text-slate-900 dark:text-slate-100">{formatCurrency(calculateProjectSubtotal(), project.currency)}</p>
                        </div>
                        <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-5 border border-slate-100 dark:border-slate-800">
                            <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 mb-1.5">Tax ({project.taxRatePercent}%)</p>
                            <p className="text-2xl font-semibold font-mono tracking-tight text-slate-900 dark:text-slate-100">{formatCurrency(calculateTax(), project.currency)}</p>
                        </div>
                        <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-5 border border-blue-100 dark:border-blue-900/50">
                            <p className="text-[11px] uppercase tracking-wider font-semibold text-blue-600 dark:text-blue-400 mb-1.5">Grand Total</p>
                            <p className="text-2xl font-semibold font-mono tracking-tight text-blue-700 dark:text-blue-400">{formatCurrency(calculateGrandTotal(), project.currency)}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
