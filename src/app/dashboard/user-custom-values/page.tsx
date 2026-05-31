"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ClipboardList, History, Package, Users } from "lucide-react";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePersonalCatalogSummary } from "@/hooks/use-personal-catalog-summary";
import { PersonalCatalogUserSummary } from "@/types/personal-catalog-summary";

type CustomValueRow = {
    id: string;
    ownerName: string;
    ownerEmail: string;
    kind: "TASK" | "ITEM" | "DIVISION";
    code: string;
    name: string;
    context: string;
    createdAt: string;
};

type SortableColumn = {
    toggleSorting: (desc?: boolean) => void;
    getIsSorted: () => false | "asc" | "desc";
};

function SortableHeader({ column, title }: { column: SortableColumn; title: string }) {
    return (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4"
        >
            {title}
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    );
}

function sortableHeader(title: string) {
    const Header = ({ column }: { column: SortableColumn }) => (
        <SortableHeader column={column} title={title} />
    );
    Header.displayName = `${title}SortableHeader`;
    return Header;
}

function formatDate(value: string) {
    return new Date(value).toLocaleString();
}

function formatUserName(user: PersonalCatalogUserSummary["user"]) {
    return user.fullName || user.email;
}

export default function UserCustomValuesPage() {
    const { summary, isLoading } = usePersonalCatalogSummary();
    const safeSummary = summary ?? {
        totals: {
            users: 0,
            taskCatalogs: 0,
            itemCatalogs: 0,
            workDivisions: 0,
            total: 0,
        },
        users: [],
        recentAuditLogs: [],
    };

    const customValueRows = useMemo<CustomValueRow[]>(() => {
        return safeSummary.users.flatMap((entry) => {
            const ownerName = formatUserName(entry.user);
            const ownerEmail = entry.user.email;

            const taskRows = entry.taskCatalogs.map((task) => ({
                id: task.id,
                ownerName,
                ownerEmail,
                kind: "TASK" as const,
                code: task.code,
                name: task.name,
                context: task.division ? `${task.division.code} - ${task.division.name}` : "No division",
                createdAt: task.createdAt,
            }));

            const itemRows = entry.itemCatalogs.map((item) => ({
                id: item.id,
                ownerName,
                ownerEmail,
                kind: "ITEM" as const,
                code: item.code,
                name: item.name,
                context: `${item.type}${item.unit ? ` · ${item.unit.code} - ${item.unit.name}` : ""}`,
                createdAt: item.createdAt,
            }));

            return [...taskRows, ...itemRows];
        });
    }, [safeSummary.users]);

    const userColumns = useMemo<ColumnDef<PersonalCatalogUserSummary>[]>(() => [
        {
            accessorKey: "user.email",
            header: sortableHeader("User"),
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-medium">{formatUserName(row.original.user)}</span>
                    <span className="text-xs text-muted-foreground">{row.original.user.email}</span>
                </div>
            ),
        },
        {
            accessorKey: "counts.total",
            header: sortableHeader("Custom Values"),
            cell: ({ row }) => <span className="font-medium tabular-nums">{row.original.counts.total}</span>,
        },
        {
            accessorKey: "counts.taskCatalogs",
            header: sortableHeader("Tasks"),
            cell: ({ row }) => <span className="tabular-nums">{row.original.counts.taskCatalogs}</span>,
        },
        {
            accessorKey: "counts.itemCatalogs",
            header: sortableHeader("Items"),
            cell: ({ row }) => <span className="tabular-nums">{row.original.counts.itemCatalogs}</span>,
        },
        {
            accessorKey: "counts.workDivisions",
            header: sortableHeader("Divisions"),
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <span className="tabular-nums">{row.original.counts.workDivisions}</span>
                    <Badge variant="outline">Ready</Badge>
                </div>
            ),
        },
    ], []);

    const customValueColumns = useMemo<ColumnDef<CustomValueRow>[]>(() => [
        {
            accessorKey: "kind",
            header: sortableHeader("Type"),
            cell: ({ row }) => (
                <Badge variant={row.original.kind === "ITEM" ? "secondary" : "default"}>
                    {row.original.kind}
                </Badge>
            ),
        },
        {
            accessorKey: "code",
            header: sortableHeader("Code"),
            cell: ({ row }) => <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{row.original.code}</code>,
        },
        {
            accessorKey: "name",
            header: sortableHeader("Name"),
            cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
        },
        {
            accessorKey: "ownerEmail",
            header: sortableHeader("Owner"),
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-medium">{row.original.ownerName}</span>
                    <span className="text-xs text-muted-foreground">{row.original.ownerEmail}</span>
                </div>
            ),
        },
        {
            accessorKey: "context",
            header: sortableHeader("Context"),
            cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.context}</span>,
        },
        {
            accessorKey: "createdAt",
            header: sortableHeader("Created"),
            cell: ({ row }) => formatDate(row.original.createdAt),
        },
    ], []);

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
                            <BreadcrumbPage>User Custom Values</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </header>

            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{safeSummary.totals.users}</div>
                            <p className="text-xs text-muted-foreground">With personal values</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Custom Values</CardTitle>
                            <ClipboardList className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{safeSummary.totals.total}</div>
                            <p className="text-xs text-muted-foreground">Personal task/item records</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Personal Tasks</CardTitle>
                            <ClipboardList className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{safeSummary.totals.taskCatalogs}</div>
                            <p className="text-xs text-muted-foreground">User-scoped task catalogs</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Personal Items</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{safeSummary.totals.itemCatalogs}</div>
                            <p className="text-xs text-muted-foreground">User-scoped item catalogs</p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>User Custom Values</CardTitle>
                        <CardDescription>
                            Review personal task and item catalog values created by each user. Division-level personal values can appear here once that scope exists.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="values" className="gap-4">
                            <TabsList className="grid w-full max-w-md grid-cols-3">
                                <TabsTrigger value="values">Values</TabsTrigger>
                                <TabsTrigger value="users">Users</TabsTrigger>
                                <TabsTrigger value="audit">Audit</TabsTrigger>
                            </TabsList>

                            <TabsContent value="values" className="mt-4">
                                <DataTable
                                    columns={customValueColumns}
                                    data={customValueRows}
                                    isLoading={isLoading}
                                    searchPlaceholder="Search custom values..."
                                />
                            </TabsContent>

                            <TabsContent value="users" className="mt-4">
                                <DataTable
                                    columns={userColumns}
                                    data={safeSummary.users}
                                    isLoading={isLoading}
                                    searchPlaceholder="Search users..."
                                />
                            </TabsContent>

                            <TabsContent value="audit" className="mt-4">
                                <div className="rounded-md border">
                                    {isLoading ? (
                                        <div className="p-6 text-sm text-muted-foreground">Loading...</div>
                                    ) : safeSummary.recentAuditLogs.length === 0 ? (
                                        <div className="p-6 text-sm text-muted-foreground">No catalog audit activity yet.</div>
                                    ) : (
                                        <div className="divide-y">
                                            {safeSummary.recentAuditLogs.map((log) => (
                                                <div key={log.id} className="flex items-start justify-between gap-4 p-4">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="outline">{log.action}</Badge>
                                                            <span className="text-sm font-medium">{log.entityTable}</span>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">
                                                            {log.user?.fullName || log.user?.email || log.userId || "System"}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <History className="h-4 w-4" />
                                                        {formatDate(log.createdAt)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </SidebarInset>
    );
}
