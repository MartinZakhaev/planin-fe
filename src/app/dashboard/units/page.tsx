'use client';

import { useState, useCallback } from 'react';
import { useUnits } from '@/hooks/use-units';
import { UnitTable } from './components/unit-table';
import { UnitDialog } from './components/unit-dialog';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Unit, CreateUnitDto, UpdateUnitDto } from '@/types/unit';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function UnitsPage() {
    const { units, isLoading, error, createUnit, updateUnit, deleteUnit, refreshUnits } = useUnits();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
    const [selectedUnits, setSelectedUnits] = useState<Unit[]>([]);
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);

    const handleOpenCreate = () => {
        setSelectedUnit(null);
        setIsDialogOpen(true);
    };

    const handleOpenEdit = (unit: Unit) => {
        setSelectedUnit(unit);
        setIsDialogOpen(true);
    };

    const handleSubmit = async (data: CreateUnitDto | UpdateUnitDto) => {
        try {
            if (selectedUnit) {
                await updateUnit(selectedUnit.id, data);
                toast.success('Unit updated successfully');
            } else {
                await createUnit(data as CreateUnitDto);
                toast.success('Unit created successfully');
            }
            refreshUnits();
        } catch (err: any) {
            toast.error(err.message || 'Failed to save unit');
            throw err;
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteUnit(id);
            toast.success('Unit deleted successfully');
            refreshUnits();
        } catch (err: any) {
            toast.error(err.message || 'Failed to delete unit');
        }
    };

    const handleBulkDelete = async () => {
        setIsBulkDeleting(true);
        try {
            const deletePromises = selectedUnits.map(unit => deleteUnit(unit.id));
            await Promise.all(deletePromises);
            toast.success(`${selectedUnits.length} unit(s) deleted successfully`);
            setSelectedUnits([]);
            refreshUnits();
        } catch (err: any) {
            toast.error(err.message || 'Failed to delete some units');
        } finally {
            setIsBulkDeleting(false);
        }
    };

    const handleSelectionChange = useCallback((units: Unit[]) => {
        setSelectedUnits(units);
    }, []);

    return (
        <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Units</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">Units</h1>
                    <div className="flex items-center gap-2">
                        {selectedUnits.length > 0 && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" disabled={isBulkDeleting}>
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete ({selectedUnits.length})
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Delete selected units?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete{' '}
                                            <span className="font-medium">{selectedUnits.length} unit(s)</span>.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleBulkDelete}
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                            Delete All
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                        <Button onClick={handleOpenCreate}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Unit
                        </Button>
                    </div>
                </div>

                {error && (
                    <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
                        Error: {error}
                    </div>
                )}

                <UnitTable
                    units={units}
                    isLoading={isLoading}
                    onEdit={handleOpenEdit}
                    onDelete={handleDelete}
                    onSelectionChange={handleSelectionChange}
                />

                <UnitDialog
                    unit={selectedUnit}
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    onSubmit={handleSubmit}
                />
            </div>
        </SidebarInset>
    );
}
