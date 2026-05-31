"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Hash, Loader2, Package, PenLine, Users, Wrench } from "lucide-react";
import { CreatePersonalItemCatalogDto, ItemCatalog } from "@/types/item-catalog";
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

const getQuantityCopy = (type?: string) => {
    switch (type) {
        case "MANPOWER":
            return {
                label: "Qty Orang *",
                placeholder: "3",
                helper: "Jumlah orang yang bekerja per hari.",
                noun: "orang",
            };
        case "TOOL":
            return {
                label: "Qty Tools *",
                placeholder: "2",
                helper: "Jumlah alat yang digunakan per hari.",
                noun: "tools",
            };
        case "MATERIAL":
            return {
                label: "Qty Materials *",
                placeholder: "10",
                helper: "Jumlah material yang dipakai.",
                noun: "material",
            };
        default:
            return {
                label: "Quantity *",
                placeholder: "1",
                helper: "Pilih item catalog untuk melihat konteks quantity.",
                noun: "item",
            };
    }
};

export function AddLineItemDialog({
    open,
    onOpenChange,
    projectId,
    projectTaskId,
    taskName,
    onSuccess,
}: AddLineItemDialogProps) {
    const [itemCatalogs, setItemCatalogs] = useState<ItemCatalog[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState<"catalog" | "custom">("catalog");
    const [customItemName, setCustomItemName] = useState("");
    const [customItemType, setCustomItemType] = useState<"MATERIAL" | "MANPOWER" | "TOOL">("MATERIAL");
    const [customItemPrefix, setCustomItemPrefix] = useState("ITEM");
    const { control, register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<CreateTaskLineItemDto>();

    const [selectedItemId, unitId, quantity = 0, durationDays = 1, unitPrice = 0] = useWatch({
        control,
        name: ["itemCatalogId", "unitId", "quantity", "durationDays", "unitPrice"],
    });
    const lineTotal = quantity * durationDays * unitPrice;

    useEffect(() => {
        if (open) {
            // Loading state mirrors the dialog's fetch lifecycle.
            // eslint-disable-next-line react-hooks/set-state-in-effect
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
                durationDays: 1,
                unitPrice: 0,
            });
            setMode("catalog");
            setCustomItemName("");
            setCustomItemType("MATERIAL");
            setCustomItemPrefix("ITEM");
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
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value);
    };

    const onFormSubmit = async (data: CreateTaskLineItemDto) => {
        try {
            let itemCatalogId = data.itemCatalogId;

            if (mode === "custom") {
                const personalItem = await apiFetch<ItemCatalog>("/item-catalogs/personal", {
                    method: "POST",
                    body: JSON.stringify({
                        name: customItemName,
                        type: customItemType,
                        unitId: data.unitId,
                        defaultPrice: data.unitPrice,
                        prefix: customItemPrefix || "ITEM",
                        description: data.description,
                    } satisfies CreatePersonalItemCatalogDto),
                });
                itemCatalogId = personalItem.id;
            }

            await apiFetch("/task-line-items", {
                method: "POST",
                body: JSON.stringify({
                    ...data,
                    itemCatalogId,
                    description: data.description || (mode === "custom" ? customItemName : data.description),
                }),
            });
            onOpenChange(false);
            onSuccess();
        } catch (error: unknown) {
            console.error("Failed to add line item:", error);
        }
    };

    const selectedItem = itemCatalogs.find(i => i.id === selectedItemId);
    const activeItemType = mode === "custom" ? customItemType : selectedItem?.type;
    const quantityCopy = getQuantityCopy(activeItemType);
    const dailyTotal = quantity * unitPrice;
    const canSubmit = mode === "catalog" ? Boolean(selectedItemId) : Boolean(customItemName.trim());

    const handleModeChange = (value: string) => {
        const nextMode = value as "catalog" | "custom";
        setMode(nextMode);
        setValue("itemCatalogId", "");
        setValue("unitId", "");
        setValue("description", "");
        setValue("quantity", 1);
        setValue("durationDays", 1);
        setValue("unitPrice", 0);
        if (nextMode === "catalog") {
            setCustomItemName("");
        } else {
            setCustomItemType("MATERIAL");
            setCustomItemPrefix("ITEM");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[620px]">
                <DialogHeader className="space-y-2">
                    <DialogTitle>Add Item</DialogTitle>
                    <DialogDescription>
                        Add an item to task &quot;{taskName}&quot;.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onFormSubmit)} className="grid gap-5 py-4">
                    <Tabs value={mode} onValueChange={handleModeChange} className="gap-4">
                        <TabsList className="grid h-11 w-full grid-cols-2 rounded-md">
                            <TabsTrigger value="catalog" className="gap-2">
                                <BookOpen className="h-4 w-4" />
                                Pilih Item
                            </TabsTrigger>
                            <TabsTrigger value="custom" className="gap-2">
                                <PenLine className="h-4 w-4" />
                                Buat Sendiri
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="catalog" className="mt-0 space-y-4 rounded-md border p-4">
                            <div className="space-y-1">
                                <h3 className="text-sm font-medium">Gunakan item yang sudah tersedia</h3>
                                <p className="text-xs text-muted-foreground">
                                    Pilih dari item global atau item personal yang sudah pernah kamu buat.
                                </p>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="itemCatalogId">Item Catalog *</Label>
                                {isLoading ? (
                                    <div className="flex h-10 items-center gap-2 rounded-md border px-3 text-sm text-muted-foreground">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Loading items...
                                    </div>
                                ) : itemCatalogs.length === 0 ? (
                                    <div className="rounded-md border border-dashed bg-muted/30 p-4 text-sm text-muted-foreground">
                                        Belum ada item catalog. Gunakan tab <span className="font-medium text-foreground">Buat Sendiri</span>.
                                    </div>
                                ) : (
                                    <Select
                                        value={selectedItemId || ""}
                                        onValueChange={(value) => setValue("itemCatalogId", value)}
                                    >
                                        <SelectTrigger className="h-11">
                                            <SelectValue placeholder="Pilih item dari catalog" />
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
                                                        <Badge variant="outline" className="ml-1 text-[10px]">
                                                            {item.ownerUserId ? "Personal" : "Global"}
                                                        </Badge>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                                {mode === "catalog" && errors.itemCatalogId && <span className="text-destructive text-xs">Required</span>}
                            </div>

                            {selectedItem && (
                                <div className="rounded-md bg-muted/50 p-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-medium">{selectedItem.name}</p>
                                                <Badge variant="secondary">{selectedItem.ownerUserId ? "Personal" : "Global"}</Badge>
                                            </div>
                                            <p className="font-mono text-xs text-muted-foreground">{selectedItem.code}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Default price: {formatCurrency(selectedItem.defaultPrice)}
                                                {activeItemType === "MANPOWER" && " per orang per hari"}
                                                {activeItemType === "TOOL" && " per tool per hari"}
                                            </p>
                                        </div>
                                        <Badge className={getItemTypeBadgeColor(selectedItem.type)}>
                                            {getItemTypeIcon(selectedItem.type)}
                                            <span className="ml-1">{selectedItem.type}</span>
                                        </Badge>
                                    </div>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="custom" className="mt-0 space-y-4 rounded-md border p-4">
                            <div className="space-y-1">
                                <h3 className="text-sm font-medium">Buat item personal</h3>
                                <p className="text-xs text-muted-foreground">
                                    Item ini akan tersimpan di catalog pribadi kamu dan bisa dipakai lagi nanti.
                                </p>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="customItemName">Item Name *</Label>
                                <Input
                                    id="customItemName"
                                    value={customItemName}
                                    onChange={(event) => setCustomItemName(event.target.value)}
                                    placeholder="e.g., Mandor, Bor Listrik, Semen"
                                />
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label>Type *</Label>
                                    <Select
                                        value={customItemType}
                                        onValueChange={(value) => setCustomItemType(value as typeof customItemType)}
                                    >
                                        <SelectTrigger className="h-11">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="MATERIAL">Materials</SelectItem>
                                            <SelectItem value="MANPOWER">Manpower</SelectItem>
                                            <SelectItem value="TOOL">Tools</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="customItemPrefix">Item Code Prefix</Label>
                                    <div className="relative">
                                        <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="customItemPrefix"
                                            value={customItemPrefix}
                                            onChange={(event) => setCustomItemPrefix(event.target.value)}
                                            placeholder="ITEM"
                                            className="h-11 pl-9"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
                                Kode dibuat otomatis dari prefix, misalnya {customItemPrefix || "ITEM"}-001. Harga default item personal akan mengikuti Unit Price yang kamu isi.
                            </div>
                        </TabsContent>
                    </Tabs>

                    <div className="space-y-4 rounded-md border p-4">
                        <div className="space-y-1">
                            <h3 className="text-sm font-medium">Detail Line Item</h3>
                            <p className="text-xs text-muted-foreground">
                                Atur deskripsi, jumlah, durasi hari, dan harga untuk item di task ini.
                            </p>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                className="h-11"
                                {...register("description")}
                                placeholder="Optional description"
                            />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="quantity">{quantityCopy.label}</Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    step="0.01"
                                    className="h-11"
                                    {...register("quantity", { required: true, valueAsNumber: true, min: 0.01 })}
                                    placeholder={quantityCopy.placeholder}
                                />
                                <span className="text-xs text-muted-foreground">{quantityCopy.helper}</span>
                                {errors.quantity && <span className="text-destructive text-xs">Required (min 0.01)</span>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="unitId">Unit Harga *</Label>
                                <Select
                                    value={unitId || ""}
                                    onValueChange={(value) => setValue("unitId", value)}
                                >
                                    <SelectTrigger className="h-11">
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

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="durationDays">Jumlah Hari *</Label>
                                <Input
                                    id="durationDays"
                                    type="number"
                                    step="0.5"
                                    className="h-11"
                                    {...register("durationDays", { required: true, valueAsNumber: true, min: 0 })}
                                    placeholder="14"
                                />
                                <span className="text-xs text-muted-foreground">
                                    Isi 1 untuk material yang tidak bergantung durasi.
                                </span>
                                {errors.durationDays && <span className="text-destructive text-xs">Required</span>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="unitPrice">Unit Price (IDR) *</Label>
                                <Input
                                    id="unitPrice"
                                    type="number"
                                    step="1"
                                    className="h-11"
                                    {...register("unitPrice", { required: true, valueAsNumber: true, min: 0 })}
                                    placeholder="0"
                                />
                                {errors.unitPrice && <span className="text-destructive text-xs">Required</span>}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-md bg-primary/10 p-4">
                        <p className="text-sm text-muted-foreground">Line Total</p>
                        <p className="text-2xl font-bold text-primary">{formatCurrency(lineTotal)}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            {quantity || 0} {quantityCopy.noun} x {formatCurrency(unitPrice)} = {formatCurrency(dailyTotal)} per hari
                            {" "}x {durationDays || 0} hari
                        </p>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || !canSubmit || !unitId}
                        >
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {mode === "custom" ? "Create & Add Item" : "Add Selected Item"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
