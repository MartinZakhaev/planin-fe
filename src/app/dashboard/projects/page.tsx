"use client";

import { useState } from "react";
import { Project, CreateProjectDto, UpdateProjectDto } from "@/types/project";
import { useProjects } from "@/hooks/use-projects";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, AlertTriangle, FolderKanban, Clock, DollarSign } from "lucide-react";
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
import { ProjectTable } from "./components/project-table";
import { ProjectDialog } from "./components/project-dialog";
import { toast } from "sonner";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function ProjectsPage() {
    const { projects, isLoading, createProject, updateProject, deleteProject, refreshProjects } = useProjects();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [selectedProjects, setSelectedProjects] = useState<Project[]>([]);

    const [showBulkDelete, setShowBulkDelete] = useState(false);
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);

    const handleCreate = async (data: any) => {
        try {
            await createProject(data);
            toast.success("Project created successfully");
            setIsDialogOpen(false);
            refreshProjects();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleUpdate = async (data: any) => {
        if (!selectedProject) return;
        try {
            await updateProject(selectedProject.id, data);
            toast.success("Project updated successfully");
            setIsDialogOpen(false);
            setSelectedProject(null);
            refreshProjects();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleBulkDelete = async () => {
        setIsBulkDeleting(true);
        try {
            for (const project of selectedProjects) {
                await deleteProject(project.id);
            }
            toast.success(`${selectedProjects.length} projects deleted successfully`);
            setSelectedProjects([]);
            setShowBulkDelete(false);
            refreshProjects();
        } catch (error: any) {
            toast.error("Failed to delete some projects");
        } finally {
            setIsBulkDeleting(false);
        }
    };

    // Calculate this month's projects
    const thisMonthProjects = projects.filter(
        p => new Date(p.createdAt) > new Date(new Date().setDate(1))
    ).length;

    return (
        <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Projects</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                            <FolderKanban className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{projects.length}</div>
                            <p className="text-xs text-muted-foreground">RAB documents</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{thisMonthProjects}</div>
                            <p className="text-xs text-muted-foreground">Created this month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Default Tax</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">11%</div>
                            <p className="text-xs text-muted-foreground">PPN rate</p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <div className="space-y-1">
                            <CardTitle>All Projects</CardTitle>
                            <CardDescription>
                                Manage your RAB (Rencana Anggaran Biaya) projects.
                            </CardDescription>
                        </div>

                        <div className="flex items-center gap-2">
                            {selectedProjects.length > 0 && (
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => setShowBulkDelete(true)}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete ({selectedProjects.length})
                                </Button>
                            )}
                            <Button onClick={() => { setSelectedProject(null); setIsDialogOpen(true); }}>
                                <Plus className="mr-2 h-4 w-4" /> Add Project
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ProjectTable
                            projects={projects}
                            isLoading={isLoading}
                            onEdit={(project) => {
                                setSelectedProject(project);
                                setIsDialogOpen(true);
                            }}
                            onDelete={(id) => {
                                deleteProject(id).then(() => {
                                    toast.success("Project deleted successfully");
                                    refreshProjects();
                                }).catch((err) => toast.error(err.message));
                            }}
                            onSelectionChange={setSelectedProjects}
                        />
                    </CardContent>
                </Card>
                <ProjectDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    project={selectedProject}
                    onSubmit={selectedProject ? handleUpdate : handleCreate}
                />

                <ActionDialog
                    open={showBulkDelete}
                    onOpenChange={setShowBulkDelete}
                    title="Delete Selected Projects"
                    description={`Are you sure you want to delete ${selectedProjects.length} projects? This action cannot be undone.`}
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
