"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"

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
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

export type ActionDialogType = "create" | "edit" | "info" | "warning" | "confirm"
export type IconPosition = "top" | "left" | "center" | "right"

interface ActionDialogProps {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    trigger?: React.ReactNode
    type: ActionDialogType
    title: string
    description?: React.ReactNode
    children?: React.ReactNode
    onConfirm?: () => Promise<void> | void
    confirmLabel?: string
    cancelLabel?: string
    isLoading?: boolean
    disabled?: boolean
    variant?: "default" | "destructive"
    icon?: React.ReactNode
    iconPosition?: IconPosition
    className?: string
    confirmButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>
}

export function ActionDialog({
    open,
    onOpenChange,
    trigger,
    type,
    title,
    description,
    children,
    onConfirm,
    confirmLabel,
    cancelLabel = "Cancel",
    isLoading = false,
    disabled = false,
    variant, // default based on type
    icon,
    iconPosition, // default based on type
    className,
    confirmButtonProps,
}: ActionDialogProps) {
    // Determine defaults based on type
    const isAlert = type === "warning" || type === "confirm"
    const isDestructive = variant === "destructive" || (type === "warning" && variant !== "default")
    const defaultIconPosition = type === "info" || type === "warning" || type === "confirm" ? "center" : "left"
    const finalIconPosition = iconPosition ?? defaultIconPosition

    const defaultConfirmLabel =
        confirmLabel ??
        (type === "create"
            ? "Create"
            : type === "edit"
                ? "Save"
                : type === "warning"
                    ? "Continue"
                    : type === "confirm"
                        ? "Confirm"
                        : "OK")

    const handleConfirm = async (e: React.MouseEvent) => {
        if (onConfirm) {
            e.preventDefault()
            await onConfirm()
        }
        // If no onConfirm (e.g. form submit), do not preventDefault
    }

    // --- Layout Helper for Header Content (Icon + Title + Desc) ---
    const renderHeaderContent = () => {
        // Top Position
        if (finalIconPosition === "top") {
            return (
                <div className="flex flex-col items-center text-center gap-4">
                    {icon && <div className="text-4xl">{icon}</div>}
                    <div className="space-y-2">
                        <DialogTitle className="text-center">{title}</DialogTitle>
                        {description && <DialogDescription className="text-center">{description}</DialogDescription>}
                    </div>
                </div>
            )
        }

        // Center Position
        if (finalIconPosition === "center") {
            return (
                <div className="flex flex-col items-center text-center gap-4">
                    {icon && <div className="flex items-center justify-center p-2 rounded-full bg-muted/50">{icon}</div>}
                    <div className="space-y-2">
                        <DialogTitle className="text-center">{title}</DialogTitle>
                        {description && <DialogDescription className="text-center">{description}</DialogDescription>}
                    </div>
                </div>
            )
        }

        // Left Position (Standard)
        if (finalIconPosition === "left") {
            return (
                <div className="flex gap-4">
                    {icon && <div className="mt-1 flex-shrink-0">{icon}</div>}
                    <div className="space-y-1.5 flex-1 text-left">
                        <DialogTitle>{title}</DialogTitle>
                        {description && <DialogDescription>{description}</DialogDescription>}
                    </div>
                </div>
            )
        }

        // Right Position
        if (finalIconPosition === "right") {
            return (
                <div className="flex gap-4 justify-between">
                    <div className="space-y-1.5 flex-1 text-left">
                        <DialogTitle>{title}</DialogTitle>
                        {description && <DialogDescription>{description}</DialogDescription>}
                    </div>
                    {icon && <div className="mt-1 flex-shrink-0">{icon}</div>}
                </div>
            )
        }
    }

    // --- Alert Dialog (Warning / Confirm) ---
    if (isAlert) {
        return (
            <AlertDialog open={open} onOpenChange={onOpenChange}>
                {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
                <AlertDialogContent className={cn(className)}>
                    <AlertDialogHeader>
                        {/* Custom Header Layout */}
                        {finalIconPosition === "top" && (
                            <div className="flex flex-col items-center text-center gap-4">
                                {icon && <div className="text-muted-foreground">{icon}</div>}
                                <div className="space-y-2">
                                    <AlertDialogTitle className="text-center">{title}</AlertDialogTitle>
                                    {description && <AlertDialogDescription className="text-center">{description}</AlertDialogDescription>}
                                </div>
                            </div>
                        )}

                        {finalIconPosition === "center" && (
                            <div className="flex flex-col items-center text-center gap-4">
                                {icon && <div className="mb-2">{icon}</div>}
                                <div className="space-y-2">
                                    <AlertDialogTitle className="text-center">{title}</AlertDialogTitle>
                                    {description && <AlertDialogDescription className="text-center">{description}</AlertDialogDescription>}
                                </div>
                            </div>
                        )}

                        {finalIconPosition === "left" && (
                            <div className="flex flex-row gap-4">
                                {icon && <div className="mt-0.5">{icon}</div>}
                                <div className="space-y-2 text-left">
                                    <AlertDialogTitle>{title}</AlertDialogTitle>
                                    {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
                                </div>
                            </div>
                        )}

                        {finalIconPosition === "right" && (
                            <div className="flex flex-row gap-4 justify-between">
                                <div className="space-y-2 text-left">
                                    <AlertDialogTitle>{title}</AlertDialogTitle>
                                    {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
                                </div>
                                {icon && <div className="mt-0.5">{icon}</div>}
                            </div>
                        )}

                    </AlertDialogHeader>

                    {children && <div className="py-4">{children}</div>}

                    <AlertDialogFooter className={cn(finalIconPosition === "center" || finalIconPosition === "top" ? "sm:justify-center" : "")}>
                        <AlertDialogCancel disabled={isLoading || disabled}>{cancelLabel}</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirm}
                            disabled={isLoading || disabled}
                            className={cn(isDestructive && "bg-destructive text-white hover:bg-destructive/90")}
                            {...confirmButtonProps}
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {defaultConfirmLabel}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )
    }

    // --- Regular Dialog (Create / Edit / Info) ---
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className={cn("sm:max-w-[425px]", className)}>
                <DialogHeader>
                    {renderHeaderContent()}
                </DialogHeader>

                {children && <div className="py-4">{children}</div>}

                <DialogFooter className={cn(finalIconPosition === "center" || finalIconPosition === "top" ? "sm:justify-center w-full" : "")}>
                    {/* Info usually just needs a close button, but we can standard footer it if 'confirm' logic is passed */}
                    {type === 'info' ? (
                        <DialogClose asChild>
                            <Button type="button" variant="secondary" className="w-full sm:w-auto">
                                {confirmLabel || "Close"}
                            </Button>
                        </DialogClose>
                    ) : (
                        <>
                            <DialogClose asChild>
                                <Button type="button" variant="outline" disabled={isLoading || disabled}>
                                    {cancelLabel}
                                </Button>
                            </DialogClose>
                            <Button
                                type="submit"
                                onClick={handleConfirm}
                                disabled={isLoading || disabled}
                                className={cn(isDestructive && "bg-destructive text-white hover:bg-destructive/90")}
                                {...confirmButtonProps}
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {defaultConfirmLabel}
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
