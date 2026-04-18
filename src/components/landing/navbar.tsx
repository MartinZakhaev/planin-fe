"use client";

import Link from "next/link";
import { Menu, X, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
    { href: "#features", label: "Solutions" },
    { href: "#pricing", label: "Pricing" },
    { href: "#testimonials", label: "Resources" },
    { href: "#", label: "Documentation" },
];

export function Navbar() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 8);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={cn(
                "fixed top-0 z-50 w-full transition-all duration-200",
                scrolled
                    ? "border-b bg-white/95 dark:bg-background/95 backdrop-blur-sm shadow-sm"
                    : "border-b bg-white dark:bg-background"
            )}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="m3 17 6-6 4 4 8-8" />
                                <path d="M17 7h4v4" />
                            </svg>
                        </div>
                        <span className="text-lg font-semibold tracking-tight">
                            Planin
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="inline-flex items-center gap-1 px-3.5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-3">
                        <Link href="/login" className="hidden sm:inline-flex">
                            <Button variant="ghost" size="sm" className="text-sm font-medium">
                                Sign In
                            </Button>
                        </Link>
                        <Link href="/signup">
                            <Button size="sm" className="text-sm font-medium shadow-sm">
                                Start Free Trial
                            </Button>
                        </Link>

                        {/* Mobile Menu */}
                        <Sheet open={open} onOpenChange={setOpen}>
                            <SheetTrigger asChild className="md:hidden">
                                <Button variant="ghost" size="icon" className="size-9">
                                    <Menu className="size-5" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-80 p-0">
                                <div className="flex flex-col h-full">
                                    {/* Mobile Header */}
                                    <div className="flex items-center justify-between border-b px-6 py-4">
                                        <Link
                                            href="/"
                                            className="flex items-center gap-2"
                                            onClick={() => setOpen(false)}
                                        >
                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="m3 17 6-6 4 4 8-8" />
                                                    <path d="M17 7h4v4" />
                                                </svg>
                                            </div>
                                            <span className="font-semibold">Planin</span>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-8"
                                            onClick={() => setOpen(false)}
                                        >
                                            <X className="size-4" />
                                        </Button>
                                    </div>

                                    {/* Mobile Nav Links */}
                                    <nav className="flex-1 overflow-y-auto p-4">
                                        <div className="flex flex-col gap-1">
                                            {navLinks.map((link) => (
                                                <Link
                                                    key={link.href}
                                                    href={link.href}
                                                    onClick={() => setOpen(false)}
                                                    className="inline-flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:bg-accent rounded-md transition-colors"
                                                >
                                                    {link.label}
                                                    <ChevronRight className="size-4 text-muted-foreground" />
                                                </Link>
                                            ))}
                                        </div>
                                    </nav>

                                    {/* Mobile Footer */}
                                    <div className="border-t p-6 space-y-3">
                                        <Link href="/login" onClick={() => setOpen(false)}>
                                            <Button variant="outline" className="w-full">
                                                Sign In
                                            </Button>
                                        </Link>
                                        <Link href="/signup" onClick={() => setOpen(false)}>
                                            <Button className="w-full">
                                                Start Free Trial
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
}