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
        <section className="border-y border-[#e4dfdd] dark:border-[#3a2e2b] bg-white dark:bg-[#1e1614] py-10">
            <div className="max-w-[1280px] mx-auto px-4 md:px-10">
                <p className="text-center text-sm font-bold text-gray-500 mb-8 uppercase tracking-widest">
                    Dipercaya oleh pemimpin industri
                </p>
                <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    {logos.map((logo) => {
                        const Icon = logo.icon;
                        return (
                            <div
                                key={logo.name}
                                className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2"
                            >
                                <Icon className="w-6 h-6" />
                                {logo.name}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
