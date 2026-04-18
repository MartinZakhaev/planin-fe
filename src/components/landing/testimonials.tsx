import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Quote, Star, Check } from "lucide-react";

const testimonials = [
    {
        quote:
            "Finally, a tool that understands construction finance complexity. We saved 15% on material waste in the first quarter alone.",
        name: "Marcus Chen",
        role: "Senior PM, BuildRight Inc.",
        initials: "MC",
        stars: 5,
        bgColor: "bg-blue-600 text-white",
    },
    {
        quote:
            "The integration between labor tracking and payroll estimation is seamless. It's cut our administrative work in half.",
        name: "Sarah Jenkins",
        role: "Operations Director, Apex Construction",
        initials: "SJ",
        stars: 5,
        bgColor: "bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900",
    },
    {
        quote:
            "I used to dread end-of-month reconciliation. With Planin, everything is logged in real-time. It's a game changer.",
        name: "David Miller",
        role: "General Contractor",
        initials: "DM",
        stars: 5,
        bgColor: "bg-slate-300 text-slate-800",
    },
];

const stats = [
    { value: "1,200+", label: "Active Users" },
    { value: "50M+", label: "Budget Tracked" },
    { value: "99.9%", label: "Uptime SLA" },
    { value: "4.9/5", label: "Average Rating" },
];

export function Testimonials() {
    return (
        <section id="testimonials" className="py-20 md:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <Badge variant="secondary" className="mb-3 text-xs">
                        Testimonials
                    </Badge>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                        Trusted by Project Managers
                    </h2>
                    <p className="text-muted-foreground">
                        Don&apos;t just take our word for it. Here&apos;s what industry
                        professionals say.
                    </p>
                </div>

                {/* Testimonial Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {testimonials.map((testimonial) => (
                        <Card
                            key={testimonial.name}
                            className="relative overflow-hidden border shadow-sm"
                        >
                            <CardContent className="p-6 space-y-5">
                                {/* Quote Icon */}
                                <Quote className="size-10 text-primary/10 absolute top-6 right-6" />

                                {/* Stars */}
                                <div className="flex gap-1">
                                    {[...Array(testimonial.stars)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className="size-4 text-amber-400 fill-amber-400"
                                        />
                                    ))}
                                </div>

                                <p className="text-sm leading-relaxed text-foreground/80">
                                    &quot;{testimonial.quote}&quot;
                                </p>

                                {/* Author */}
                                <div className="flex items-center gap-3 pt-4 border-t">
                                    <div
                                        className={`flex h-10 w-10 items-center justify-center rounded-lg text-xs font-bold shadow-sm ${testimonial.bgColor}`}
                                    >
                                        {testimonial.initials}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{testimonial.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {testimonial.role}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Trust Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 p-8 bg-muted/50 rounded-2xl">
                    {stats.map((stat) => (
                        <div key={stat.label} className="text-center">
                            <p className="text-3xl font-bold text-primary mb-1">{stat.value}</p>
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}