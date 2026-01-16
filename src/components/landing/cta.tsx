import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTA() {
    return (
        <section className="py-24 bg-[#f8f6f6] dark:bg-[#1e1614] px-4 md:px-10">
            <div className="max-w-4xl mx-auto bg-[#bf5c3b] rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
                {/* Decorative Circles */}
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-white opacity-10 rounded-full pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white opacity-10 rounded-full pointer-events-none" />

                <h2 className="relative z-10 text-3xl md:text-5xl font-black mb-6 tracking-tight">
                    Siap untuk memulai penganggaran yang lebih baik?
                </h2>
                <p className="relative z-10 text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                    Bergabunglah dengan ribuan profesional konstruksi yang menyelesaikan
                    proyek tepat waktu dan di bawah anggaran.
                </p>

                <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/signup">
                        <Button className="h-14 px-8 bg-white text-[#bf5c3b] font-bold text-lg shadow-lg hover:bg-gray-100 transition-colors">
                            Mulai Uji Coba Gratis
                        </Button>
                    </Link>
                    <Button
                        variant="outline"
                        className="h-14 px-8 bg-[#bf5c3b] border-2 border-white/30 text-white font-bold text-lg hover:bg-[#bf5c3b]/80 transition-colors"
                    >
                        Lihat Demo Sekarang
                    </Button>
                </div>

                <p className="relative z-10 mt-6 text-sm text-white/70">
                    Tidak perlu kartu kredit. Uji coba gratis 14 hari.
                </p>
            </div>
        </section>
    );
}
