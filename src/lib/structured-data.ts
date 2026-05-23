import { absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/seo";
import { getPropertyPath } from "@/lib/property-slug";

export function organizationJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
        logo: absoluteUrl("/favicon-96x96.png"),
        email: "support@canderra.us",
        description:
            "Canderra curates luxury residences and private sanctuaries for discerning travelers worldwide.",
    };
}

export function websiteJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: `${SITE_URL}/search?location={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
        },
    };
}

type PropertySchemaInput = {
    title: string;
    description: string;
    slug: string;
    id: string;
    location: string;
    type: string;
    price: number;
    images: string[];
    bedrooms: number;
    beds: number;
    bathrooms: number;
    maxGuests: number;
    amenities: string[];
};

export function vacationRentalJsonLd(property: PropertySchemaInput) {
    const pageUrl = absoluteUrl(getPropertyPath(property.slug, property.id));

    return {
        "@context": "https://schema.org",
        "@type": "VacationRental",
        name: property.title,
        description: property.description,
        url: pageUrl,
        image: property.images.length > 0 ? property.images : undefined,
        address: {
            "@type": "PostalAddress",
            addressLocality: property.location,
        },
        numberOfRooms: property.bedrooms,
        numberOfBedrooms: property.bedrooms,
        numberOfBathroomsTotal: property.bathrooms,
        occupancy: {
            "@type": "QuantitativeValue",
            maxValue: property.maxGuests,
        },
        amenityFeature: property.amenities.slice(0, 20).map((name) => ({
            "@type": "LocationFeatureSpecification",
            name,
            value: true,
        })),
        offers: {
            "@type": "Offer",
            price: property.price,
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            url: pageUrl,
        },
    };
}

export function propertyBreadcrumbJsonLd(
    title: string,
    slug: string,
    id: string
) {
    const propertyPath = getPropertyPath(slug, id);

    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: SITE_URL,
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Properties",
                item: absoluteUrl("/properties"),
            },
            {
                "@type": "ListItem",
                position: 3,
                name: title,
                item: absoluteUrl(propertyPath),
            },
        ],
    };
}

export function propertiesListJsonLd(
    properties: { title: string; slug: string | null; id: string }[]
) {
    return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `${SITE_NAME} Luxury Residences`,
        itemListElement: properties.map((property, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: property.title,
            url: absoluteUrl(getPropertyPath(property.slug, property.id)),
        })),
    };
}
