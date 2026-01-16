"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
    { href: "#features", label: "Solusi" },
    { href: "#pricing", label: "Harga" },
    { href: "#testimonials", label: "Sumber Daya" },
];

export function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-[#e4dfdd] dark:border-[#3a2e2b] bg-white/90 dark:bg-[#1e1614]/90 backdrop-blur-md">
            <div className="px-4 md:px-0 py-3 flex items-center justify-between max-w-[1280px] mx-auto">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="text-[#bf5c3b]">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="28"
                            height="28"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="m3 17 6-6 4 4 8-8" />
                            <path d="M17 7h4v4" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-[#171312] dark:text-white">
                        Planin
                    </h2>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium hover:text-[#bf5c3b] transition-colors text-[#171312] dark:text-gray-300"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* Auth Buttons */}
                <div className="flex items-center gap-3">
                    <Link href="/login" className="hidden sm:flex">
                        <Button
                            variant="ghost"
                            className="h-9 text-sm font-bold text-[#171312] dark:text-white hover:bg-black/5 dark:hover:bg-white/10"
                        >
                            Masuk
                        </Button>
                    </Link>
                    <Link href="/signup">
                        <Button className="h-9 bg-[#bf5c3b] text-white font-bold text-sm shadow-md hover:bg-[#bf5c3b]/90 transition-transform active:scale-95">
                            Mulai Sekarang
                        </Button>
                    </Link>

                    {/* Mobile Menu */}
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px]">
                            <div className="flex flex-col gap-4 mt-8">
                                {navLinks.map((link) => (
                                    <a
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setOpen(false)}
                                        className="text-lg font-medium hover:text-[#bf5c3b] transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                ))}
                                <hr className="my-4" />
                                <Link href="/login" onClick={() => setOpen(false)}>
                                    <Button variant="outline" className="w-full">
                                        Masuk
                                    </Button>
                                </Link>
                                <Link href="/signup" onClick={() => setOpen(false)}>
                                    <Button className="w-full bg-[#bf5c3b] hover:bg-[#bf5c3b]/90">
                                        Mulai Sekarang
                                    </Button>
                                </Link>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
}
