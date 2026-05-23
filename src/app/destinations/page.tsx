import { Metadata } from "next";
import Link from "next/link";
import { getDestinations } from "@/lib/destinations";
import { DestinationCard } from "@/components/DestinationCard";
import { JsonLd } from "@/components/JsonLd";
import { absoluteUrl } from "@/lib/seo";
import { ArrowRight } from "lucide-react";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: "Destinations",
    description:
        "Explore Canderra luxury residences by destination — from Malibu coastlines to city sanctuaries. Find your perfect stay.",
    alternates: { canonical: "/destinations" },
    openGraph: {
        title: "Luxury Destinations | Canderra",
        description: "Browse curated luxury stays by city and region.",
        url: "/destinations",
    },
};

export default async function DestinationsPage() {
    const destinations = await getDestinations();

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Canderra Destinations",
        itemListElement: destinations.map((d, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: d.name,
            url: absoluteUrl(`/destinations/${d.slug}`),
        })),
    };

    return (
        <div className="min-h-screen pt-20">
            <JsonLd data={jsonLd} />
            <section className="container mx-auto px-6 md:px-12 py-16 md:py-20">
                <div className="mb-16 text-center max-w-3xl mx-auto">
                    <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
                        Explore Destinations
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Handpicked residences in the world&apos;s most sought-after addresses.
                    </p>
                </div>

                {destinations.length === 0 ? (
                    <div className="text-center py-24 rounded-lg border border-border bg-muted">
                        <p className="text-muted-foreground mb-6">Destinations will appear as properties are added.</p>
                        <Link href="/properties" className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary/80 transition">
                            View all properties
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {destinations.map((destination, index) => (
                            <DestinationCard key={destination.slug} destination={destination} index={index} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
