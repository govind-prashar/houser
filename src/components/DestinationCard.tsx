"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { OptimizedImage } from "@/components/OptimizedImage";
import type { Destination } from "@/lib/destinations";

const FALLBACK =
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200&h=630&auto=format&fit=crop";

export function DestinationCard({ destination, index = 0 }: { destination: Destination; index?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
        >
            <Link href={`/destinations/${destination.slug}`} className="group block">
                <article className="relative aspect-video overflow-hidden rounded-md bg-gray-300 border border-border shadow-sm hover:shadow-md transition-all duration-300">
                    <OptimizedImage
                        src={destination.coverImage || FALLBACK}
                        alt={`Luxury stays in ${destination.name}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h3 className="font-bold text-2xl md:text-3xl text-white mb-2">
                                    {destination.name}
                                </h3>
                                <p className="text-white/90 text-sm">
                                    {destination.propertyCount} {destination.propertyCount === 1 ? "property" : "properties"}
                                </p>
                            </div>
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-foreground group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                <ArrowRight size={18} />
                            </span>
                        </div>
                    </div>
                </article>
            </Link>
        </motion.div>
    );
}
