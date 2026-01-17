"use client";

import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { ProjectDetails } from "@/types/project-details";
import { ProjectPdfDocument } from "./project-pdf-document";
import { toast } from "sonner";

interface ExportPdfButtonProps {
    project: ProjectDetails;
    formatCurrency: (value: number, currency?: string) => string;
}

export function ExportPdfButton({ project, formatCurrency }: ExportPdfButtonProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleExport = async () => {
        setIsGenerating(true);
        try {
            // Generate PDF blob
            const blob = await pdf(
                <ProjectPdfDocument project={project} formatCurrency={formatCurrency} />
            ).toBlob();

            // Create download link
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `RAB_${project.code || project.name.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            toast.success("PDF exported successfully!");
        } catch (error) {
            console.error("PDF generation error:", error);
            toast.error("Failed to generate PDF. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Button onClick={handleExport} disabled={isGenerating} variant="outline">
            {isGenerating ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                </>
            ) : (
                <>
                    <Download className="mr-2 h-4 w-4" />
                    Export PDF
                </>
            )}
        </Button>
    );
}
