'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageLightbox } from '@/components/ImageLightbox';

interface PropertyGalleryProps {
    images: string[];
    title: string;
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const openLightbox = (index: number) => {
        setLightboxIndex(index);
    };

    // If no valid images, show Coming Soon
    const validImages = images.filter(img => img && img.length > 0);

    if (validImages.length === 0) {
        return (
            <div className="relative rounded-xl overflow-hidden shadow-sm">
                <div className="h-[400px] md:h-[500px] bg-gradient-to-br from-stone/10 via-stone/5 to-stone/15 flex flex-col items-center justify-center gap-5">
                    <div className="w-24 h-24 rounded-full bg-stone/10 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-stone/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V5.25a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v14.25c0 .828.672 1.5 1.5 1.5z" />
                        </svg>
                    </div>
                    <span className="text-stone/60 font-serif text-2xl italic tracking-wide">Coming Soon</span>
                    <span className="text-stone/35 text-xs uppercase tracking-[0.25em]">Property photos arriving shortly</span>
                </div>
            </div>
        );
    }

    const mainImage = validImages[0];
    const subImages = validImages.slice(1, 5);

    return (
        <>
            {/* Image Gallery - Quiet Luxury Grid */}
            <div className="relative rounded-xl overflow-hidden shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-2 h-[400px] md:h-[500px]">
                    {/* Main Hero Image */}
                    <div
                        className="col-span-2 row-span-2 relative group cursor-pointer"
                        onClick={() => openLightbox(0)}
                    >
                        <Image
                            src={mainImage}
                            alt={title}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-700"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                        />
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                    </div>

                    {/* Sub Images */}
                    {subImages.map((img, i) => (
                        <div
                            key={i}
                            className="relative group cursor-pointer hidden md:block" // Keep hidden on mobile as per original design? Or show all? Original had hidden md:block
                            onClick={() => openLightbox(i + 1)}
                        >
                            <Image
                                src={img}
                                alt={`${title} - ${i + 2}`}
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-700"
                                sizes="25vw"
                            />
                            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />

                            {/* Show "View all" on the last image if there are more? For now just simple grid */}
                            {i === 3 && validImages.length > 5 && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white backdrop-blur-[2px]">
                                    <span className="text-xl font-medium">+{validImages.length - 5} photos</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <ImageLightbox
                images={validImages}
                initialIndex={lightboxIndex || 0}
                isOpen={lightboxIndex !== null}
                onClose={() => setLightboxIndex(null)}
            />
        </>
    );
}
