"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LucideIcon, FolderOpen, ListTodo, Package } from "lucide-react";

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    className?: string;
    variant?: "divisions" | "tasks" | "items" | "default";
}

const variantConfig = {
    divisions: {
        icon: FolderOpen,
        iconColor: "text-blue-500",
        bgColor: "bg-blue-50 dark:bg-blue-950/20",
    },
    tasks: {
        icon: ListTodo,
        iconColor: "text-amber-500",
        bgColor: "bg-amber-50 dark:bg-amber-950/20",
    },
    items: {
        icon: Package,
        iconColor: "text-emerald-500",
        bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
    },
    default: {
        icon: FolderOpen,
        iconColor: "text-muted-foreground",
        bgColor: "bg-muted/50",
    },
};

export function EmptyState({
    icon,
    title,
    description,
    actionLabel,
    onAction,
    className,
    variant = "default",
}: EmptyStateProps) {
    const config = variantConfig[variant];
    const IconComponent = icon || config.icon;

    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center",
                config.bgColor,
                className
            )}
        >
            <div className={cn("rounded-full bg-background p-3 shadow-sm mb-4")}>
                <IconComponent className={cn("h-8 w-8", config.iconColor)} />
            </div>
            <h3 className="text-lg font-semibold mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                {description}
            </p>
            {actionLabel && onAction && (
                <Button onClick={onAction} size="sm">
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}
