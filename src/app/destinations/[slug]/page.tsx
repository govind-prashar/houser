import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
    getDestinationBySlug,
    getPropertiesByDestination,
} from "@/lib/destinations";
import { PropertyCard } from "@/components/PropertyCard";
import { JsonLd } from "@/components/JsonLd";
import { absoluteUrl } from "@/lib/seo";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BackButton } from "@/components/ui/BackButton";
import { OptimizedImage } from "@/components/OptimizedImage";
import { ScrollableRow } from "@/components/ScrollableRow";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const destination = await getDestinationBySlug(slug);
    if (!destination) return { title: "Destination Not Found" };

    const title = `Luxury Stays in ${destination.name}`;
    const description = `Discover ${destination.propertyCount} curated Canderra residences in ${destination.name}. Book luxury villas, estates, and private sanctuaries.`;

    return {
        title,
        description,
        alternates: { canonical: `/destinations/${slug}` },
        openGraph: {
            title: `${title} | Canderra`,
            description,
            url: absoluteUrl(`/destinations/${slug}`),
            images: destination.coverImage ? [{ url: destination.coverImage }] : undefined,
        },
        keywords: [destination.name, "Canderra", "luxury rental", destination.name.split(",")[0]],
    };
}

export default async function DestinationDetailPage({ params }: Props) {
    const { slug } = await params;
    const destination = await getDestinationBySlug(slug);
    if (!destination) notFound();

    const properties = await getPropertiesByDestination(destination.name);
    const session = await getServerSession(authOptions);
    const isAdmin = (session?.user as { role?: string })?.role === "ADMIN";

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "TouristDestination",
        name: destination.name,
        description: `Luxury vacation rentals in ${destination.name} by Canderra`,
        url: absoluteUrl(`/destinations/${slug}`),
        touristType: "Luxury travelers",
    };

    const cover =
        destination.coverImage ||
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1600&auto=format&fit=crop";

    return (
        <div className="min-h-screen">
            <JsonLd data={jsonLd} />
            <section className="relative h-[50vh] min-h-[360px] overflow-hidden">
                <OptimizedImage src={cover} alt={destination.name} fill priority className="object-cover" sizes="100vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/30" />
                <div className="absolute inset-0 container mx-auto px-4 md:px-12 flex flex-col justify-end pb-12">
                    <BackButton />
                    <span className="text-[10px] uppercase tracking-[0.3em] text-primary mt-8 mb-3">Destinations</span>
                    <h1 className="font-hero text-4xl md:text-6xl text-foreground max-w-4xl">
                        {destination.name}
                    </h1>
                    <p className="text-muted-foreground mt-4 max-w-xl font-light text-lg">
                        {destination.propertyCount} exclusive {destination.propertyCount === 1 ? "residence" : "residences"} · Canderra curated
                    </p>
                </div>
            </section>

            <section className="container mx-auto px-4 md:px-12 py-16">
                <ScrollableRow>
                    {properties.map((property) => {
                        let coverImg = "/placeholder.jpg";
                        try {
                            const parsed = JSON.parse(property.images) as string[];
                            if (parsed[0]) coverImg = parsed[0];
                        } catch {
                            /* ignore */
                        }
                        return (
                            <div key={property.id} className="min-w-[340px] md:min-w-[420px] flex-shrink-0">
                                <PropertyCard
                                    id={property.id}
                                    slug={property.slug}
                                    title={property.title}
                                    location={property.location}
                                    price={property.price}
                                    image={coverImg}
                                    beds={property.bedrooms}
                                    baths={property.bathrooms}
                                    sqft={property.squareFeet ?? undefined}
                                    isAdmin={isAdmin}
                                    monthlyPrice={property.monthlyPrice ?? undefined}
                                    priceDisplay={property.priceDisplay}
                                />
                            </div>
                        );
                    })}
                </ScrollableRow>
                {properties.length === 0 && (
                    <p className="text-center text-muted-foreground py-16">
                        No listings in this destination yet.{" "}
                        <Link href="/properties" className="text-primary hover:underline">
                            Browse all stays
                        </Link>
                    </p>
                )}
            </section>
        </div>
    );
}
