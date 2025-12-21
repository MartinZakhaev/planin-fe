'use client';

import { useState } from 'react';
import { useUnits } from '@/hooks/use-units';
import { UnitTable } from './components/unit-table';
import { UnitDialog } from './components/unit-dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
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

export default function UnitsPage() {
    const { units, isLoading, error, createUnit, updateUnit, deleteUnit, refreshUnits } = useUnits();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

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
                    <Button onClick={handleOpenCreate}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Unit
                    </Button>
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
