import { prisma } from "@/lib/prisma";
import { notFound, permanentRedirect } from "next/navigation";
import { resolvePropertyByParam, getPropertyPath } from "@/lib/property-slug";
import { locationToSlug } from "@/lib/destinations";
import Link from "next/link";
import { absoluteUrl, buildPropertyDescription, DEFAULT_OG_IMAGE } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { propertyBreadcrumbJsonLd, vacationRentalJsonLd } from "@/lib/structured-data";
import Image from "next/image";
import {
    MapPin, Bed, Users, Home, Check,
    Wifi, Tv, Pocket as Pool, Wind, Coffee,
    Utensils, WashingMachine, Car, Dumbbell,
    Flame, Snowflake, Shield, Camera,
    Waves, Mountain, Trees, Sunset,
    Thermometer, Laptop, Baby, Dog,
    Music, Soup, Microwave, Refrigerator
} from "lucide-react";

const AMENITY_ICONS: Record<string, any> = {
    // Basics
    "Wifi": Wifi,
    "TV": Tv,
    "Kitchen": Utensils,
    "Washer": WashingMachine,
    "Free parking on premises": Car,
    "Paid parking on premises": Car,
    "Air conditioning": Wind,
    "Dedicated workspace": Laptop,
    "Pool": Pool,
    "Hot tub": Bath, // Added later or use Thermometer
    "Gym": Dumbbell,
    "EV charger": Car,
    "Crib": Baby,
    "Indoor fireplace": Flame,
    "Smoking allowed": Flame,

    // Bathroom
    "Bathtub": Refrigerator, // Fallback or search
    "Hair dryer": Wind,
    "Cleaning products": Check,
    "Shampoo": Soup,
    "Conditioner": Soup,
    "Body soap": Soup,
    "Hot water": Thermometer,
    "Shower gel": Soup,

    // Bedroom and laundry
    "Washer - In unit": WashingMachine,
    "Dryer - In unit": WashingMachine,
    "Essentials": Check,
    "Hangers": Check,
    "Bed linens": Bed,
    "Extra pillows and blankets": Bed,
    "Iron": Check,
    "Clothing storage": Home,

    // Entertainment
    "Ethernet connection": Wifi,
    "Sound system": Music,
    "Books and reading material": Check,

    // Family
    "Pack ’n play/Travel crib": Baby,
    "Children’s dinnerware": Baby,

    // Heating and cooling
    "Heating": Snowflake,
    "Portable fans": Wind,

    // Home safety
    "Smoke detector": Shield,
    "Carbon monoxide detector": Shield,
    "Fire extinguisher": Flame,
    "First aid kit": Shield,

    // Kitchen and dining
    "Refrigerator": Refrigerator,
    "Microwave": Microwave,
    "Cooking basics": Utensils,
    "Dishes and silverware": Utensils,
    "Freezer": Refrigerator,
    "Dishwasher": WashingMachine,
    "Stove": Microwave,
    "Oven": Microwave,
    "Coffee maker": Coffee,
    "Hot water kettle": Coffee,
    "Wine glasses": Utensils,
    "Toaster": Microwave,
    "Baking sheet": Utensils,
    "Dining table": Utensils,

    // Outdoor
    "Patio or balcony": Sunset,
    "Backyard": Trees,
    "Outdoor furniture": Sunset,
    "Outdoor dining area": Sunset,
    "BBQ grill": Flame,
    "Barbeque utensils": Utensils,
    "Beach essentials": Sunset,

    // Parking and facilities
    "Free street parking": Car,
    "Single level home": Home,

    // Services
    "Long term stays allowed": Check,
    "Self check-in": Check,
    "Keypad": Shield,
    "Cleaning before checkout": Check,

    // Views
    "City view": Home, // Or Sunset/Buildings
    "Mountain view": Mountain,
    "Mountain": Mountain,
    "Ocean view": Waves,
    "Beach access": Waves,
    "Lake access": Waves,
    "Garden view": Trees,
    "Courtyard view": Trees,
    "Water view": Waves,
    "Forest view": Trees,
    "Vineyard view": Trees,
    "Skyline view": Sunset,
};

// Fallback if needed
import { Bath } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BookingWidget } from "@/components/BookingWidget";
import { ImageGrid } from "@/components/ImageGrid";

import { PropertyCarousel } from "@/components/PropertyCarousel";
import { BackButton } from "@/components/ui/BackButton";
import { PropertyGallery } from "@/components/PropertyGallery";

AMENITY_ICONS["Hot tub"] = Bath;

interface PageProps {
    params: {
        id: string;
    };
}

// NextJS 15+ allows params to be awaited or direct? 
// In Next 13/14 params is an object. In 15 it might be a Promise.
// We will assume standard App Router params behavior (object).
// If using Next 15, we might need `params = await props.params`.

import { Metadata } from "next";

export async function generateMetadata(
    props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const params = await props.params;
    const resolved = await resolvePropertyByParam(params.slug);

    if (!resolved) {
        return {
            title: "Property Not Found",
        };
    }

    const { property, canonicalSlug } = resolved;
    const propertyPath = getPropertyPath(canonicalSlug, property.id);
    const pageUrl = absoluteUrl(propertyPath);

    let ogImage = DEFAULT_OG_IMAGE;
    try {
        const images = JSON.parse(property.images) as string[];
        if (images.length > 0) {
            ogImage = images[0];
        }
    } catch (e) { }

    const description =
        (property as { metaDescription?: string | null }).metaDescription?.trim() ||
        buildPropertyDescription(property.title, property.location, property.description);

    return {
        title: property.title,
        description,
        keywords: [
            property.title,
            "Canderra",
            property.location,
            property.type,
            "luxury rental",
            "vacation rental",
        ].filter(Boolean),
        alternates: {
            canonical: propertyPath,
        },
        openGraph: {
            title: property.title,
            description,
            url: pageUrl,
            siteName: "Canderra",
            locale: "en_US",
            type: "website",
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: `${property.title} — Canderra`,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: property.title,
            description,
            images: [ogImage],
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function PropertyPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const resolved = await resolvePropertyByParam(params.slug);

    if (!resolved) {
        notFound();
    }

    const { property, canonicalSlug } = resolved;

    if (params.slug !== canonicalSlug) {
        permanentRedirect(getPropertyPath(canonicalSlug, property.id));
    }

    // Fetch other properties
    const otherProperties = await prisma.property.findMany({
        where: {
            id: { not: property.id }
        },
        take: 12,
        orderBy: {
            createdAt: 'desc'
        }
    });

    const imageUrls = JSON.parse(property.images) as string[];
    const amenities = JSON.parse(property.amenities) as string[];

    const structuredDescription =
        (property as { metaDescription?: string | null }).metaDescription?.trim() ||
        buildPropertyDescription(property.title, property.location, property.description);

    const jsonLd = [
        vacationRentalJsonLd({
            title: property.title,
            description: structuredDescription,
            slug: canonicalSlug,
            id: property.id,
            location: property.location,
            type: property.type,
            price: property.price,
            images: imageUrls,
            bedrooms: (property as { bedrooms?: number }).bedrooms ?? 1,
            beds: (property as { beds?: number }).beds ?? 1,
            bathrooms: (property as { bathrooms?: number }).bathrooms ?? 1,
            maxGuests: (property as { maxGuests?: number }).maxGuests ?? 1,
            amenities,
        }),
        propertyBreadcrumbJsonLd(property.title, canonicalSlug, property.id),
    ];

    const destinationSlug = locationToSlug(property.location);

    return (
        <div className="max-w-7xl mx-auto space-y-10 px-4 md:px-6 pb-24">
            <JsonLd data={jsonLd} />
            <BackButton />
            <header className="pt-6 pb-2 border-b border-border/40">
                <p className="text-[10px] uppercase tracking-[0.3em] text-primary mb-3">Canderra Residence</p>
                <h1 className="text-3xl md:text-5xl font-light text-foreground leading-tight max-w-4xl" style={{ fontFamily: "Georgia, serif" }}>
                    {property.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 mt-4 text-muted-foreground">
                    <Link
                        href={`/destinations/${destinationSlug}`}
                        className="inline-flex items-center gap-1.5 text-sm hover:text-primary transition-colors"
                    >
                        <MapPin size={14} className="text-primary" />
                        {property.location}
                    </Link>
                    <span className="text-border hidden sm:inline">|</span>
                    <span className="text-sm">
                        {(property as { maxGuests?: number }).maxGuests} guests · {(property as { bedrooms?: number }).bedrooms} bedrooms · {(property as { bathrooms?: number }).bathrooms} baths
                    </span>
                </div>
            </header>
            <PropertyGallery images={imageUrls} title={property.title} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-4">

                {/* Main Content */}
                <div className="md:col-span-2 space-y-10">
                    <Separator />

                    {/* Description */}
                    <div className="space-y-4 text-foreground leading-relaxed whitespace-pre-wrap">
                        <p>{property.description}</p>
                    </div>

                    {(property as any).guestAccess && (
                        <>
                            <Separator />
                            <div>
                                <h3 className="text-xs uppercase tracking-[0.25em] font-medium mb-3" style={{ color: "#C9A84C" }}>Guest Access</h3>
                                <p className="text-muted-foreground leading-relaxed">{(property as any).guestAccess}</p>
                            </div>
                        </>
                    )}

                    <Separator />

                    {/* Amenities */}
                    <div>
                        <h2 className="text-xs uppercase tracking-[0.25em] font-medium mb-6" style={{ color: "#C9A84C" }}>What This Place Offers</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
                            {amenities.map(item => {
                                const Icon = AMENITY_ICONS[item] || Check;
                                return (
                                    <div key={item} className="flex items-center gap-4 text-foreground">
                                        <Icon className="w-4 h-4 shrink-0" style={{ color: "#C9A84C", opacity: 0.7 }} />
                                        <span className="text-sm font-light text-foreground">{item}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {(property as any).neighborhood && (
                        <>
                            <Separator />
                            <div>
                                <h3 className="text-xs uppercase tracking-[0.25em] font-medium mb-3" style={{ color: "#C9A84C" }}>The Neighborhood</h3>
                                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{(property as any).neighborhood}</p>
                            </div>
                        </>
                    )}

                    {(property as any).houseRules && (
                        <>
                            <Separator />
                            <div>
                                <h3 className="text-xs uppercase tracking-[0.25em] font-medium mb-6" style={{ color: "#C9A84C" }}>House Rules</h3>
                                <div className="space-y-0">
                                    {(property as any).checkIn && (
                                        <div className="flex items-start gap-6 py-4 border-b border-border/30">
                                            <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground w-40 shrink-0 pt-0.5">Check-in</span>
                                            <span className="text-sm text-foreground font-light">{(property as any).checkIn}</span>
                                        </div>
                                    )}
                                    {(property as any).checkOut && (
                                        <div className="flex items-start gap-6 py-4 border-b border-border/30">
                                            <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground w-40 shrink-0 pt-0.5">Check-out</span>
                                            <span className="text-sm text-foreground font-light">{(property as any).checkOut}</span>
                                        </div>
                                    )}
                                    {(property as any).houseRules.split("\n").filter((line: string) => line.trim()).map((line: string, i: number) => {
                                        const isHeading = line.trim().length < 40 && !line.trim().includes(".");
                                        return isHeading ? (
                                            <div key={i} className="flex items-start gap-6 py-4 border-b border-border/30">
                                                <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground w-40 shrink-0 pt-0.5">{line.trim()}</span>
                                                <span className="text-sm text-foreground font-light"></span>
                                            </div>
                                        ) : (
                                            <div key={i} className="flex items-start gap-6 py-1 last:border-0">
                                                <span className="w-32 shrink-0"></span>
                                                <span className="text-sm text-muted-foreground font-light leading-relaxed">{line.trim()}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    )}

                    {(property as any).interaction && (
                        <>
                            <Separator />
                            <div>
                                <h3 className="text-xs uppercase tracking-[0.25em] font-medium mb-3" style={{ color: "#C9A84C" }}>Guest Interaction</h3>
                                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{(property as any).interaction}</p>
                            </div>
                        </>
                    )}

                    {(property as any).gettingAround && (
                        <>
                            <Separator />
                            <div>
                                <h3 className="text-xs uppercase tracking-[0.25em] font-medium mb-3" style={{ color: "#C9A84C" }}>Getting Around</h3>
                                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{(property as any).gettingAround}</p>
                            </div>
                        </>
                    )}

                    {(property as any).notes && (
                        <>
                            <Separator />
                            <div>
                                <h3 className="text-xs uppercase tracking-[0.25em] font-medium mb-3" style={{ color: "#C9A84C" }}>Other Things to Note</h3>
                                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{(property as any).notes}</p>
                            </div>
                        </>
                    )}
                </div>

                {/* Booking Widget Sidebar */}
                <BookingWidget
                    propertyId={property.id}
                    propertySlug={canonicalSlug}
                    propertyTitle={property.title}
                    price={property.price}
                    cleaningFee={(property as any).cleaningFee || 0}
                    serviceFee={(property as any).serviceFee || 0}
                    maxGuests={(property as any).maxGuests || 1}
                    pricingRules={(property as any).pricingRules || []}
                />

            </div>

            {/* Other Properties Section */}
            {otherProperties.length > 0 && (
                <div className="pt-16 pb-24">
                    <Separator className="mb-12" />
                    <h2 className="text-xs uppercase tracking-[0.25em] font-medium mb-8" style={{ color: "#C9A84C" }}>More Places to Stay</h2>
                    <PropertyCarousel properties={otherProperties} />
                </div>
            )}
        </div>
    );
}
