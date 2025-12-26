"use client";

import { useState } from "react";
import { ItemCatalog } from "@/types/item-catalog";
import { DataTable, createSelectColumn } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ArrowUpDown, MoreHorizontal, AlertTriangle } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ActionDialog } from "@/components/action-dialog";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

interface ItemCatalogTableProps {
    itemCatalogs: ItemCatalog[];
    units: { id: string; name: string; code: string }[];
    isLoading: boolean;
    onEdit: (item: ItemCatalog) => void;
    onDelete: (id: string) => void;
    onSelectionChange?: (selectedItems: ItemCatalog[]) => void;
}

export function ItemCatalogTable({ itemCatalogs, units, isLoading, onEdit, onDelete, onSelectionChange }: ItemCatalogTableProps) {
    const [deleteItem, setDeleteItem] = useState<ItemCatalog | null>(null);

    const columns: ColumnDef<ItemCatalog>[] = [
        createSelectColumn<ItemCatalog>(),
        {
            accessorKey: "code",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="-ml-4"
                    >
                        Code
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
        },
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="-ml-4"
                    >
                        Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
        },
        {
            accessorKey: "type",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="-ml-4"
                    >
                        Type
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <Badge variant={
                    row.original.type === 'MATERIAL' ? 'default' :
                        row.original.type === 'MANPOWER' ? 'secondary' :
                            'outline'
                }>
                    {row.original.type}
                </Badge>
            )
        },
        {
            accessorKey: "unitId",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="-ml-4"
                    >
                        Unit
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const uId = row.original.unitId;
                const unit = units.find(u => u.id === uId);
                return unit ? `${unit.code}` : "N/A";
            }
        },
        {
            accessorKey: "defaultPrice",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="-ml-4"
                    >
                        Price
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(row.original.defaultPrice)
        },
        {
            id: "actions",
            header: () => <span className="text-right">Actions</span>,
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <div className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => onEdit(item)}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setDeleteItem(item)}
                                    className="text-destructive focus:text-destructive"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
            enableHiding: false,
        },
    ];

    return (
        <>
            <DataTable
                columns={columns}
                data={itemCatalogs}
                isLoading={isLoading}
                searchPlaceholder="Search item catalogs..."
                onRowSelectionChange={onSelectionChange}
            />

            <ActionDialog
                open={!!deleteItem}
                onOpenChange={(open) => !open && setDeleteItem(null)}
                type="warning"
                title="Delete Item Catalog?"
                description={
                    deleteItem ? (
                        <>
                            This action cannot be undone. This will permanently delete the item{' '}
                            <span className="font-medium">{deleteItem.name}</span>.
                        </>
                    ) : undefined
                }
                onConfirm={() => {
                    if (deleteItem) {
                        onDelete(deleteItem.id);
                        setDeleteItem(null);
                    }
                }}
                confirmLabel="Delete"
                icon={<AlertTriangle className="h-6 w-6 text-destructive" />}
                iconPosition="left"
            />
        </>
    );
}
