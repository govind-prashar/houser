import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { getDestinations } from '@/lib/destinations'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://canderra.us'

    const baseUrls: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/properties`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/destinations`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.85,
        },
        {
            url: `${baseUrl}/search`,
            lastModified: new Date(),
            changeFrequency: 'always',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
    ]

    try {
        const destinations = await getDestinations()
        const destinationUrls = destinations.map((d) => ({
            url: `${baseUrl}/destinations/${d.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.75,
        }))
        baseUrls.push(...destinationUrls)
    } catch (e) {
        // Skip destinations if database is unavailable
    }

    try {
        const properties = await prisma.property.findMany({
            where: { slug: { not: null } },
            select: {
                id: true,
                slug: true,
                updatedAt: true,
            },
        })

        const propertyUrls = properties.map((property) => ({
            url: `${baseUrl}/properties/${property.slug}`,
            lastModified: property.updatedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }))
        baseUrls.push(...propertyUrls)
    } catch (e) {
        // Skip properties if database is unavailable
    }

    return baseUrls
}
