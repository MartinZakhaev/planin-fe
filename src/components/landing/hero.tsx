import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

export function Hero() {
    return (
        <header className="relative w-full pt-12 pb-16 md:pt-20 md:pb-32 px-4 md:px-10 bg-[#f8f6f6] dark:bg-[#1e1614]">
            <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                {/* Content */}
                <div className="flex flex-col gap-6 max-w-2xl">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#bf5c3b]/10 border border-[#bf5c3b]/20 w-fit">
                        <span className="w-2 h-2 rounded-full bg-[#bf5c3b] animate-pulse" />
                        <span className="text-xs font-bold text-[#bf5c3b] uppercase tracking-wide">
                            V1.0 Kini Tersedia
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight text-[#171312] dark:text-white">
                        Bangun dengan Presisi. <br />
                        <span className="text-[#bf5c3b]">Kelola Setiap Rupiah.</span>
                    </h1>

                    {/* Description */}
                    <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg">
                        Perencana anggaran konstruksi yang menyelaraskan cetak biru keuangan
                        Anda dengan realitas. Hentikan pemborosan dan mulailah memprediksi
                        biaya dengan akurasi teknik.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-wrap gap-4 pt-4">
                        <Link href="/signup">
                            <Button className="h-12 px-8 bg-[#bf5c3b] text-white font-bold text-base shadow-lg shadow-[#bf5c3b]/20 hover:bg-[#bf5c3b]/90 transition-all hover:-translate-y-0.5">
                                Mulai Uji Coba Gratis
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            className="h-12 px-8 border-[#e4dfdd] dark:border-[#3a2e2b] bg-white dark:bg-white/5 text-[#171312] dark:text-white font-bold text-base hover:bg-gray-50 dark:hover:bg-white/10 transition-all group"
                        >
                            <Play className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                            Lihat Cara Kerja
                        </Button>
                    </div>

                    {/* Social Proof */}
                    <div className="pt-8 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex -space-x-2">
                            <div className="w-8 h-8 rounded-full border-2 border-white dark:border-[#1e1614] bg-gray-200" />
                            <div className="w-8 h-8 rounded-full border-2 border-white dark:border-[#1e1614] bg-gray-300" />
                            <div className="w-8 h-8 rounded-full border-2 border-white dark:border-[#1e1614] bg-gray-400" />
                        </div>
                        <p>Dipercaya oleh 1.200+ Manajer Proyek</p>
                    </div>
                </div>

                {/* Hero Image */}
                <div className="relative w-full h-full min-h-[400px] lg:min-h-[600px] rounded-2xl overflow-hidden shadow-2xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 group">
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{
                            backgroundImage:
                                "url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop')",
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Project Card Overlay */}
                    <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 bg-white dark:bg-[#2a2220] p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase">
                                    Proyek Alpha
                                </p>
                                <h3 className="text-lg font-bold text-[#171312] dark:text-white">
                                    Tahap Pondasi
                                </h3>
                            </div>
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">
                                Sesuai Jadwal
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600 dark:text-gray-300">
                                        Anggaran Terpakai
                                    </span>
                                    <span className="font-bold text-[#171312] dark:text-white">
                                        68%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                        className="bg-[#bf5c3b] h-2 rounded-full transition-all duration-500"
                                        style={{ width: "68%" }}
                                    />
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div className="flex items-center gap-2">
                                    <div className="text-[#bf5c3b]">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <circle cx="12" cy="12" r="10" />
                                            <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                                            <path d="M12 18V6" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Proyeksi</p>
                                        <p className="text-sm font-bold dark:text-white">
                                            Rp 1.850.000.000
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="text-gray-400">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                                            <line x1="16" x2="16" y1="2" y2="6" />
                                            <line x1="8" x2="8" y1="2" y2="6" />
                                            <line x1="3" x2="21" y1="10" y2="10" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Tenggat Waktu</p>
                                        <p className="text-sm font-bold dark:text-white">Okt 24</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
