import { prisma } from "@/lib/prisma";
import { PropertyCard } from "@/components/PropertyCard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BackButton } from "@/components/ui/BackButton";
import { Metadata } from "next";

interface SearchPageProps {
    searchParams: Promise<{
        location?: string;
        guests?: string;
        startDate?: string;
        endDate?: string;
    }>;
}

export async function generateMetadata(props: SearchPageProps): Promise<Metadata> {
    const searchParams = await props.searchParams;
    const location = searchParams.location?.trim();

    if (location) {
        const title = `Luxury Stays in ${location}`;
        return {
            title,
            description: `Discover luxury residences and private sanctuaries in ${location}. Book curated stays with Canderra.`,
            alternates: {
                canonical: `/search?location=${encodeURIComponent(location)}`,
            },
            openGraph: {
                title: `${title} | Canderra`,
                description: `Luxury properties in ${location} — book with Canderra.`,
                url: `/search?location=${encodeURIComponent(location)}`,
            },
        };
    }

    return {
        title: "Search Luxury Stays",
        description: "Search Canderra's collection of luxury residences, villas, and private sanctuaries worldwide.",
        alternates: { canonical: "/search" },
    };
}

export default async function SearchPage(props: SearchPageProps) {
    const searchParams = await props.searchParams;
    const session = await getServerSession(authOptions);
    const isAdmin = (session?.user as any)?.role === 'ADMIN';

    const location = searchParams.location;
    const guests = searchParams.guests ? parseInt(searchParams.guests) : 1;

    const where: any = {};

    if (location) {
        where.OR = [
            { location: { contains: location } },
            { title: { contains: location } }
        ];
    }

    if (guests) {
        where.maxGuests = {
            gte: guests
        };
    }

    // 1. Fetch potential properties based on location and guests
    let properties = await prisma.property.findMany({
        where,
        include: {
            bookings: {
                select: {
                    startDate: true,
                    endDate: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    // 2. Perform client-side/application-side filtering for Dates and Case Insensitivity (for SQLite robustness)
    if (location) {
        const lowerLoc = location.toLowerCase();
        properties = properties.filter(p =>
            p.location.toLowerCase().includes(lowerLoc) ||
            p.title.toLowerCase().includes(lowerLoc)
        );
    }

    // 3. Filter by Date Availability
    const start = searchParams.startDate ? new Date(searchParams.startDate) : undefined;
    const end = searchParams.endDate ? new Date(searchParams.endDate) : undefined;

    if (start && end) {
        properties = properties.filter(property => {
            // Check if ANY booking overlaps with the requested range
            const isBooked = property.bookings.some(booking => {
                const bookingStart = new Date(booking.startDate);
                const bookingEnd = new Date(booking.endDate);

                // Check for overlap
                // (StartA <= EndB) and (EndA >= StartB)
                return (start <= bookingEnd && end >= bookingStart);
            });

            return !isBooked; // Keep only if NOT booked
        });
    }

    return (
        <div className="container mx-auto px-4 pb-8 space-y-8">
            <div>
                <BackButton />
            </div>
            <div className="border-b border-border/50 pb-4">
                <h1 className="text-2xl font-bold text-foreground">
                    {location ? `Stays in ${location}` : "All Stays"}
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                    {properties.length} properties found
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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

            {properties.length === 0 && (
                <div className="text-center py-20 bg-card/50 rounded-2xl border border-dashed border-border">
                    <h2 className="text-xl font-bold text-foreground">No properties found</h2>
                    <p className="text-muted-foreground">Try adjusting your search filters.</p>
                </div>
            )}
        </div>
    );
}
