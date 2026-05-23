import { prisma } from "@/lib/prisma";

export function slugifyTitle(title: string): string {
    return title
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export async function generateUniqueSlug(
    title: string,
    excludePropertyId?: string
): Promise<string> {
    const base = slugifyTitle(title) || "property";
    let slug = base;
    let counter = 1;

    while (true) {
        const existing = await prisma.property.findFirst({
            where: { slug },
            select: { id: true },
        });
        if (!existing || existing.id === excludePropertyId) {
            return slug;
        }
        slug = `${base}-${counter++}`;
    }
}

export async function ensurePropertySlug(property: {
    id: string;
    title: string;
    slug: string | null;
}): Promise<string> {
    if (property.slug) {
        return property.slug;
    }

    const slug = await generateUniqueSlug(property.title, property.id);
    await prisma.property.update({
        where: { id: property.id },
        data: { slug },
    });
    return slug;
}

const OBJECT_ID_PATTERN = /^[a-f0-9]{24}$/i;

export async function resolvePropertyByParam(param: string) {
    const bySlug = await prisma.property.findFirst({
        where: { slug: param },
        include: { host: true, pricingRules: true },
    });
    if (bySlug) {
        return { property: bySlug, canonicalSlug: bySlug.slug! };
    }

    if (OBJECT_ID_PATTERN.test(param)) {
        const byId = await prisma.property.findUnique({
            where: { id: param },
            include: { host: true, pricingRules: true },
        });
        if (byId) {
            const canonicalSlug = await ensurePropertySlug(byId);
            return { property: { ...byId, slug: canonicalSlug }, canonicalSlug };
        }
    }

    return null;
}

export function getPropertyPath(slug: string | null | undefined, id: string): string {
    return `/properties/${slug || id}`;
}
