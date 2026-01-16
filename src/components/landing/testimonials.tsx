import { Quote } from "lucide-react";

const testimonials = [
    {
        quote:
            "Akhirnya, alat yang memahami kompleksitas keuangan konstruksi. Kami menghemat 15% pada limbah material di kuartal pertama saja.",
        name: "Marcus Chen",
        role: "Senior PM, BuildRight Inc.",
        image: "MC",
    },
    {
        quote:
            "Integrasi antara pelacakan tenaga kerja dan estimasi penggajian sangat lancar. Ini telah memangkas pekerjaan administratif kami hingga separuhnya.",
        name: "Sarah Jenkins",
        role: "Direktur Operasional, Apex Construction",
        image: "SJ",
    },
    {
        quote:
            "Saya dulu takut rekonsiliasi akhir bulan. Dengan Planin, semuanya dicatat secara real-time. Ini adalah perubahan besar.",
        name: "David Miller",
        role: "Kontraktor Umum",
        image: "DM",
    },
];

export function Testimonials() {
    return (
        <section
            id="testimonials"
            className="py-20 px-4 md:px-10 bg-[#f8f6f6] dark:bg-[#1e1614]"
        >
            <div className="max-w-[1280px] mx-auto">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold mb-4 text-[#171312] dark:text-white">
                        Dibuat untuk Manajer Proyek
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Jangan hanya percaya kata-kata kami. Inilah pendapat industri.
                    </p>
                </div>

                {/* Testimonial Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((testimonial) => (
                        <div
                            key={testimonial.name}
                            className="bg-white dark:bg-[#2a2220] p-8 rounded-xl border border-[#e4dfdd] dark:border-[#3a2e2b] relative"
                        >
                            <Quote className="w-12 h-12 text-[#bf5c3b]/20 absolute top-6 right-6" />
                            <p className="text-[#171312] dark:text-gray-200 mb-8 relative z-10 text-lg leading-relaxed">
                                &quot;{testimonial.quote}&quot;
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded bg-gradient-to-br from-[#bf5c3b] to-[#8b3a24] flex items-center justify-center text-white font-bold text-sm">
                                    {testimonial.image}
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-[#171312] dark:text-white">
                                        {testimonial.name}
                                    </h4>
                                    <p className="text-xs text-gray-500">{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
