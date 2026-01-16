import Link from "next/link";
import { siX, siInstagram } from "simple-icons";

const footerLinks = {
    produk: [
        { name: "Fitur", href: "#features" },
        { name: "Integrasi", href: "#" },
        { name: "Harga", href: "#pricing" },
        { name: "Log Perubahan", href: "#" },
    ],
    perusahaan: [
        { name: "Tentang Kami", href: "#" },
        { name: "Karir", href: "#" },
        { name: "Blog", href: "#" },
        { name: "Kontak", href: "#" },
    ],
    legal: [
        { name: "Kebijakan Privasi", href: "#" },
        { name: "Syarat Layanan", href: "#" },
        { name: "Keamanan", href: "#" },
    ],
};

const socialLinks = [
    { name: "X", path: siX.path, href: "#" },
    { name: "Instagram", path: siInstagram.path, href: "#" },
];

export function Footer() {
    return (
        <footer className="bg-white dark:bg-[#1e1614] border-t border-[#e4dfdd] dark:border-[#3a2e2b] pt-16 pb-8 px-4 md:px-10">
            <div className="max-w-[1280px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <div className="text-[#bf5c3b]">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="28"
                                    height="28"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="m3 17 6-6 4 4 8-8" />
                                    <path d="M17 7h4v4" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold tracking-tight text-[#171312] dark:text-white">
                                Planin
                            </h2>
                        </Link>
                        <p className="text-gray-500 mb-6 max-w-xs leading-relaxed">
                            Perangkat lunak perencanaan anggaran konstruksi #1 untuk tim
                            modern. Bangun lebih baik, belanjakan lebih cerdas.
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-[#bf5c3b] hover:text-white transition-colors"
                                    aria-label={social.name}
                                >
                                    <svg
                                        role="img"
                                        viewBox="0 0 24 24"
                                        className="w-5 h-5 fill-current"
                                    >
                                        <path d={social.path} />
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="font-bold text-[#171312] dark:text-white mb-4">
                            Produk
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.produk.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-gray-500 hover:text-[#bf5c3b] transition-colors text-sm"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-[#171312] dark:text-white mb-4">
                            Perusahaan
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.perusahaan.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-gray-500 hover:text-[#bf5c3b] transition-colors text-sm"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-[#171312] dark:text-white mb-4">
                            Legal
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.legal.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-gray-500 hover:text-[#bf5c3b] transition-colors text-sm"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-sm">
                        © {new Date().getFullYear()} Planin Inc. Hak Cipta Dilindungi Undang-Undang.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                        Sistem Operasional
                    </div>
                </div>
            </div>
        </footer>
    );
}
