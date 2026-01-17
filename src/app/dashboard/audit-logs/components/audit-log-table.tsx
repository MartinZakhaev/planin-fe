"use client";

import { AuditLog } from "@/types/audit-log";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Eye } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface AuditLogTableProps {
    auditLogs: AuditLog[];
    isLoading: boolean;
}

function getActionBadgeVariant(action: string): "default" | "secondary" | "destructive" | "outline" {
    const lowerAction = action.toLowerCase();
    if (lowerAction.includes("create") || lowerAction.includes("add")) return "default";
    if (lowerAction.includes("update") || lowerAction.includes("edit")) return "secondary";
    if (lowerAction.includes("delete") || lowerAction.includes("remove")) return "destructive";
    return "outline";
}

export function AuditLogTable({ auditLogs, isLoading }: AuditLogTableProps) {
    const columns: ColumnDef<AuditLog>[] = [
        {
            accessorKey: "user.fullName",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="-ml-4"
                    >
                        User
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const user = row.original.user;
                if (user?.fullName) {
                    return (
                        <div className="flex flex-col">
                            <span className="font-medium">{user.fullName}</span>
                            <span className="text-xs text-muted-foreground">{user.email}</span>
                        </div>
                    );
                }
                return <span className="text-muted-foreground">{row.original.userId || "System"}</span>;
            }
        },
        {
            accessorKey: "action",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="-ml-4"
                    >
                        Action
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <Badge variant={getActionBadgeVariant(row.original.action)}>
                    {row.original.action}
                </Badge>
            ),
        },
        {
            accessorKey: "entityTable",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="-ml-4"
                    >
                        Entity
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => row.original.entityTable || "-",
        },
        {
            accessorKey: "ip",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="-ml-4"
                    >
                        IP Address
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                    {row.original.ip || "-"}
                </code>
            ),
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="-ml-4"
                    >
                        Timestamp
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
        },
        {
            accessorKey: "meta",
            header: "Details",
            cell: ({ row }) => {
                const meta = row.original.meta;
                if (!meta || Object.keys(meta).length === 0) return "-";

                return (
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Audit Log Details</DialogTitle>
                                <DialogDescription>
                                    {row.original.action} - {new Date(row.original.createdAt).toLocaleString()}
                                </DialogDescription>
                            </DialogHeader>
                            <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-[400px] text-xs">
                                {JSON.stringify(meta, null, 2)}
                            </pre>
                        </DialogContent>
                    </Dialog>
                );
            }
        },
    ];

    return (
        <DataTable
            columns={columns}
            data={auditLogs}
            isLoading={isLoading}
            searchPlaceholder="Search logs..."
        />
    );
}
