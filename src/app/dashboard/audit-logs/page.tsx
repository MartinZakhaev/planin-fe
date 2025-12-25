"use client";

import { AuditLog } from "@/types/audit-log";
import { useAuditLogs } from "@/hooks/use-audit-logs";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
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
import { ClipboardList, Clock, Users } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
export default function AuditLogsPage() {
    const { auditLogs, isLoading } = useAuditLogs();

    const columns: ColumnDef<AuditLog>[] = [
        {
            accessorKey: "user.fullName",
            header: "User",
            cell: ({ row }) => row.original.user?.fullName || row.original.userId
        },
        { accessorKey: "action", header: "Action" },
        { accessorKey: "resource", header: "Resource" },
        { accessorKey: "ipAddress", header: "IP Address" },
        {
            accessorKey: "createdAt",
            header: "Timestamp",
            cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
        },
        {
            accessorKey: "details",
            header: "Details",
            cell: ({ row }) => {
                const details = row.original.details;
                return details ? (
                    <pre className="text-xs max-w-[200px] overflow-hidden truncate">
                        {JSON.stringify(details)}
                    </pre>
                ) : "-";
            }
        },
    ];

    return (
        <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Audit Logs</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                            <ClipboardList className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{auditLogs.length}</div>
                            <p className="text-xs text-muted-foreground">Logged actions</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Today's Activity</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {auditLogs.filter(log => new Date(log.createdAt).toDateString() === new Date().toDateString()).length}
                            </div>
                            <p className="text-xs text-muted-foreground">Events logged today</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {new Set(auditLogs.map(log => log.userId)).size}
                            </div>
                            <p className="text-xs text-muted-foreground">Active contributors</p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <div className="space-y-1">
                            <CardTitle>System Audit Logs</CardTitle>
                            <CardDescription>
                                View system activity and history.
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <DataTable columns={columns} data={auditLogs} isLoading={isLoading} />
                    </CardContent>
                </Card>
            </div>
        </SidebarInset>
    );
}
