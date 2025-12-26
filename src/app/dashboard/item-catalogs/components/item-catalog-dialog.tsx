"use client";

import { useForm } from "react-hook-form";
import { ItemCatalog, CreateItemCatalogDto, UpdateItemCatalogDto } from "@/types/item-catalog";
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
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useUnits } from "@/hooks/use-units";

interface ItemCatalogDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    itemCatalog: ItemCatalog | null;
    onSubmit: (data: CreateItemCatalogDto | UpdateItemCatalogDto) => Promise<void>;
}

export function ItemCatalogDialog({ open, onOpenChange, itemCatalog, onSubmit }: ItemCatalogDialogProps) {
    const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<CreateItemCatalogDto & UpdateItemCatalogDto>();
    const { units } = useUnits();

    useEffect(() => {
        if (open) {
            if (itemCatalog) {
                setValue("code", itemCatalog.code);
                setValue("name", itemCatalog.name);
                setValue("type", itemCatalog.type);
                setValue("unitId", itemCatalog.unitId);
                setValue("defaultPrice", itemCatalog.defaultPrice);
                setValue("description", itemCatalog.description);
            } else {
                reset({
                    code: "",
                    name: "",
                    type: "MATERIAL",
                    unitId: "",
                    defaultPrice: 0,
                    description: ""
                });
            }
        }
    }, [open, itemCatalog, reset, setValue]);

    const onFormSubmit = async (data: any) => {
        await onSubmit(data);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{itemCatalog ? "Edit Item Catalog" : "Create Item Catalog"}</DialogTitle>
                    <DialogDescription>
                        {itemCatalog ? "Update item catalog details." : "Create a new material, wage, or tool entry."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onFormSubmit)} className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="code">Code</Label>
                            <Input id="code" {...register("code", { required: true })} placeholder="ITM-001" />
                            {errors.code && <span className="text-destructive text-xs">Required</span>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="type">Type</Label>
                            <Select onValueChange={(val: any) => setValue("type", val)} defaultValue={itemCatalog?.type || "MATERIAL"}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="MATERIAL">Material</SelectItem>
                                    <SelectItem value="MANPOWER">Manpower</SelectItem>
                                    <SelectItem value="TOOL">Tool</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.type && <span className="text-destructive text-xs">Required</span>}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" {...register("name", { required: true })} placeholder="Portland Cement" />
                        {errors.name && <span className="text-destructive text-xs">Required</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="unitId">Unit</Label>
                            <Select onValueChange={(val) => setValue("unitId", val)} defaultValue={itemCatalog?.unitId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Unit" />
                                </SelectTrigger>
                                <SelectContent>
                                    {units?.map((unit) => (
                                        <SelectItem key={unit.id} value={unit.id}>{unit.name} ({unit.code})</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.unitId && <span className="text-destructive text-xs">Required</span>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="defaultPrice">Price (IDR)</Label>
                            <Input
                                id="defaultPrice"
                                type="number"
                                {...register("defaultPrice", { required: true, valueAsNumber: true })}
                            />
                            {errors.defaultPrice && <span className="text-destructive text-xs">Required</span>}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            {...register("description")}
                            placeholder="Specification or details..."
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
