import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const plans = [
    {
        name: "Basic",
        description: "Gratis untuk kontraktor individu.",
        price: "Rp 0",
        period: "/bulan",
        features: [
            { name: "1 Proyek Aktif", included: true },
            { name: "Pelacakan Biaya Dasar", included: true },
            { name: "Akses Aplikasi Seluler", included: true },
            { name: "Estimasi Material", included: false },
        ],
        cta: "Mulai Gratis",
        featured: false,
    },
    {
        name: "Pro",
        description: "Ideal untuk tim konstruksi kecil.",
        price: "Rp 750k",
        period: "/bulan",
        features: [
            { name: "Proyek Aktif Tak Terbatas", included: true },
            { name: "Analisis & Laporan Lanjutan", included: true },
            { name: "Estimasi Material & Tenaga Kerja", included: true },
            { name: "Pemindaian Tanda Terima (OCR)", included: true },
            { name: "Dukungan Email Prioritas", included: true },
        ],
        cta: "Mulai Uji Coba Gratis",
        featured: true,
    },
    {
        name: "Enterprise",
        description: "Solusi khusus untuk perusahaan besar.",
        price: "Khusus",
        period: "",
        features: [
            { name: "Semua fitur di Pro", included: true },
            { name: "Manajer Akun Berdedikasi", included: true },
            { name: "Integrasi API Khusus", included: true },
            { name: "Pelatihan & Pengaturan di Lokasi", included: true },
            { name: "SLA & Keamanan Perusahaan", included: true },
        ],
        cta: "Hubungi Kami untuk Harga Khusus",
        featured: false,
    },
];

export function Pricing() {
    return (
        <section
            id="pricing"
            className="py-20 bg-gray-50 dark:bg-[#241c1a] border-t border-b border-[#e4dfdd] dark:border-[#3a2e2b]"
        >
            <div className="max-w-[1280px] mx-auto px-4 md:px-0">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold mb-4 text-[#171312] dark:text-white">
                        Harga Simpel dan Transparan
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Pilih paket yang sesuai dengan skala proyek konstruksi Anda.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`bg-white dark:bg-[#2a2220] rounded-2xl p-8 flex flex-col h-full ${plan.featured
                                ? "border-2 border-[#bf5c3b] relative shadow-xl transform scale-105 z-10"
                                : "border border-[#e4dfdd] dark:border-[#3a2e2b] shadow-sm hover:shadow-xl transition-shadow"
                                }`}
                        >
                            {plan.featured && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#bf5c3b] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    Terpopuler
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-[#171312] dark:text-white mb-2">
                                    {plan.name}
                                </h3>
                                <p className="text-sm text-gray-500 mb-4">{plan.description}</p>
                                <div className="flex items-end gap-1">
                                    <span className="text-4xl font-black text-[#171312] dark:text-white">
                                        {plan.price}
                                    </span>
                                    <span className="text-gray-500 mb-1">{plan.period}</span>
                                </div>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                {plan.features.map((feature) => (
                                    <li
                                        key={feature.name}
                                        className={`flex items-start gap-3 text-sm ${feature.included
                                            ? "text-gray-600 dark:text-gray-300"
                                            : "text-gray-400"
                                            }`}
                                    >
                                        {feature.included ? (
                                            <Check
                                                className={`w-4 h-4 shrink-0 mt-0.5 ${plan.featured ? "text-[#bf5c3b]" : "text-green-500"
                                                    }`}
                                            />
                                        ) : (
                                            <X className="w-4 h-4 shrink-0 mt-0.5 text-gray-300 dark:text-gray-600" />
                                        )}
                                        <span>{feature.name}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link href="/signup">
                                <Button
                                    className={`w-full py-3 font-bold ${plan.featured
                                        ? "bg-[#bf5c3b] text-white hover:bg-[#bf5c3b]/90 shadow-lg shadow-[#bf5c3b]/20"
                                        : "border-2 border-[#171312] dark:border-gray-600 bg-transparent text-[#171312] dark:text-white hover:bg-gray-50 dark:hover:bg-[#3a2e2b]"
                                        }`}
                                    variant={plan.featured ? "default" : "outline"}
                                >
                                    {plan.cta}
                                </Button>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
