import { TrendingUp, Building2, Users, ArrowRight } from "lucide-react";

const features = [
    {
        icon: TrendingUp,
        title: "Pelacakan Biaya Real-time",
        description:
            "Pantau pengeluaran saat terjadi. Foto tanda terima dan tandai ke item baris tertentu secara instan.",
        color: "bg-[#bf5c3b]/10 text-[#bf5c3b]",
        preview: (
            <div className="h-32 bg-[#f8f6f6] dark:bg-[#1e1614] rounded-lg border border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-x-4 top-4 bottom-0 bg-white dark:bg-[#2a2220] rounded-t-lg shadow-sm p-3 opacity-80">
                    <div className="flex justify-between text-xs font-bold mb-2 text-gray-400">
                        <span>PENGELUARAN</span>
                        <span>LIVE</span>
                    </div>
                    <div className="h-2 w-3/4 bg-gray-100 dark:bg-gray-700 rounded mb-2" />
                    <div className="h-2 w-1/2 bg-gray-100 dark:bg-gray-700 rounded" />
                </div>
            </div>
        ),
    },
    {
        icon: Building2,
        title: "Estimasi Biaya Material",
        description:
            "Dapatkan estimasi akurat untuk bahan baku berdasarkan harga pasar saat ini dan data historis proyek.",
        color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
        preview: (
            <div className="h-32 bg-[#f8f6f6] dark:bg-[#1e1614] rounded-lg border border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center relative overflow-hidden">
                <div className="flex gap-2 items-end">
                    <div className="w-8 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-sm" />
                    <div className="w-8 h-20 bg-blue-200 dark:bg-blue-800/30 rounded-sm" />
                    <div className="w-8 h-12 bg-blue-300 dark:bg-blue-700/30 rounded-sm" />
                </div>
            </div>
        ),
    },
    {
        icon: Users,
        title: "Manajemen Tenaga Kerja",
        description:
            "Lacak jam kerja, lembur, dan biaya tenaga kerja secara efisien. Tetapkan kru untuk tugas dan pantau produktivitas.",
        color:
            "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
        preview: (
            <div className="h-32 bg-[#f8f6f6] dark:bg-[#1e1614] rounded-lg border border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center relative overflow-hidden">
                <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-orange-100 border-2 border-white dark:border-[#1e1614]" />
                    <div className="w-8 h-8 rounded-full bg-orange-200 border-2 border-white dark:border-[#1e1614]" />
                    <div className="w-8 h-8 rounded-full bg-orange-300 border-2 border-white dark:border-[#1e1614]" />
                </div>
            </div>
        ),
    },
];

export function Features() {
    return (
        <section
            id="features"
            className="py-20 px-4 md:px-10 bg-[#f8f6f6] dark:bg-[#1e1614]"
        >
            <div className="max-w-[1280px] mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
                    <div className="max-w-xl">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#171312] dark:text-white">
                            Alat untuk Lokasi Kerja
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Segala yang Anda butuhkan untuk menjaga proyek konstruksi tetap
                            sesuai anggaran, tepat waktu, dan memenuhi standar.
                        </p>
                    </div>
                    <a
                        href="#"
                        className="text-[#bf5c3b] font-bold flex items-center gap-1 hover:gap-2 transition-all"
                    >
                        Lihat semua fitur{" "}
                        <ArrowRight className="w-4 h-4" />
                    </a>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={feature.title}
                                className="group p-8 rounded-2xl bg-white dark:bg-[#2a2220] border border-[#e4dfdd] dark:border-[#3a2e2b] shadow-sm hover:shadow-xl hover:shadow-[#bf5c3b]/5 hover:border-[#bf5c3b]/30 transition-all duration-300"
                            >
                                <div
                                    className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                                >
                                    <Icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-[#171312] dark:text-white">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                                    {feature.description}
                                </p>
                                {feature.preview}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
