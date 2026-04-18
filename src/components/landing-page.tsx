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
        <div className="min-h-screen bg-background text-foreground antialiased">
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