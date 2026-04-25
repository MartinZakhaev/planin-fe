import { Badge } from "@/components/ui/badge";
import { CheckCircle2, TrendingDown, TrendingUp, BarChart3, AlertCircle } from "lucide-react";

export function Comparison() {
    return (
        <section className="py-24 bg-white dark:bg-background border-t border-slate-200 dark:border-slate-800">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Data Visualization / Insight Card */}
                    <div className="order-2 lg:order-1 relative">
                        {/* A very clean, austere data card like a real enterprise tool */}
                        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                                <div className="flex items-center gap-2">
                                    <BarChart3 className="size-4 text-slate-500" />
                                    <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">Live Variance Detection</h3>
                                </div>
                                <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 bg-white dark:bg-slate-950 rounded-sm">
                                    Auto-Synced
                                </Badge>
                            </div>
                            
                            <div className="p-6 space-y-7">
                                {/* Topline Metrics */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Forecasted Cost</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-semibold text-slate-900 dark:text-slate-100 font-mono tracking-tight">Rp 2,4 M</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Variance vs Budget</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-semibold text-rose-600 dark:text-rose-500 font-mono tracking-tight">+Rp 182 jt</span>
                                            <span className="flex items-center text-xs font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-1.5 py-0.5 rounded-sm">
                                                <TrendingUp className="size-3 mr-1" />
                                                8.2%
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px bg-slate-100 dark:bg-slate-800" />

                                {/* Line Items */}
                                <div className="space-y-4 pt-1">
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                                            <span className="text-slate-600 dark:text-slate-400 font-medium">Foundation Materials</span>
                                        </div>
                                        <span className="font-mono text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">On Budget</span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                            <span className="text-slate-900 dark:text-slate-100 font-semibold">Structural Steel</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <AlertCircle className="size-3.5 text-rose-500" />
                                            <span className="font-mono text-rose-600 dark:text-rose-500 font-semibold">+Rp 145 jt</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            <span className="text-slate-600 dark:text-slate-400 font-medium">Site Prep</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <TrendingDown className="size-3.5 text-emerald-500" />
                                            <span className="font-mono text-emerald-600 dark:text-emerald-500 font-semibold">-Rp 37 jt</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Subtle decorative background element, extremely professional and minimal */}
                        <div className="absolute -inset-3 sm:-inset-4 bg-slate-50/80 dark:bg-slate-900/30 rounded-[18px] -z-10 border border-slate-100 dark:border-slate-800/30" />
                    </div>

                    {/* Explanatory Content */}
                    <div className="order-1 lg:order-2 lg:pl-8">
                        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 mb-5 leading-tight">
                            Spot cost overruns instantly.
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg mb-10">
                            Planin automatically correlates your field data with your original estimates. Stop waiting for end-of-month accounting to realize you are bleeding budget.
                        </p>

                        <div className="space-y-6 md:space-y-8">
                            <div className="flex gap-4">
                                <div className="mt-0.5">
                                    <CheckCircle2 className="size-5 text-primary" />
                                </div>
                                <div>
                                    <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1.5">Real-time Variance Tracking</h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed text-balance">Watch your actuals vs. budget update the moment an invoice is approved or a timesheet is logged.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="mt-0.5">
                                    <CheckCircle2 className="size-5 text-primary" />
                                </div>
                                <div>
                                    <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1.5">Drill-down Analytics</h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed text-balance">Click into any overage to instantly see the specific line items, vendor bills, or labor categories driving the cost.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
