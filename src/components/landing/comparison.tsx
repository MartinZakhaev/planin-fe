import { ArrowLeftRight, CheckCircle } from "lucide-react";

const benefits = [
    {
        title: "Laporan Varians Otomatis",
        description:
            "Dapatkan notifikasi segera ketika item baris melebihi estimasi.",
    },
    {
        title: "Benchmarking Data Historis",
        description:
            "Gunakan data dari pekerjaan masa lalu untuk menawar lebih cerdas di masa depan.",
    },
    {
        title: "Dasbor Multi-Proyek",
        description:
            "Lihat kesehatan keuangan seluruh portofolio Anda dalam sekilas pandang.",
    },
];

const budgetItems = [
    { name: "Beton & Pondasi", percentage: 102, status: "over", color: "red" },
    { name: "Rangka & Dinding", percentage: 45, status: "ok", color: "green" },
    { name: "Listrik & Pipa", percentage: 12, status: "ok", color: "primary" },
];

export function Comparison() {
    return (
        <section className="py-20 bg-[#171312] text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: "radial-gradient(#bf5c3b 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                }}
            />

            <div className="max-w-[1280px] mx-auto px-4 md:px-0 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Dashboard Preview */}
                    <div className="order-2 lg:order-1">
                        <div className="bg-[#2a2220] border border-gray-700 rounded-xl p-1 shadow-2xl">
                            {/* Tab Header */}
                            <div className="flex bg-[#1e1614] rounded-lg p-1 mb-1">
                                <div className="flex-1 py-2 text-center text-sm font-bold text-gray-500">
                                    Spreadsheet Tradisional
                                </div>
                                <div className="flex-1 py-2 text-center text-sm font-bold bg-[#2a2220] rounded shadow text-white border border-gray-700">
                                    Dasbor Planin
                                </div>
                            </div>

                            {/* Dashboard Content */}
                            <div className="bg-[#2a2220] p-6 rounded-lg min-h-[300px] flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-bold text-lg">Ringkasan Proyek Q3</h4>
                                    <button className="text-xs bg-[#bf5c3b]/20 text-[#bf5c3b] px-2 py-1 rounded hover:bg-[#bf5c3b]/30 transition">
                                        Ekspor PDF
                                    </button>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-[#1e1614] p-4 rounded border border-gray-800">
                                        <p className="text-xs text-gray-500 mb-1">Total Anggaran</p>
                                        <p className="text-lg font-bold text-white">450jt</p>
                                    </div>
                                    <div className="bg-[#1e1614] p-4 rounded border border-gray-800">
                                        <p className="text-xs text-gray-500 mb-1">Terpakai</p>
                                        <p className="text-lg font-bold text-[#bf5c3b]">320jt</p>
                                    </div>
                                    <div className="bg-[#1e1614] p-4 rounded border border-gray-800">
                                        <p className="text-xs text-gray-500 mb-1">Sisa</p>
                                        <p className="text-lg font-bold text-green-500">130jt</p>
                                    </div>
                                </div>

                                {/* Progress Bars */}
                                <div className="mt-2 space-y-3">
                                    {budgetItems.map((item) => (
                                        <div key={item.name}>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-gray-400">{item.name}</span>
                                                <span
                                                    className={`font-bold ${item.color === "red"
                                                        ? "text-red-400"
                                                        : item.color === "green"
                                                            ? "text-green-400"
                                                            : "text-[#bf5c3b]"
                                                        }`}
                                                >
                                                    {item.percentage}%
                                                    {item.status === "over" && " (Berlebih)"}
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-800 rounded-full h-1.5">
                                                <div
                                                    className={`h-1.5 rounded-full ${item.color === "red"
                                                        ? "bg-red-500"
                                                        : item.color === "green"
                                                            ? "bg-green-500"
                                                            : "bg-[#bf5c3b]"
                                                        }`}
                                                    style={{
                                                        width: `${Math.min(item.percentage, 100)}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="order-1 lg:order-2">
                        <div className="inline-block p-3 rounded-lg bg-[#bf5c3b]/20 mb-6">
                            <ArrowLeftRight className="w-7 h-7 text-[#bf5c3b]" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            Berhenti menduga. Mulai mengetahui.
                        </h2>
                        <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                            Spreadsheet statis menyembunyikan kebenaran sampai terlambat.
                            Planin mengubah data mentah Anda menjadi wawasan yang dapat
                            ditindaklanjuti, menyoroti risiko sebelum menjadi pembengkakan
                            biaya.
                        </p>

                        {/* Benefits List */}
                        <ul className="space-y-4">
                            {benefits.map((benefit) => (
                                <li key={benefit.title} className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                                    <div>
                                        <strong className="block text-white">{benefit.title}</strong>
                                        <span className="text-sm text-gray-400">
                                            {benefit.description}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
