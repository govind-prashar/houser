'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import { OptimizedImage } from "@/components/OptimizedImage";

export function Hero() {
    return (
        <section className="relative w-full h-screen overflow-hidden">
            <style>{`
                @keyframes kenburns {
                    0%   { transform: scale(1)    translateX(0)      translateY(0); }
                    50%  { transform: scale(1.08) translateX(-1%)    translateY(-1%); }
                    100% { transform: scale(1)    translateX(0)      translateY(0); }
                }
                .kb-image {
                    animation: kenburns 18s ease-in-out infinite;
                    will-change: transform;
                }
                @keyframes fadeup {
                    from { opacity: 0; transform: translateY(28px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .hero-tagline {
                    animation: fadeup 1.4s cubic-bezier(0.16,1,0.3,1) 0.3s both;
                }
                .hero-btn {
                    animation: fadeup 1.2s cubic-bezier(0.16,1,0.3,1) 0.9s both;
                }
                .gold-line {
                    animation: fadeup 1s ease 1.4s both;
                }
            `}</style>

            {/* Background */}
            <div className="absolute inset-0">
                <div className="kb-image absolute inset-0">
                    <OptimizedImage
                        src="https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=2500&auto=format&fit=crop"
                        alt="Luxury infinity pool — Canderra"
                        fill
                        priority
                        className="object-cover object-center"
                        sizes="100vw"
                    />
                </div>
                <div className="absolute inset-0 bg-black/25" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/15" />
            </div>

            {/* Hero text — centered, ultra minimal */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6">
                <h1
                    className="hero-tagline text-white leading-[1.08] mb-12"
                    style={{
                        fontFamily: 'Georgia, serif',
                        fontSize: 'clamp(3rem, 6vw, 5.8rem)',
                        fontWeight: 300,
                        letterSpacing: '-0.01em',
                    }}
                >
                    Where every stay
                    <br />
                    tells a{' '}
                    <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>story.</em>
                </h1>

                <div className="hero-btn">
                    <Link
                        href="/properties"
                        className="inline-block text-xs uppercase tracking-[0.28em] font-medium transition-all duration-500"
                        style={{
                            padding: '14px 40px',
                            border: '1px solid rgba(201,168,76,0.65)',
                            color: '#C9A84C',
                            letterSpacing: '0.28em',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.backgroundColor = '#C9A84C';
                            e.currentTarget.style.color = '#fff';
                            e.currentTarget.style.borderColor = '#C9A84C';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#C9A84C';
                            e.currentTarget.style.borderColor = 'rgba(201,168,76,0.65)';
                        }}
                    >
                        Explore Properties
                    </Link>
                </div>
            </div>

            {/* Thin gold line at very bottom — signature touch */}
            <div
                className="gold-line absolute bottom-0 left-0 right-0 z-20"
                style={{ height: '2px', backgroundColor: '#C9A84C', opacity: 0.5 }}
            />

            {/* Fade into page */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent z-10" />
        </section>
    );
}
