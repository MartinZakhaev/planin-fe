import {
    Navbar,
    Hero,
    LogoCloud,
    Features,
    Comparison,
    Testimonials,
    Pricing,
    CTA,
    Footer,
} from "@/components/landing";

export function LandingPage() {
    return (
        <div className="min-h-screen bg-[#f8f6f6] dark:bg-[#1e1614] text-[#171312] dark:text-gray-100 font-display overflow-x-hidden antialiased">
            <Navbar />
            <main>
                <Hero />
                <LogoCloud />
                <Features />
                <Comparison />
                <Testimonials />
                <Pricing />
                <CTA />
            </main>
            <Footer />
        </div>
    );
}
