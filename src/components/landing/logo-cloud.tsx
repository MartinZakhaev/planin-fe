import { Building2, Hammer, Settings, PenTool, Plane } from "lucide-react";

const logos = [
    { name: "SKYLINE", icon: Building2 },
    { name: "CONSTRUCT", icon: Hammer },
    { name: "BUILDERZ", icon: Settings },
    { name: "Blueprint.io", icon: PenTool },
    { name: "HeavyLift", icon: Plane },
];

export function LogoCloud() {
    return (
        <section className="border-y bg-card">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <p className="text-center text-xs font-medium text-muted-foreground uppercase tracking-widest mb-10">
                    Trusted by Industry Leaders
                </p>
                <div className="flex flex-wrap justify-center items-center gap-x-14 gap-y-8">
                    {logos.map((logo) => {
                        const Icon = logo.icon;
                        return (
                            <div
                                key={logo.name}
                                className="flex items-center gap-2.5 text-sm font-semibold text-muted-foreground/70 hover:text-foreground transition-colors"
                            >
                                <Icon className="size-5" />
                                {logo.name}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}