"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, ArrowRight, Check } from "lucide-react";
import Image from "next/image";

const trustBadges = [
    "ISO 27001 Certified",
    "SOC 2 Type II",
    "Powered by Doku",
];

const socialProofAvatars = [
    { initials: "AK", bg: "bg-slate-300 text-slate-800" },
    { initials: "MR", bg: "bg-slate-400 text-white" },
    { initials: "SJ", bg: "bg-blue-200 text-blue-900" },
    { initials: "DL", bg: "bg-slate-600 text-white" },
];

const heroVideos = [
    {
        src: "https://planin-cdn.terra-dev.web.id/videos/Video_Konstruksi_Rumah_Keluarga_Komersial.mp4",
        label: "Site Progress",
        metric: "Live build",
        mask: "polygon(0 0, 100% 0, 84% 100%, 0 100%)",
        align: "object-[48%_50%]",
    },
    {
        src: "https://planin-cdn.terra-dev.web.id/videos/Video_Timelapse_Konstruksi_Siap.mp4",
        label: "Cost Timeline",
        metric: "Planned vs actual",
        mask: "polygon(16% 0, 100% 0, 100% 100%, 0 100%)",
        align: "object-[52%_50%]",
    },
];

export function Hero() {
    return (
        <section className="relative overflow-hidden pt-24 pb-20 lg:pt-32 lg:pb-36 bg-white dark:bg-background border-b border-border/40">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_82%_18%,rgba(14,165,233,0.14),transparent_32%),linear-gradient(135deg,rgba(15,23,42,0.04)_0%,transparent_42%)]" />
            <div className="absolute left-0 top-24 -z-10 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-800" />
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
                                <span className="hidden md:inline text-muted-foreground/50">|</span>
                                <span className="hidden md:inline-flex items-center gap-1.5">
                                    <Image src="/doku_logo.svg" alt="Doku" width={14} height={14} />
                                    <span className="text-primary font-medium">{trustBadges[2]}</span>
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

                    {/* Hero Video Frame */}
                    <div className="relative w-full lg:min-h-[560px] flex items-center justify-center">
                        <div className="absolute inset-x-8 top-8 h-24 rounded-full bg-cyan-300/20 blur-3xl dark:bg-cyan-500/10" />
                        <div className="relative w-full max-w-2xl">
                            <div className="absolute -inset-3 rounded-[2.35rem] bg-[linear-gradient(135deg,rgba(37,99,235,0.30),rgba(20,184,166,0.18)_42%,rgba(15,23,42,0.12))] blur-2xl" />
                            <div className="absolute -inset-px rounded-[2rem] bg-gradient-to-br from-white via-sky-200/70 to-slate-300/70 p-px dark:from-white/30 dark:via-cyan-300/25 dark:to-white/10" />
                            <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-slate-950 shadow-[0_32px_90px_rgba(15,23,42,0.20)] dark:border-white/10 dark:shadow-black/40">
                                <div className="absolute inset-0 z-20 pointer-events-none bg-[linear-gradient(120deg,rgba(255,255,255,0.18),transparent_22%,transparent_70%,rgba(255,255,255,0.08))]" />
                                <div className="absolute inset-0 z-20 pointer-events-none ring-1 ring-inset ring-white/25" />
                                <div className="absolute inset-x-4 top-0 z-20 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />

                                <div className="relative min-h-[360px] sm:min-h-[430px]">
                                    {heroVideos.map((video, index) => (
                                        <div
                                            key={video.src}
                                            className={`group absolute inset-y-0 overflow-hidden ${index === 0
                                                ? "left-0 z-10 w-[58%]"
                                                : "right-0 z-20 w-[58%]"
                                                }`}
                                            style={{
                                                clipPath: video.mask,
                                                WebkitMaskImage:
                                                    "linear-gradient(180deg, transparent 0%, #000 10%, #000 90%, transparent 100%)",
                                                maskImage:
                                                    "linear-gradient(180deg, transparent 0%, #000 10%, #000 90%, transparent 100%)",
                                            }}
                                        >
                                            <video
                                                src={video.src}
                                                className={`h-full w-full object-cover ${video.align} transition-transform duration-700 group-hover:scale-105`}
                                                autoPlay
                                                muted
                                                loop
                                                playsInline
                                                preload="auto"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/10 to-transparent" />
                                            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/25 via-transparent to-slate-950/20" />
                                            <div className="absolute bottom-5 left-5 right-5 z-10 flex items-end justify-between gap-3 text-white">
                                                <div>
                                                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/65">
                                                        {video.label}
                                                    </p>
                                                    <p className="mt-1 text-lg font-semibold tracking-tight">
                                                        {video.metric}
                                                    </p>
                                                </div>
                                                <div className="hidden h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur sm:flex">
                                                    <Play className="size-4 fill-white" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div
                                        className="pointer-events-none absolute inset-y-0 left-0 z-30 w-full bg-gradient-to-b from-transparent via-white/20 to-transparent blur-[2px]"
                                        style={{ clipPath: "polygon(50.6% 0, 52% 0, 42.7% 100%, 41.3% 100%)" }}
                                    />
                                    <div
                                        className="pointer-events-none absolute inset-y-0 left-0 z-30 w-full bg-gradient-to-b from-transparent via-white/40 to-transparent"
                                        style={{ clipPath: "polygon(51.18% 0, 51.38% 0, 42.1% 100%, 41.9% 100%)" }}
                                    />
                                </div>

                                <div className="absolute left-5 top-5 z-30 flex items-center gap-2 rounded-full border border-white/15 bg-slate-950/45 px-3 py-2 text-xs font-medium text-white shadow-lg backdrop-blur-md">
                                    <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.9)]" />
                                    Project visibility
                                </div>
                                <div className="absolute right-5 top-5 z-40 hidden rounded-xl border border-white/35 bg-white/90 px-4 py-3 shadow-xl shadow-slate-950/20 backdrop-blur-xl md:block">
                                    <p className="text-xs font-medium text-slate-500">
                                        Budget locked
                                    </p>
                                    <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
                                        Rp 8.7B
                                    </p>
                                </div>
                            </div>

                            <div className="relative z-20 mx-auto mt-4 flex w-[min(92%,28rem)] items-center justify-between rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 shadow-[0_18px_50px_rgba(15,23,42,0.14)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/80">
                                <div>
                                    <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                                        Variance
                                    </p>
                                    <p className="mt-1 text-xl font-bold text-slate-950 dark:text-white">
                                        -12.4%
                                    </p>
                                </div>
                                <div className="h-10 w-px bg-slate-200 dark:bg-white/10" />
                                <div className="text-right">
                                    <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                                        Forecast
                                    </p>
                                    <p className="mt-1 text-xl font-bold text-primary">
                                        96%
                                    </p>
                                </div>
                            </div>

                            <div className="absolute -bottom-3 left-8 right-8 -z-10 h-24 rounded-[50%] bg-slate-900/20 blur-2xl dark:bg-black/40" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
