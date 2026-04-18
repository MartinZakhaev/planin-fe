"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, ArrowRight, Check } from "lucide-react";

const trustBadges = [
    "ISO 27001 Certified",
    "SOC 2 Type II",
    "GDPR Compliant",
];

const socialProofAvatars = [
    { initials: "AK", bg: "bg-slate-300 text-slate-800" },
    { initials: "MR", bg: "bg-slate-400 text-white" },
    { initials: "SJ", bg: "bg-blue-200 text-blue-900" },
    { initials: "DL", bg: "bg-slate-600 text-white" },
];

export function Hero() {
    return (
        <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-36 bg-white dark:bg-background border-b border-border/40">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Content */}
                    <div className="flex flex-col gap-8 max-w-xl">
                        {/* Badge */}
                        <div className="flex flex-wrap items-center gap-3">
                            <Badge variant="secondary" className="text-xs font-medium bg-secondary text-secondary-foreground">
                                V1.0 Now Available
                            </Badge>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="inline-flex items-center gap-1">
                                    <Check className="size-3.5" />
                                    {trustBadges[0]}
                                </span>
                                <span className="hidden sm:inline text-muted-foreground/50">|</span>
                                <span className="hidden sm:inline-flex items-center gap-1">
                                    <Check className="size-3.5" />
                                    {trustBadges[1]}
                                </span>
                            </div>
                        </div>

                        {/* Headline */}
                        <div className="space-y-4">
                            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-slate-900 dark:text-slate-50 leading-[1.05]">
                                Build with Precision.{" "}
                                <span className="text-primary block mt-2">Manage Every Rupiah.</span>
                            </h1>
                            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg">
                                Construction budget planning software that aligns your financial
                                blueprints with reality. Stop waste. Start predicting costs with
                                engineering accuracy.
                            </p>
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-wrap gap-3">
                            <Link href="/signup">
                                <Button size="lg" className="gap-2 shadow-sm font-semibold">
                                    Start Free Trial
                                    <ArrowRight className="size-4" />
                                </Button>
                            </Link>
                            <Button size="lg" variant="outline" className="gap-2 bg-white hover:bg-slate-50 text-slate-700 dark:bg-background dark:text-slate-300">
                                <Play className="size-4" />
                                Watch Demo
                            </Button>
                        </div>

                        {/* Social Proof */}
                        <div className="flex items-center gap-4 pt-2">
                            <div className="flex -space-x-2">
                                {socialProofAvatars.map((avatar) => (
                                    <div
                                        key={avatar.initials}
                                        className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-white dark:border-background text-[10px] font-semibold ${avatar.bg}`}
                                    >
                                        {avatar.initials}
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                    Trusted by 1,200+ Project Managers
                                </p>
                                <div className="flex items-center gap-1">
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <svg
                                                key={star}
                                                className="size-4 text-amber-400 fill-amber-400"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <span className="text-xs text-slate-500">4.9/5</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hero Image / Dashboard Mockup */}
                    <div className="relative w-full h-full lg:min-h-[500px] flex items-center justify-center">
                        <div className="relative w-full rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50 bg-slate-50 dark:bg-slate-900/50">
                            {/* Browser/App Header Bar */}
                            <div className="h-10 border-b border-inherit bg-slate-100/50 dark:bg-slate-800/50 flex items-center px-4">
                                <div className="flex space-x-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                                </div>
                            </div>
                            {/* Dashboard Image */}
                            <img
                                src="/dashboard-mockup.png"
                                alt="TERRA Budget App Interface"
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}