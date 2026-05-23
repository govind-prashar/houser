"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import { ImageLightbox } from "./ImageLightbox";

export function ImageGrid({ properties }: { properties: any[] }) {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    // Flatten all images from all properties to create a pool of high-quality visuals
    // Or just take the cover image from the first 5 properties for the "Trending" look
    // Let's do cover images from the top 5 properties to link to them eventually

    // Safety check for properties
    const safeProperties = Array.isArray(properties) ? properties : [];

    const gridItems = safeProperties.slice(0, 5).map(p => {
        let cover = "/placeholder.jpg";
        try {
            const parsed = JSON.parse(p.images);
            if (Array.isArray(parsed) && parsed.length > 0) cover = parsed[0];
        } catch (e) { }
        return {
            id: p.id,
            title: p.title,
            image: cover,
            price: p.price
        };
    });

    if (gridItems.length === 0) {
        return (
            <section className="py-20 md:py-32 bg-transparent">
                <div className="container mx-auto px-4 max-w-[1400px]">
                    <div className="w-full h-[300px] md:h-[500px] bg-gradient-to-br from-card/30 to-background/20 backdrop-blur-md rounded-xl flex flex-col items-center justify-center gap-4 border border-primary/20 shadow-2xl">
                        <div className="text-center space-y-1">
                            <p className="text-primary font-bold tracking-widest uppercase text-xs">No Properties Yet</p>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    const openLightbox = (index: number) => {
        setLightboxIndex(index);
    };

    // Helper to get grid span classes based on index
    const getSpanClass = (index: number) => {
        if (index === 0) return "col-span-2 md:col-span-2 row-span-2 h-[400px] md:h-[600px]";
        return "col-span-1 md:col-span-1 row-span-1 h-[200px] md:h-[300px]";
    }

    return (
        <section className="py-20 md:py-32 bg-transparent">
            <div className="container mx-auto px-4 max-w-[1400px]">
                <div className="text-center mb-12 md:mb-16">
                    <span className="text-primary font-bold tracking-[0.2em] text-xs uppercase block mb-4">Discover</span>
                    <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight">Trending Collections</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {gridItems.map((item, i) => (
                        <div
                            key={item.id}
                            className={cn(
                                "relative group overflow-hidden rounded-2xl border border-white/10 cursor-pointer",
                                getSpanClass(i)
                            )}
                            onClick={() => openLightbox(i)}
                        >
                            <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                quality={100}
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                            <div className="absolute bottom-0 left-0 p-6 md:p-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                <h3 className="text-xl md:text-2xl font-bold text-white mb-1 line-clamp-1">{item.title}</h3>
                                <p className="text-primary font-medium text-sm">Starting from ${item.price} / night</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <ImageLightbox
                images={gridItems.map(i => i.image)}
                initialIndex={lightboxIndex || 0}
                isOpen={lightboxIndex !== null}
                onClose={() => setLightboxIndex(null)}
            />
        </section>
    );
}
