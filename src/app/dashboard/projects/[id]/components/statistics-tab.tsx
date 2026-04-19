"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ProjectDetails } from "@/types/project-details";
import { Package, Users, Wrench, PieChart, TrendingUp } from "lucide-react";

interface StatisticsTabProps {
    project: ProjectDetails;
    formatCurrency: (value: number, currency?: string) => string;
}

interface ItemBreakdown {
    type: string;
    label: string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    total: number;
    count: number;
}

export function StatisticsTab({ project, formatCurrency }: StatisticsTabProps) {
    // Calculate breakdown by item type
    const calculateItemBreakdown = (): ItemBreakdown & { barColor: string }[] => {
        const breakdown = {
            MATERIAL: { total: 0, count: 0 },
            MANPOWER: { total: 0, count: 0 },
            TOOL: { total: 0, count: 0 },
        };

        project.divisions.forEach(div => {
            div.tasks.forEach(task => {
                task.lineItems.forEach(item => {
                    if (item.itemCatalog) {
                        const type = item.itemCatalog.type as keyof typeof breakdown;
                        if (breakdown[type]) {
                            breakdown[type].total += Number(item.lineTotal);
                            breakdown[type].count += 1;
                        }
                    }
                });
            });
        });

        return [
            {
                type: "MATERIAL",
                label: "Material",
                icon: <Package className="size-4" />,
                color: "text-blue-600 dark:text-blue-400",
                bgColor: "bg-blue-50 dark:bg-blue-500/10",
                barColor: "bg-blue-500 dark:bg-blue-600",
                total: breakdown.MATERIAL.total,
                count: breakdown.MATERIAL.count,
            },
            {
                type: "MANPOWER",
                label: "Manpower",
                icon: <Users className="size-4" />,
                color: "text-emerald-600 dark:text-emerald-400",
                bgColor: "bg-emerald-50 dark:bg-emerald-500/10",
                barColor: "bg-emerald-500 dark:bg-emerald-600",
                total: breakdown.MANPOWER.total,
                count: breakdown.MANPOWER.count,
            },
            {
                type: "TOOL",
                label: "Tools",
                icon: <Wrench className="size-4" />,
                color: "text-amber-600 dark:text-amber-400",
                bgColor: "bg-amber-50 dark:bg-amber-500/10",
                barColor: "bg-amber-500 dark:bg-amber-600",
                total: breakdown.TOOL.total,
                count: breakdown.TOOL.count,
            },
        ];
    };

    // Calculate division breakdown
    const calculateDivisionBreakdown = () => {
        return project.divisions.map(div => {
            const total = div.tasks.reduce((taskTotal, task) => {
                return taskTotal + task.lineItems.reduce((itemTotal, item) => itemTotal + Number(item.lineTotal), 0);
            }, 0);
            return {
                id: div.id,
                name: div.displayName,
                code: div.division.code,
                total,
                taskCount: div.tasks.length,
                itemCount: div.tasks.reduce((c, t) => c + t.lineItems.length, 0),
            };
        }).sort((a, b) => b.total - a.total);
    };

    const itemBreakdown = calculateItemBreakdown();
    const divisionBreakdown = calculateDivisionBreakdown();
    const grandTotal = itemBreakdown.reduce((t, i) => t + i.total, 0);
    const maxDivisionTotal = Math.max(...divisionBreakdown.map(d => d.total), 1);

    return (
        <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                    <CardContent className="p-5 flex flex-col gap-1.5">
                        <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 truncate">Total Material Cost</p>
                        <p className="text-2xl font-semibold font-mono tracking-tight text-slate-900 dark:text-slate-100 truncate">
                            {formatCurrency(itemBreakdown[0].total, project.currency)}
                        </p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                    <CardContent className="p-5 flex flex-col gap-1.5">
                        <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 truncate">Total Manpower Cost</p>
                        <p className="text-2xl font-semibold font-mono tracking-tight text-slate-900 dark:text-slate-100 truncate">
                            {formatCurrency(itemBreakdown[1].total, project.currency)}
                        </p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                    <CardContent className="p-5 flex flex-col gap-1.5">
                        <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 truncate">Total Tools Cost</p>
                        <p className="text-2xl font-semibold font-mono tracking-tight text-slate-900 dark:text-slate-100 truncate">
                            {formatCurrency(itemBreakdown[2].total, project.currency)}
                        </p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
                    <CardContent className="p-5 flex flex-col gap-1.5">
                        <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 truncate">Grand Total</p>
                        <p className="text-2xl font-semibold font-mono tracking-tight text-primary truncate">
                            {formatCurrency(grandTotal, project.currency)}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Cost Breakdown by Type */}
            <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                <CardHeader className="border-b border-slate-100 dark:border-slate-800/50 pb-4">
                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                        <PieChart className="size-4 text-slate-500" />
                        Cost Breakdown by Type
                    </CardTitle>
                    <CardDescription className="text-xs">
                        Distribution of costs across material, manpower, and tools
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    {grandTotal === 0 ? (
                        <div className="text-center py-8 text-sm text-slate-500">
                            No items added yet. Add items to see cost breakdown.
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {itemBreakdown.map((item) => {
                                const percentage = grandTotal > 0 ? (item.total / grandTotal) * 100 : 0;
                                return (
                                    <div key={item.type} className="space-y-2.5">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-md ${item.bgColor} ${item.color} shadow-sm border border-slate-100 dark:border-slate-800/50`}>
                                                    {item.icon}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.label}</p>
                                                    <p className="text-xs text-slate-500">
                                                        {item.count} items
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-semibold font-mono text-slate-900 dark:text-slate-100">{formatCurrency(item.total, project.currency)}</p>
                                                <p className="text-xs font-medium text-slate-500">
                                                    {percentage.toFixed(1)}%
                                                </p>
                                            </div>
                                        </div>
                                        <div className="h-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${item.barColor} transition-all duration-500`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Division Breakdown */}
            <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                <CardHeader className="border-b border-slate-100 dark:border-slate-800/50 pb-4">
                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                        <TrendingUp className="size-4 text-slate-500" />
                        Cost by Division
                    </CardTitle>
                    <CardDescription className="text-xs">
                        Budget allocation across work divisions
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    {divisionBreakdown.length === 0 ? (
                        <div className="text-center py-8 text-sm text-slate-500">
                            No divisions added yet. Add divisions to see cost allocation.
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {divisionBreakdown.map((div) => {
                                const widthPercentage = maxDivisionTotal > 0 ? (div.total / maxDivisionTotal) * 100 : 0;
                                const sharePercentage = grandTotal > 0 ? (div.total / grandTotal) * 100 : 0;
                                return (
                                    <div key={div.id} className="space-y-2.5">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{div.name}</p>
                                                <p className="text-xs text-slate-500">
                                                    {div.taskCount} tasks • {div.itemCount} items
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-semibold font-mono text-slate-900 dark:text-slate-100">{formatCurrency(div.total, project.currency)}</p>
                                                <p className="text-xs font-medium text-slate-500">
                                                    {sharePercentage.toFixed(1)}% of total
                                                </p>
                                            </div>
                                        </div>
                                        <div className="h-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-slate-800 dark:bg-slate-300 transition-all duration-500 rounded-full"
                                                style={{ width: `${widthPercentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
