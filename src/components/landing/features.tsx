import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Building2, Users, ArrowRight, Check } from "lucide-react";

const features = [
    {
        icon: TrendingUp,
        title: "Real-time Cost Tracking",
        description:
            "Monitor expenses as they happen. Snap receipt photos and tag them to specific line items instantly.",
        highlights: ["Instant sync across devices", "Receipt OCR scanning", "Rupiah-first reporting"],
        badge: "Popular",
    },
    {
        icon: Building2,
        title: "Material Cost Estimation",
        description:
            "Get accurate material estimates based on current market prices and historical project data.",
        highlights: ["Market-price database", "Historical benchmarking", "Auto-updated quotes"],
        badge: null,
    },
    {
        icon: Users,
        title: "Workforce Management",
        description:
            "Track work hours, overtime, and labor costs efficiently. Assign crews to tasks and monitor productivity.",
        highlights: ["GPS attendance tracking", "Overtime calculation", "Productivity analytics"],
        badge: null,
    },
];

export function Features() {
    return (
        <section id="features" className="py-20 md:py-28 bg-muted/40">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                    <div className="max-w-xl">
                        <Badge variant="secondary" className="mb-3 text-xs">
                            Core Features
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                            Built for the Jobsite
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            Everything you need to keep construction projects on budget, on
                            time, and up to standard.
                        </p>
                    </div>
                    <a
                        href="#"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:gap-2.5 transition-all"
                    >
                        View all features
                        <ArrowRight className="size-4" />
                    </a>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <Card
                                key={feature.title}
                                className="group relative overflow-hidden border shadow-sm"
                            >
                                <CardContent className="p-6 space-y-5">
                                    <div className="flex items-start justify-between">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                            <Icon className="size-6" />
                                        </div>
                                        {feature.badge && (
                                            <Badge variant="secondary" className="text-xs">
                                                {feature.badge}
                                            </Badge>
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">
                                            {feature.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>

                                    {/* Feature Highlights */}
                                    <div className="space-y-2 pt-2">
                                        {feature.highlights.map((highlight) => (
                                            <div
                                                key={highlight}
                                                className="flex items-center gap-2.5 text-sm text-muted-foreground"
                                            >
                                                <Check className="size-4 text-primary shrink-0" />
                                                {highlight}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
