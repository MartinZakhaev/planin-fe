"use client";

import { useState } from "react";
import { WorkDivision } from "@/types/work-division";
import { useWorkDivisions } from "@/hooks/use-work-divisions";
import { Plus, Pencil, Trash2, MoreHorizontal, Briefcase, BookOpen, Layers, AlertTriangle, ArrowUpDown } from "lucide-react";
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
import { WorkDivisionTable } from "./components/work-division-table";
import { WorkDivisionDialog } from "./components/work-division-dialog";
import { toast } from "sonner";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function WorkDivisionsPage() {
    const { workDivisions, isLoading, createWorkDivision, updateWorkDivision, deleteWorkDivision, refreshWorkDivisions } = useWorkDivisions();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedDivision, setSelectedDivision] = useState<WorkDivision | null>(null);
    const [selectedDivisions, setSelectedDivisions] = useState<WorkDivision[]>([]);

    const [showBulkDelete, setShowBulkDelete] = useState(false);
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);

    const handleCreate = async (data: any) => {
        try {
            await createWorkDivision(data);
            toast.success("Work Division created successfully");
            setIsDialogOpen(false);
            refreshWorkDivisions();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleUpdate = async (data: any) => {
        if (!selectedDivision) return;
        try {
            await updateWorkDivision(selectedDivision.id, data);
            toast.success("Work Division updated successfully");
            setIsDialogOpen(false);
            setSelectedDivision(null);
            refreshWorkDivisions();
        } catch (error: any) {
            toast.error(error.message);
        }
    };



    const handleBulkDelete = async () => {
        setIsBulkDeleting(true);
        try {
            for (const division of selectedDivisions) {
                await deleteWorkDivision(division.id);
            }
            toast.success(`${selectedDivisions.length} divisions deleted successfully`);
            setSelectedDivisions([]);
            setShowBulkDelete(false);
            refreshWorkDivisions();
        } catch (error: any) {
            toast.error("Failed to delete some divisions");
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
                            <BreadcrumbPage>Work Divisions</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Divisions</CardTitle>
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{workDivisions.length}</div>
                            <p className="text-xs text-muted-foreground">Defined work categories</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Recently Added</CardTitle>
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {workDivisions.filter(d => new Date(d.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
                            </div>
                            <p className="text-xs text-muted-foreground">in last 30 days</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Structure</CardTitle>
                            <Layers className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Top Level</div>
                            <p className="text-xs text-muted-foreground">Master categorization</p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <div className="space-y-1">
                            <CardTitle>Work Divisions</CardTitle>
                            <CardDescription>
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            {selectedDivisions.length > 0 && (
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => setShowBulkDelete(true)}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete ({selectedDivisions.length})
                                </Button>
                            )}
                            <Button onClick={() => { setSelectedDivision(null); setIsDialogOpen(true); }}>
                                <Plus className="mr-2 h-4 w-4" /> Add Division
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <WorkDivisionTable
                            workDivisions={workDivisions}
                            isLoading={isLoading}
                            onEdit={(division) => {
                                setSelectedDivision(division);
                                setIsDialogOpen(true);
                            }}
                            onDelete={(id) => {
                                deleteWorkDivision(id).then(() => {
                                    toast.success("Work Division deleted successfully");
                                    refreshWorkDivisions();
                                }).catch((err) => toast.error(err.message));
                            }}
                            onSelectionChange={setSelectedDivisions}
                        />
                    </CardContent>
                </Card>

                <WorkDivisionDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    workDivision={selectedDivision}
                    onSubmit={selectedDivision ? handleUpdate : handleCreate}
                />



                <ActionDialog
                    open={showBulkDelete}
                    onOpenChange={setShowBulkDelete}
                    title="Delete Selected Divisions"
                    description={`Are you sure you want to delete ${selectedDivisions.length} divisions? This action cannot be undone.`}
                    onConfirm={handleBulkDelete}
                    confirmLabel="Delete All"
                    isLoading={isBulkDeleting}
                    type="warning"
                    variant="destructive"
                    icon={<AlertTriangle className="h-6 w-6 text-destructive" />}
                    iconPosition="left"
                />
            </div>
        </SidebarInset>
    );
}
