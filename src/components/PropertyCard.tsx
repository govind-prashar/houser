'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/OptimizedImage';
import { DeletePropertyButton } from '@/components/DeletePropertyButton';
import { MapPin } from 'lucide-react';

interface PropertyCardProps {
    id: string;
    slug?: string | null;
    title: string;
    description?: string;
    location: string;
    price: number;
    image: string;
    beds?: number;
    baths?: number;
    sqft?: number;
    amenities?: string[];
    featured?: boolean;
    isAdmin?: boolean;
    monthlyPrice?: number;
    priceDisplay?: string;
}

export function PropertyCard({
    id,
    slug,
    title,
    location,
    price,
    image,
    beds = 2,
    baths = 2,
    featured = false,
    isAdmin = false,
    monthlyPrice,
    priceDisplay = "nightly"
}: PropertyCardProps) {

    const hasValidImage = image && image !== "/placeholder.jpg" && image.length > 0;
    const displayPrice = priceDisplay === "monthly" && monthlyPrice
        ? monthlyPrice.toLocaleString()
        : price.toLocaleString();
    const priceSuffix = priceDisplay === "monthly" ? "/ mo" : "/ night";

    return (
        <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="group relative w-full"
        >
            <Link href={`/properties/${slug || id}`} className="block">
                <article className="relative w-full overflow-hidden bg-transparent transition-all duration-700">

                    <div className="relative w-full aspect-[3/2] overflow-hidden">
                        {hasValidImage ? (
                            <OptimizedImage
                                src={image}
                                alt={`${title} — ${location}`}
                                fill
                                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                                <span className="text-muted-foreground uppercase tracking-widest text-xs">Coming Soon</span>
                            </div>
                        )}

                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-700" />

                        {featured && (
                            <span
                                className="absolute top-4 left-4 text-[10px] font-medium px-3 py-1 uppercase tracking-[0.2em]"
                                style={{ backgroundColor: "#C9A84C", color: "#fff" }}
                            >
                                Featured
                            </span>
                        )}


                    </div>

                    <div className="pt-4 pb-6">
                        <div
                            className="w-6 h-px mb-3 transition-all duration-500 group-hover:w-10"
                            style={{ backgroundColor: "#C9A84C" }}
                        />
                        <h3 className="text-sm font-medium text-foreground mb-1.5 line-clamp-1 tracking-wide">
                            {title}
                        </h3>
                        <div className="flex items-center gap-1 text-muted-foreground mb-3">
                            <MapPin size={11} className="shrink-0" style={{ color: "#C9A84C" }} />
                            <span className="text-xs tracking-wide">{location}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-[11px] text-muted-foreground uppercase tracking-[0.15em]">
                                <span>{beds} Beds</span>
                                <span style={{ color: "#C9A84C" }}>·</span>
                                <span>{baths} Baths</span>
                            </div>
                            {priceDisplay !== "none" && (
                                <span className="text-sm font-light text-foreground tracking-wide">
                                    ${displayPrice}
                                    <span className="text-muted-foreground text-xs ml-1">{priceSuffix}</span>
                                </span>
                            )}
                        </div>
                    </div>
                </article>
            </Link>

            {isAdmin && (
                <div className="absolute top-4 right-4 z-20">
                    <DeletePropertyButton propertyId={id} propertyTitle={title} />
                </div>
            )}
        </motion.div>
    );
}
