"use client";

import { useState } from "react";
import { ItemCatalog } from "@/types/item-catalog";
import { useItemCatalogs } from "@/hooks/use-item-catalogs";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, MoreHorizontal, Package, Hammer, Coins } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { ItemCatalogDialog } from "./components/item-catalog-dialog";
import { ActionDialog } from "@/components/action-dialog";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function ItemCatalogsPage() {
    const { itemCatalogs, isLoading, createItemCatalog, updateItemCatalog, deleteItemCatalog, refreshItemCatalogs } = useItemCatalogs();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<ItemCatalog | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const handleCreate = async (data: any) => {
        try {
            await createItemCatalog(data);
            toast.success("Item Catalog created successfully");
            setIsDialogOpen(false);
            refreshItemCatalogs();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleUpdate = async (data: any) => {
        if (!selectedItem) return;
        try {
            await updateItemCatalog(selectedItem.id, data);
            toast.success("Item Catalog updated successfully");
            setIsDialogOpen(false);
            setSelectedItem(null);
            refreshItemCatalogs();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await deleteItemCatalog(deleteId);
            toast.success("Item Catalog deleted successfully");
            setDeleteId(null);
            refreshItemCatalogs();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const columns: ColumnDef<ItemCatalog>[] = [
        {
            accessorKey: "taskCatalog.name",
            header: "Task Group",
            cell: ({ row }) => row.original.taskCatalog?.name || "-"
        },
        { accessorKey: "code", header: "Code" },
        { accessorKey: "name", header: "Name" },
        {
            accessorKey: "type",
            header: "Type",
            cell: ({ row }) => (
                <Badge variant={
                    row.original.type === 'MATERIAL' ? 'default' :
                        row.original.type === 'WAGE' ? 'secondary' :
                            'outline'
                }>
                    {row.original.type}
                </Badge>
            )
        },
        { accessorKey: "unit", header: "Unit" },
        {
            accessorKey: "price",
            header: "Price",
            cell: ({ row }) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(row.original.price)
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => {
                                    setSelectedItem(item);
                                    setIsDialogOpen(true);
                                }}
                            >
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => setDeleteId(item.id)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
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
                            <BreadcrumbPage>Item Catalogs</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{itemCatalogs.length}</div>
                            <p className="text-xs text-muted-foreground">Resources available</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Material vs Labor</CardTitle>
                            <Hammer className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {itemCatalogs.filter(i => i.type === 'MATERIAL').length} / {itemCatalogs.filter(i => i.type === 'WAGE').length}
                            </div>
                            <p className="text-xs text-muted-foreground">Ratio</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avg Price</CardTitle>
                            <Coins className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {itemCatalogs.length > 0
                                    ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(
                                        itemCatalogs.reduce((acc, i) => acc + i.price, 0) / itemCatalogs.length
                                    )
                                    : 0}
                            </div>
                            <p className="text-xs text-muted-foreground">Average resource cost</p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <div className="space-y-1">
                            <CardTitle>Item Catalogs</CardTitle>
                            <CardDescription>
                                Manage master resources (Materials, Wages, Tools, Sub-works).
                            </CardDescription>
                        </div>
                        <Button onClick={() => { setSelectedItem(null); setIsDialogOpen(true); }}>
                            <Plus className="mr-2 h-4 w-4" /> Add Item
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <DataTable columns={columns} data={itemCatalogs} isLoading={isLoading} />
                    </CardContent>
                </Card>

                <ItemCatalogDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    itemCatalog={selectedItem}
                    onSubmit={selectedItem ? handleUpdate : handleCreate}
                />

                <ActionDialog
                    open={!!deleteId}
                    onOpenChange={(open) => !open && setDeleteId(null)}
                    title="Delete Item"
                    description="Are you sure? This resource might be used in projects."
                    onConfirm={handleDelete}
                    confirmLabel="Delete"
                    isLoading={false}
                    type="warning"
                    variant="destructive"
                />
            </div>
        </SidebarInset>
    );
}
