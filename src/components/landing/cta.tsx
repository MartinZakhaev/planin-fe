import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CalendarDays, CheckCircle2, Shield, Clock } from "lucide-react";
import Image from "next/image";

const trustPoints = [
    { icon: CheckCircle2, text: "No credit card required" },
    { icon: Shield, text: "Bank-grade security" },
    { icon: "doku", text: "Secured by Doku" },
    { icon: Clock, text: "Cancel anytime" },
];

export function CTA() {
    return (
        <section className="py-24 md:py-32">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <Card className="bg-primary text-primary-foreground overflow-hidden shadow-2xl border-0">
                    <CardContent className="p-10 md:p-16 text-center relative">
                        {/* Decorative background */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute -top-24 -left-24 w-72 h-72 bg-white rounded-full" />
                            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-white rounded-full" />
                        </div>

                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 tracking-tight">
                                Ready to start better budgeting?
                            </h2>
                            <p className="text-lg md:text-xl opacity-90 mb-10 max-w-2xl mx-auto leading-relaxed">
                                Join thousands of construction professionals who deliver projects
                                on time and under budget.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                                <Link href="/signup">
                                    <Button
                                        size="lg"
                                        variant="secondary"
                                        className="gap-2 shadow-lg font-semibold"
                                    >
                                        Start 14-Day Free Trial
                                        <ArrowRight className="size-4" />
                                    </Button>
                                </Link>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="gap-2 border-white/80 bg-white/10 text-white shadow-lg backdrop-blur-sm hover:bg-white hover:text-primary font-semibold"
                                >
                                    <CalendarDays className="size-4" />
                                    Schedule Demo
                                </Button>
                            </div>

                            {/* Trust Indicators */}
                            <div className="flex flex-wrap justify-center gap-6 text-sm opacity-80">
                                {trustPoints.map((point) => (
                                    <div key={point.text} className="flex items-center gap-2">
                                        {point.icon === "doku" ? (
                                            <Image
                                                src="/doku_logo.svg"
                                                alt="Doku"
                                                width={18}
                                                height={18}
                                                className="shrink-0 rounded-[3px] shadow-sm"
                                            />
                                        ) : (
                                            <point.icon className="size-4" />
                                        )}
                                        <span>{point.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
