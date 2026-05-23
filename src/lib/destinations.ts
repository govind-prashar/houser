import { prisma } from "@/lib/prisma";
import { slugifyTitle } from "@/lib/property-slug";

export type Destination = {
    name: string;
    slug: string;
    propertyCount: number;
    coverImage: string | null;
    minPrice: number | null;
};

export function locationToSlug(location: string): string {
    return slugifyTitle(location);
}

export async function getDestinations(): Promise<Destination[]> {
    const properties = await prisma.property.findMany({
        where: { slug: { not: null } },
        select: {
            location: true,
            price: true,
            images: true,
        },
    });

    const map = new Map<string, { count: number; minPrice: number; cover: string | null }>();

    for (const property of properties) {
        const key = property.location.trim();
        if (!key) continue;

        let cover: string | null = null;
        try {
            const imgs = JSON.parse(property.images) as string[];
            if (imgs[0]) cover = imgs[0];
        } catch {
            /* ignore */
        }

        const existing = map.get(key);
        if (existing) {
            existing.count += 1;
            existing.minPrice = Math.min(existing.minPrice, property.price);
            if (!existing.cover && cover) existing.cover = cover;
        } else {
            map.set(key, { count: 1, minPrice: property.price, cover });
        }
    }

    return Array.from(map.entries())
        .map(([name, data]) => ({
            name,
            slug: locationToSlug(name),
            propertyCount: data.count,
            coverImage: data.cover,
            minPrice: data.minPrice,
        }))
        .sort((a, b) => b.propertyCount - a.propertyCount);
}

export async function getDestinationBySlug(slug: string) {
    const destinations = await getDestinations();
    return destinations.find((d) => d.slug === slug) ?? null;
}

export async function getPropertiesByDestination(locationName: string) {
    return prisma.property.findMany({
        where: {
            location: locationName,
            slug: { not: null },
        },
        orderBy: { createdAt: "desc" },
    });
}
