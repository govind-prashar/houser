'use client';

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PropertyCard } from "./PropertyCard";
import { useSession } from "next-auth/react";

interface PropertyCarouselProps {
    properties: any[];
}

export function PropertyCarousel({ properties }: PropertyCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);
    const { data: session } = useSession();
    const isAdmin = (session?.user as any)?.role === 'ADMIN';

    const checkScroll = () => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return;
        const scrollAmount = direction === 'left' ? -scrollRef.current.clientWidth : scrollRef.current.clientWidth;
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    };

    return (
        <div className="relative">
            {/* Minimal arrow buttons */}
            {showLeftArrow && (
                <button
                    onClick={() => scroll('left')}
                    className="absolute -left-6 top-1/3 -translate-y-1/2 z-30 flex items-center justify-center w-10 h-10 border border-white/15 text-white/60 hover:text-white hover:border-white/40 transition-all duration-300"
                    aria-label="Previous"
                    style={{ backgroundColor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)' }}
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
            )}

            {showRightArrow && (
                <button
                    onClick={() => scroll('right')}
                    className="absolute -right-6 top-1/3 -translate-y-1/2 z-30 flex items-center justify-center w-10 h-10 border border-white/15 text-white/60 hover:text-white hover:border-white/40 transition-all duration-300"
                    aria-label="Next"
                    style={{ backgroundColor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)' }}
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            )}

            {/* Scroll container */}
            <div
                ref={scrollRef}
                onScroll={checkScroll}
                className="flex overflow-x-auto gap-8 scroll-smooth pb-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {properties.map((property) => {
                    let cover = "/placeholder.jpg";
                    try {
                        const parsed = JSON.parse(property.images);
                        if (Array.isArray(parsed) && parsed.length > 0) cover = parsed[0];
                    } catch (e) {}

                    return (
                        <div
                            key={property.id}
                            className="flex-none w-full sm:w-[calc(50%-16px)] lg:w-[calc(33.333%-22px)]"
                        >
                            <PropertyCard
                                id={property.id}
                                slug={property.slug}
                                title={property.title}
                                location={property.location}
                                price={property.price}
                                image={cover}
                                beds={(property as any).bedrooms || 3}
                                baths={(property as any).bathrooms || 2}
                                sqft={(property as any).squareFeet || 2000}
                                featured={false}
                                isAdmin={isAdmin}
                                monthlyPrice={(property as any).monthlyPrice}
                                priceDisplay={(property as any).priceDisplay || 'nightly'}
                            />
                        </div>
                    );
                })}
            </div>

            <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
        </div>
    );
}
