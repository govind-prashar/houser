import { prisma } from "@/lib/prisma";
import { PropertyCard } from "@/components/PropertyCard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BackButton } from "@/components/ui/BackButton";
import { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { propertiesListJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
    title: "All Stays & Residences",
    description: "Explore Canderra's complete collection of luxury properties worldwide — villas, estates, and private sanctuaries ready to book.",
    alternates: { canonical: "/properties" },
    openGraph: {
        title: "All Stays & Residences | Canderra",
        description: "Explore Canderra's complete collection of luxury properties worldwide.",
        url: "/properties",
    },
};

export default async function PropertiesPage() {
    const session = await getServerSession(authOptions);
    const isAdmin = (session?.user as any)?.role === 'ADMIN';

    const properties = await prisma.property.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });

    const listSchema = propertiesListJsonLd(
        properties.map((p) => ({
            title: p.title,
            slug: (p as { slug?: string | null }).slug ?? null,
            id: p.id,
        }))
    );

    return (
        <div className="pt-8">
            <JsonLd data={listSchema} />
            <div className="container mx-auto px-6 md:px-12 pb-12">
                <div className="mb-8">
                    <BackButton />
                </div>

                <div className="mb-16">
                    <h1 className="text-5xl md:text-6xl font-light text-foreground mb-4 leading-tight" style={{ fontFamily: "Georgia, serif" }}>
                        All Properties
                    </h1>
                    <p className="text-sm text-muted-foreground max-w-2xl tracking-wide font-light">
                        Browse our complete collection of luxury residences and private sanctuaries.
                    </p>
                </div>

                {properties.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {properties.map((property) => {
                            let cover = "/placeholder.jpg";
                            try {
                                const parsed = JSON.parse(property.images);
                                if (Array.isArray(parsed) && parsed.length > 0) cover = parsed[0];
                            } catch (e) { }

                            return (
                                <PropertyCard
                                    key={property.id}
                                    id={property.id}
                                    slug={(property as { slug?: string | null }).slug}
                                    title={property.title}
                                    location={property.location}
                                    price={property.price}
                                    image={cover}
                                    beds={(property as any).bedrooms || 3}
                                    baths={(property as any).bathrooms || 2}
                                    sqft={(property as any).squareFeet || 2000}
                                    isAdmin={isAdmin}
                                    monthlyPrice={(property as any).monthlyPrice}
                                    priceDisplay={(property as any).priceDisplay || 'nightly'}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-muted rounded-lg border border-border">
                        <h2 className="text-2xl font-bold text-foreground mb-2">No properties yet</h2>
                        <p className="text-muted-foreground">Check back later for new extraordinary stays.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
