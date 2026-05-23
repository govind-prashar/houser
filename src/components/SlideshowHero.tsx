'use client'

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronLeft } from "lucide-react";
import Image from "next/image";

const slides = [
    {
        image: "https://images.unsplash.com/photo-1600596542815-2a429feb166c?q=80&w=2574&auto=format&fit=crop",
        title: "The Art of Serene Living",
        subtitle: "Immerse yourself in spaces designed for absolute tranquility."
    },
    {
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200",
        title: "Sacred Sanctuaries",
        subtitle: "Find your center in our deeply private wellness retreats."
    },
    {
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2574&auto=format&fit=crop",
        title: "Inner Harmony",
        subtitle: "Experience the perfect balance of modern luxury and ancient calm."
    },
    {
        image: "https://images.unsplash.com/photo-1591343395082-e120087024b4?q=80&w=2574&auto=format&fit=crop",
        title: "Nature's Embrace",
        subtitle: "Reconnect with yourself in the heart of the wild."
    }
]

export function SlideshowHero() {
    const [current, setCurrent] = useState(0);

    const nextSlide = () => {
        setCurrent((prev) => (prev + 1) % slides.length);
    }

    const prevSlide = () => {
        setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    }

    // Auto-advance
    useEffect(() => {
        const timer = setInterval(nextSlide, 3500);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative w-full h-[600px] rounded-3xl overflow-hidden mb-12 group bg-background">
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={cn(
                        "absolute inset-0 transition-opacity duration-1000 ease-in-out",
                        index === current ? "opacity-100" : "opacity-0"
                    )}
                >
                    <div className="absolute inset-0 h-full w-full">
                        <Image
                            src={slide.image}
                            alt={slide.title}
                            fill
                            quality={100}
                            className={cn(
                                "object-cover transition-transform duration-[10000ms] ease-linear",
                                index === current ? "scale-100" : "scale-110"
                            )}
                            priority={index === 0}
                        />
                    </div>
                    <div className="absolute inset-0 bg-background/60 z-10" />
                </div>
            ))}
            <div className="absolute inset-0 bg-gradient-to-tr from-background via-transparent to-primary/10 z-15" />

            {/* Navigation Arrows */}
            <button onClick={prevSlide} className="absolute z-20 left-4 top-1/2 -translate-y-1/2 bg-primary/20 p-2 rounded-full backdrop-blur-md text-primary hover:bg-primary/40 transition cursor-pointer">
                <ChevronLeft size={32} />
            </button>
            <button onClick={nextSlide} className="absolute z-20 right-4 top-1/2 -translate-y-1/2 bg-primary/20 p-2 rounded-full backdrop-blur-md text-primary hover:bg-primary/40 transition cursor-pointer">
                <ChevronRight size={32} />
            </button>

            <div className="relative z-20 h-full flex flex-col justify-center items-center text-center text-white px-4 max-w-4xl mx-auto">
                <div className="animate-in fade-in slide-in-from-bottom-5 duration-1000 key={current}">
                    <h1 className="text-5xl md:text-8xl font-hero font-bold mb-6 drop-shadow-lg tracking-wide">
                        {slides[current].title}
                    </h1>
                    <p className="text-xl md:text-2xl mb-10 leading-relaxed drop-shadow-md font-light">
                        {slides[current].subtitle}
                    </p>
                </div>

                <div className="flex gap-4">
                    <Link href="/search">
                        <Button size="lg" className="bg-primary hover:opacity-90 text-primary-foreground font-bold px-10 py-7 text-lg rounded-full shadow-xl transition hover:scale-105 border-0">
                            Explore Collection
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="absolute z-20 bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {slides.map((_, idx) => (
                    <div
                        key={idx}
                        className={cn(
                            "w-2 h-2 rounded-full transition-all duration-300 shadow",
                            idx === current ? "bg-white w-6" : "bg-white/50"
                        )}
                    />
                ))}
            </div>
        </div>
    );
}
