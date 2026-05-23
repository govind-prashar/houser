import { PrismaClient } from "@prisma/client";
import { generateUniqueSlug } from "../src/lib/property-slug";

const prisma = new PrismaClient();

async function main() {
    const properties = await prisma.property.findMany({
        select: { id: true, title: true, slug: true },
    });

    const needsSlug = properties.filter((p) => !p.slug);

    for (const property of needsSlug) {
        const slug = await generateUniqueSlug(property.title, property.id);
        await prisma.property.update({
            where: { id: property.id },
            data: { slug },
        });
        console.log(`Updated ${property.title} -> /properties/${slug}`);
    }

    console.log(`Total properties: ${properties.length}. Backfilled ${needsSlug.length} properties.`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
