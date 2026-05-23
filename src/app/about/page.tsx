import Image from "next/image";
import Link from "next/link";
import HoverButton from "@/components/HoverButton";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us",
    description: "Learn about Canderra's curated selection of luxury residences and our commitment to absolute privacy and personal service.",
    alternates: { canonical: "/about" },
    openGraph: {
        title: "About Canderra",
        description: "The story behind Canderra's curated luxury residences and private sanctuaries.",
        url: "/about",
    },
};

export default function AboutPage() {
    return (
        <div className="w-full min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative w-full h-[60vh] md:h-[70vh] pt-16">
                <div className="absolute inset-0">
                    <Image
                        src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2670&auto=format&fit=crop"
                        alt="Canderra Luxury Property"
                        fill
                        className="object-cover object-center"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/25" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/15" />
                </div>
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
                    <span className="text-xs uppercase tracking-[0.35em] mb-5 font-light" style={{ color: '#C9A84C' }}>
                        Our Story
                    </span>
                    <h1 className="text-5xl md:text-7xl text-white font-light leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
                        Canderra
                    </h1>
                </div>
                {/* Gold line */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] z-10" style={{ backgroundColor: '#C9A84C', opacity: 0.5 }} />
            </section>

            {/* Main Content */}
            <section className="container mx-auto px-6 md:px-12 py-16 max-w-4xl">

                {/* Tagline */}
                <div className="mb-16 text-center">
                    <h2 className="text-3xl md:text-5xl mb-10 leading-tight font-light text-foreground" style={{ fontFamily: 'Georgia, serif' }}>
                        Redefining the <br />
                        <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>art of hospitality.</em>
                    </h2>
                    <div className="space-y-6 text-muted-foreground leading-relaxed font-light text-base md:text-lg max-w-2xl mx-auto">
                        <p>
                            Canderra was born from a singular vision: to create a collection of the world's most extraordinary residences, where privacy is paramount and luxury is whispered, not shouted.
                        </p>
                        <p>
                            We believe that true luxury is the luxury of space, silence, and seamless service. Each property in our portfolio is meticulously selected not just for its architectural pedigree or coveted location, but for the profound sense of calm it instills in those who cross its threshold.
                        </p>
                    </div>
                </div>

                {/* Thin gold divider */}
                <div className="w-12 h-px mx-auto mb-28" style={{ backgroundColor: '#C9A84C' }} />

                {/* Values */}
                <div className="mb-28 grid grid-cols-1 md:grid-cols-3 gap-12">
                    {[
                        { num: '01', title: 'Curated Selection', text: 'We reject the mass market. Our portfolio is deliberately small, ensuring every residence meets our exacting standards of design and comfort.' },
                        { num: '02', title: 'Absolute Privacy', text: 'Our properties are sanctuaries. We prioritize secluded locations and discreet service, allowing you to disconnect completely.' },
                        { num: '03', title: 'Personal Service', text: 'A dedicated concierge team anticipates your needs before you arrive, tailoring every aspect of your stay to your personal preferences.' },
                    ].map(({ num, title, text }) => (
                        <div key={num}>
                            <div className="w-6 h-px mb-4" style={{ backgroundColor: '#C9A84C' }} />
                            <h3 className="text-xs uppercase tracking-[0.25em] font-medium mb-3" style={{ color: '#C9A84C' }}>
                                {num}. {title}
                            </h3>
                            <p className="text-muted-foreground font-light leading-relaxed text-sm">
                                {text}
                            </p>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="flex justify-center border-t pt-20" style={{ borderColor: 'rgba(201,168,76,0.2)' }}>
                    <div className="text-center">
                        <h2 className="text-2xl md:text-3xl mb-8 font-light text-foreground" style={{ fontFamily: 'Georgia, serif' }}>
                            Experience Canderra
                        </h2>
                        <HoverButton href="/properties">Explore Residences</HoverButton>
                    </div>
                </div>
            </section>
        </div>
    );
}
