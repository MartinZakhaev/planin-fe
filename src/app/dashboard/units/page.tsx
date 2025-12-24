'use client';

import { useState, useCallback, useMemo } from 'react';
import { useUnits } from '@/hooks/use-units';
import { UnitTable } from './components/unit-table';
import { UnitDialog } from './components/unit-dialog';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Box, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
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
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ActionDialog } from '@/components/action-dialog';

export default function UnitsPage() {
    const { units, isLoading, error, createUnit, updateUnit, deleteUnit, refreshUnits } = useUnits();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
    const [selectedUnits, setSelectedUnits] = useState<Unit[]>([]);
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);
    // Explicit state for bulk delete confirmation to use ActionDialog properly
    const [showBulkDelete, setShowBulkDelete] = useState(false);

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
            setShowBulkDelete(false); // Close dialog
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

    const activeUnitsCount = useMemo(() => units.length, [units]); // Assuming all are active for now, or filter if there's a status
    const recentUnitsCount = useMemo(() => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return units.filter(u => new Date(u.createdAt) > thirtyDaysAgo).length;
    }, [units]);

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
            <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Units
                            </CardTitle>
                            <Box className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{units.length}</div>
                            <p className="text-xs text-muted-foreground">
                                +{recentUnitsCount} from last month
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Active Units
                            </CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{activeUnitsCount}</div>
                            <p className="text-xs text-muted-foreground">
                                Currently active in system
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Recently Added
                            </CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{recentUnitsCount}</div>
                            <p className="text-xs text-muted-foreground">
                                In the last 30 days
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <div className="space-y-1">
                            <CardTitle>All Units</CardTitle>
                            <CardDescription>
                                Manage your system units here.
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            {selectedUnits.length > 0 && (
                                <Button
                                    variant="destructive"
                                    disabled={isBulkDeleting}
                                    size="sm"
                                    onClick={() => setShowBulkDelete(true)}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete ({selectedUnits.length})
                                </Button>
                            )}
                            <Button onClick={handleOpenCreate} size="sm">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Unit
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <div className="bg-destructive/15 text-destructive mb-4 p-3 rounded-md text-sm">
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
                    </CardContent>
                </Card>

                <UnitDialog
                    unit={selectedUnit}
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    onSubmit={handleSubmit}
                />

                <ActionDialog
                    open={showBulkDelete}
                    onOpenChange={setShowBulkDelete}
                    type="warning"
                    title="Delete selected units?"
                    description={
                        <>
                            This action cannot be undone. This will permanently delete{' '}
                            <span className="font-medium">{selectedUnits.length} unit(s)</span>.
                        </>
                    }
                    onConfirm={handleBulkDelete}
                    confirmLabel="Delete All"
                    isLoading={isBulkDeleting}
                    icon={<AlertTriangle className="h-6 w-6 text-destructive" />}
                    iconPosition="left"
                />
            </div>
        </SidebarInset>
    );
}
