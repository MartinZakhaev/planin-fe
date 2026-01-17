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
    const calculateItemBreakdown = (): ItemBreakdown[] => {
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
                icon: <Package className="h-5 w-5" />,
                color: "text-blue-600",
                bgColor: "bg-blue-100 dark:bg-blue-950",
                total: breakdown.MATERIAL.total,
                count: breakdown.MATERIAL.count,
            },
            {
                type: "MANPOWER",
                label: "Manpower",
                icon: <Users className="h-5 w-5" />,
                color: "text-green-600",
                bgColor: "bg-green-100 dark:bg-green-950",
                total: breakdown.MANPOWER.total,
                count: breakdown.MANPOWER.count,
            },
            {
                type: "TOOL",
                label: "Tools",
                icon: <Wrench className="h-5 w-5" />,
                color: "text-orange-600",
                bgColor: "bg-orange-100 dark:bg-orange-950",
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
            {/* Cost Breakdown by Type */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <PieChart className="h-5 w-5" />
                        Cost Breakdown by Type
                    </CardTitle>
                    <CardDescription>
                        Distribution of costs across material, manpower, and tools
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {grandTotal === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No items added yet. Add items to see cost breakdown.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {itemBreakdown.map((item) => {
                                const percentage = grandTotal > 0 ? (item.total / grandTotal) * 100 : 0;
                                return (
                                    <div key={item.type} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className={`p-2 rounded-lg ${item.bgColor} ${item.color}`}>
                                                    {item.icon}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{item.label}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {item.count} items
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold">{formatCurrency(item.total, project.currency)}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {percentage.toFixed(1)}%
                                                </p>
                                            </div>
                                        </div>
                                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${item.bgColor} transition-all duration-500`}
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
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Cost by Division
                    </CardTitle>
                    <CardDescription>
                        Budget allocation across work divisions
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {divisionBreakdown.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No divisions added yet. Add divisions to see cost allocation.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {divisionBreakdown.map((div) => {
                                const widthPercentage = maxDivisionTotal > 0 ? (div.total / maxDivisionTotal) * 100 : 0;
                                const sharePercentage = grandTotal > 0 ? (div.total / grandTotal) * 100 : 0;
                                return (
                                    <div key={div.id} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">{div.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {div.taskCount} tasks • {div.itemCount} items
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold">{formatCurrency(div.total, project.currency)}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {sharePercentage.toFixed(1)}% of total
                                                </p>
                                            </div>
                                        </div>
                                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary/70 transition-all duration-500 rounded-full"
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

            {/* Summary Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">Total Material Cost</p>
                        <p className="text-xl font-bold text-blue-600">
                            {formatCurrency(itemBreakdown[0].total, project.currency)}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">Total Manpower Cost</p>
                        <p className="text-xl font-bold text-green-600">
                            {formatCurrency(itemBreakdown[1].total, project.currency)}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">Total Tools Cost</p>
                        <p className="text-xl font-bold text-orange-600">
                            {formatCurrency(itemBreakdown[2].total, project.currency)}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">Grand Total</p>
                        <p className="text-xl font-bold text-primary">
                            {formatCurrency(grandTotal, project.currency)}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
