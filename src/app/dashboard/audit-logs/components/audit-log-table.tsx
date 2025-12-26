"use client";

import { AuditLog } from "@/types/audit-log";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

interface AuditLogTableProps {
    auditLogs: AuditLog[];
    isLoading: boolean;
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
            cell: ({ row }) => row.original.user?.fullName || row.original.userId
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
        },
        {
            accessorKey: "resource",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="-ml-4"
                    >
                        Resource
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
        },
        {
            accessorKey: "ipAddress",
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
        <DataTable
            columns={columns}
            data={auditLogs}
            isLoading={isLoading}
            searchPlaceholder="Search logs..."
        />
    );
}
