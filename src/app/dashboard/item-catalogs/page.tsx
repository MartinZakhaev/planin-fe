"use client";

import { useState } from "react";
import { ItemCatalog } from "@/types/item-catalog";
import { useItemCatalogs } from "@/hooks/use-item-catalogs";
import { useUnits } from "@/hooks/use-units";
import { Plus, Pencil, Trash2, MoreHorizontal, Package, Hammer, Coins, AlertTriangle, ArrowUpDown } from "lucide-react";
import { DataTable, createSelectColumn } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
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
import { ActionDialog } from "@/components/action-dialog";
import { ItemCatalogTable } from "./components/item-catalog-table";
import { ItemCatalogDialog } from "./components/item-catalog-dialog";
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
    const { units } = useUnits();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<ItemCatalog | null>(null);
    const [selectedItems, setSelectedItems] = useState<ItemCatalog[]>([]);

    const [showBulkDelete, setShowBulkDelete] = useState(false);
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);

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



    const handleBulkDelete = async () => {
        setIsBulkDeleting(true);
        try {
            for (const item of selectedItems) {
                await deleteItemCatalog(item.id);
            }
            toast.success(`${selectedItems.length} items deleted successfully`);
            setSelectedItems([]);
            setShowBulkDelete(false);
            refreshItemCatalogs();
        } catch (error: any) {
            toast.error("Failed to delete some items");
        } finally {
            setIsBulkDeleting(false);
        }
    };

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
                                {itemCatalogs.filter(i => i.type === 'MATERIAL').length} / {itemCatalogs.filter(i => i.type === 'MANPOWER').length}
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
                                        itemCatalogs.reduce((acc, i) => acc + Number(i.defaultPrice), 0) / itemCatalogs.length
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

                        <div className="flex items-center gap-2">
                            {selectedItems.length > 0 && (
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => setShowBulkDelete(true)}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete ({selectedItems.length})
                                </Button>
                            )}
                            <Button onClick={() => { setSelectedItem(null); setIsDialogOpen(true); }}>
                                <Plus className="mr-2 h-4 w-4" /> Add Item
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ItemCatalogTable
                            itemCatalogs={itemCatalogs}
                            units={units || []}
                            isLoading={isLoading}
                            onEdit={(item) => {
                                setSelectedItem(item);
                                setIsDialogOpen(true);
                            }}
                            onDelete={(id) => {
                                deleteItemCatalog(id).then(() => {
                                    toast.success("Item Catalog deleted successfully");
                                    refreshItemCatalogs();
                                }).catch((err) => toast.error(err.message));
                            }}
                            onSelectionChange={setSelectedItems}
                        />
                    </CardContent>
                </Card>

                <ItemCatalogDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    itemCatalog={selectedItem}
                    onSubmit={selectedItem ? handleUpdate : handleCreate}
                />



                <ActionDialog
                    open={showBulkDelete}
                    onOpenChange={setShowBulkDelete}
                    title="Delete Selected Items"
                    description={`Are you sure you want to delete ${selectedItems.length} items? This action cannot be undone.`}
                    onConfirm={handleBulkDelete}
                    confirmLabel="Delete All"
                    isLoading={isBulkDeleting}
                    type="warning"
                    variant="destructive"
                    icon={<AlertTriangle className="h-6 w-6 text-destructive" />}
                    iconPosition="left"
                />
            </div>
        </SidebarInset >
    );
}
