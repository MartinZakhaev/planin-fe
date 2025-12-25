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
import { useTaskCatalogs } from "@/hooks/use-task-catalogs";

interface ItemCatalogDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    itemCatalog: ItemCatalog | null;
    onSubmit: (data: CreateItemCatalogDto | UpdateItemCatalogDto) => Promise<void>;
}

export function ItemCatalogDialog({ open, onOpenChange, itemCatalog, onSubmit }: ItemCatalogDialogProps) {
    const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<CreateItemCatalogDto & UpdateItemCatalogDto>();
    const { taskCatalogs } = useTaskCatalogs();

    useEffect(() => {
        if (open) {
            if (itemCatalog) {
                setValue("taskCatalogId", itemCatalog.taskCatalogId);
                setValue("code", itemCatalog.code);
                setValue("name", itemCatalog.name);
                setValue("type", itemCatalog.type);
                setValue("unit", itemCatalog.unit);
                setValue("price", itemCatalog.price);
                setValue("description", itemCatalog.description);
            } else {
                reset({
                    taskCatalogId: "",
                    code: "",
                    name: "",
                    type: "MATERIAL",
                    unit: "m2",
                    price: 0,
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
                    <div className="grid gap-2">
                        <Label htmlFor="taskCatalogId">Task Group (Optional)</Label>
                        <Select onValueChange={(val) => setValue("taskCatalogId", val === "none" ? undefined : val)} defaultValue={itemCatalog?.taskCatalogId || "none"}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Task Group" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">-- None --</SelectItem>
                                {taskCatalogs?.map((task) => (
                                    <SelectItem key={task.id} value={task.id}>{task.name} ({task.code})</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

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
                                    <SelectItem value="WAGE">Wage</SelectItem>
                                    <SelectItem value="TOOL">Tool</SelectItem>
                                    <SelectItem value="SUB_WORK">Sub Work</SelectItem>
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
                            <Label htmlFor="unit">Unit</Label>
                            <Input id="unit" {...register("unit", { required: true })} placeholder="kg, m3, hour" />
                            {errors.unit && <span className="text-destructive text-xs">Required</span>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="price">Price (IDR)</Label>
                            <Input
                                id="price"
                                type="number"
                                {...register("price", { required: true, valueAsNumber: true })}
                            />
                            {errors.price && <span className="text-destructive text-xs">Required</span>}
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
