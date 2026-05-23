'use client';

import { useRef, useState, useEffect, ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ScrollableRowProps {
    children: ReactNode;
    className?: string;
}

export function ScrollableRow({ children, className = '' }: ScrollableRowProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const checkScroll = () => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 4);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    };

    useEffect(() => {
        checkScroll();
        const el = scrollRef.current;
        if (!el) return;
        el.addEventListener('scroll', checkScroll, { passive: true });
        const ro = new ResizeObserver(checkScroll);
        ro.observe(el);
        return () => {
            el.removeEventListener('scroll', checkScroll);
            ro.disconnect();
        };
    }, []);

    const scroll = (dir: 'left' | 'right') => {
        const el = scrollRef.current;
        if (!el) return;
        const cardWidth = el.querySelector(':scope > *')?.getBoundingClientRect().width ?? 380;
        const amount = dir === 'left' ? -(cardWidth + 24) : cardWidth + 24;
        el.scrollBy({ left: amount, behavior: 'smooth' });
    };

    return (
        <div className="relative">
            {/* Left arrow — always visible when scrollable */}
            {canScrollLeft && (
                <button
                    onClick={() => scroll('left')}
                    aria-label="Scroll left"
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-background/90 backdrop-blur-md border border-border shadow-lg text-foreground hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 cursor-pointer"
                >
                    <ChevronLeft size={22} />
                </button>
            )}

            {/* Right arrow — always visible when scrollable */}
            {canScrollRight && (
                <button
                    onClick={() => scroll('right')}
                    aria-label="Scroll right"
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-background/90 backdrop-blur-md border border-border shadow-lg text-foreground hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 cursor-pointer"
                >
                    <ChevronRight size={22} />
                </button>
            )}

            {/* Fade edges */}
            {canScrollLeft && (
                <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            )}
            {canScrollRight && (
                <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
            )}

            {/* Scrollable container */}
            <div
                ref={scrollRef}
                className={`flex gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4 ${className}`}
            >
                {children}
            </div>
        </div>
    );
}
