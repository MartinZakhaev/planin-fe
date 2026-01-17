"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, Package, Users, Wrench } from "lucide-react";
import { ItemCatalog } from "@/types/item-catalog";
import { Unit } from "@/types/unit";
import { CreateTaskLineItemDto } from "@/types/project-mutations";
import { apiFetch } from "@/lib/api-fetch";
import { Badge } from "@/components/ui/badge";

interface AddLineItemDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    projectId: string;
    projectTaskId: string;
    taskName: string;
    currency: string;
    onSuccess: () => void;
}

const getItemTypeIcon = (type: string) => {
    switch (type) {
        case "MATERIAL":
            return <Package className="h-3 w-3" />;
        case "MANPOWER":
            return <Users className="h-3 w-3" />;
        case "TOOL":
            return <Wrench className="h-3 w-3" />;
        default:
            return <Package className="h-3 w-3" />;
    }
};

const getItemTypeBadgeColor = (type: string) => {
    switch (type) {
        case "MATERIAL":
            return "bg-blue-100 text-blue-800";
        case "MANPOWER":
            return "bg-green-100 text-green-800";
        case "TOOL":
            return "bg-orange-100 text-orange-800";
        default:
            return "";
    }
};

export function AddLineItemDialog({
    open,
    onOpenChange,
    projectId,
    projectTaskId,
    taskName,
    currency,
    onSuccess,
}: AddLineItemDialogProps) {
    const [itemCatalogs, setItemCatalogs] = useState<ItemCatalog[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<CreateTaskLineItemDto>();

    const selectedItemId = watch("itemCatalogId");
    const quantity = watch("quantity") || 0;
    const unitPrice = watch("unitPrice") || 0;
    const lineTotal = quantity * unitPrice;

    useEffect(() => {
        if (open) {
            setIsLoading(true);
            Promise.all([
                apiFetch<ItemCatalog[]>("/item-catalogs"),
                apiFetch<Unit[]>("/units"),
            ])
                .then(([items, unitsData]) => {
                    setItemCatalogs(items);
                    setUnits(unitsData);
                })
                .catch(console.error)
                .finally(() => setIsLoading(false));

            reset({
                projectId,
                projectTaskId,
                itemCatalogId: "",
                unitId: "",
                description: "",
                quantity: 1,
                unitPrice: 0,
            });
        }
    }, [open, projectId, projectTaskId, reset]);

    // Auto-fill price and unit when item is selected
    useEffect(() => {
        if (selectedItemId) {
            const item = itemCatalogs.find(i => i.id === selectedItemId);
            if (item) {
                setValue("unitPrice", item.defaultPrice);
                setValue("unitId", item.unitId);
                setValue("description", item.name);
            }
        }
    }, [selectedItemId, itemCatalogs, setValue]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: currency,
            minimumFractionDigits: 0,
        }).format(value);
    };

    const onFormSubmit = async (data: CreateTaskLineItemDto) => {
        try {
            await apiFetch("/task-line-items", {
                method: "POST",
                body: JSON.stringify(data),
            });
            onOpenChange(false);
            onSuccess();
        } catch (error: any) {
            console.error("Failed to add line item:", error);
        }
    };

    const selectedItem = itemCatalogs.find(i => i.id === selectedItemId);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add Item</DialogTitle>
                    <DialogDescription>
                        Add an item to task "{taskName}".
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onFormSubmit)} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="itemCatalogId">Item Catalog *</Label>
                        {isLoading ? (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Loading items...
                            </div>
                        ) : (
                            <Select
                                value={selectedItemId || ""}
                                onValueChange={(value) => setValue("itemCatalogId", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an item from catalog" />
                                </SelectTrigger>
                                <SelectContent>
                                    {itemCatalogs.map((item) => (
                                        <SelectItem key={item.id} value={item.id}>
                                            <div className="flex items-center gap-2">
                                                <Badge className={getItemTypeBadgeColor(item.type)}>
                                                    {getItemTypeIcon(item.type)}
                                                </Badge>
                                                <span className="font-mono text-xs text-muted-foreground">
                                                    {item.code}
                                                </span>
                                                <span>{item.name}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                        {errors.itemCatalogId && <span className="text-destructive text-xs">Required</span>}
                    </div>

                    {selectedItem && (
                        <div className="rounded-lg bg-muted p-3 text-sm">
                            <div className="flex items-center gap-2 mb-1">
                                <Badge className={getItemTypeBadgeColor(selectedItem.type)}>
                                    {getItemTypeIcon(selectedItem.type)}
                                    <span className="ml-1">{selectedItem.type}</span>
                                </Badge>
                            </div>
                            <p className="text-muted-foreground text-xs">
                                Default price: {formatCurrency(selectedItem.defaultPrice)}
                            </p>
                        </div>
                    )}

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            {...register("description")}
                            placeholder="Optional description"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="quantity">Quantity *</Label>
                            <Input
                                id="quantity"
                                type="number"
                                step="0.01"
                                {...register("quantity", { required: true, valueAsNumber: true, min: 0.01 })}
                                placeholder="1"
                            />
                            {errors.quantity && <span className="text-destructive text-xs">Required (min 0.01)</span>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="unitId">Unit *</Label>
                            <Select
                                value={watch("unitId") || ""}
                                onValueChange={(value) => setValue("unitId", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Unit" />
                                </SelectTrigger>
                                <SelectContent>
                                    {units.map((unit) => (
                                        <SelectItem key={unit.id} value={unit.id}>
                                            {unit.code} - {unit.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.unitId && <span className="text-destructive text-xs">Required</span>}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="unitPrice">Unit Price ({currency}) *</Label>
                        <Input
                            id="unitPrice"
                            type="number"
                            step="1"
                            {...register("unitPrice", { required: true, valueAsNumber: true, min: 0 })}
                            placeholder="0"
                        />
                        {errors.unitPrice && <span className="text-destructive text-xs">Required</span>}
                    </div>

                    {/* Line Total Preview */}
                    <div className="rounded-lg bg-primary/10 p-4">
                        <p className="text-sm text-muted-foreground">Line Total</p>
                        <p className="text-xl font-bold text-primary">{formatCurrency(lineTotal)}</p>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={isSubmitting || !selectedItemId}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Add Item
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
