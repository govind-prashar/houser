'use server'

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/admin";
import { generateUniqueSlug, getPropertyPath } from "@/lib/property-slug";

export async function createProperty(formData: FormData) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return { error: "You must be logged in to add properties." };
    }

    const userId = (session.user as any).id;

    if (!userId) {
        return { error: "User ID not found in session" };
    }

    // Check if user is admin
    if (!(await isAdmin())) {
        return { error: "Only administrators can add properties." };
    }

    try {
        const title = ((formData.get("title") as string) || "").trim() || "Untitled Property";
        const description = (formData.get("description") as string) || "";
        const metaDescription = (formData.get("metaDescription") as string) || null;
        const price = parseFloat(formData.get("price") as string);
        const location = (formData.get("location") as string) || "";
        const type = (formData.get("type") as string) || "Apartment";
        const maxGuests = parseInt(formData.get("maxGuests") as string);
        const slug = await generateUniqueSlug(title);
        const bedrooms = parseInt(formData.get("bedrooms") as string) || 1;
        const beds = parseInt(formData.get("beds") as string) || 1;
        const bathrooms = parseFloat(formData.get("bathrooms") as string) || 1;
        const squareFeet = formData.get("squareFeet") ? parseInt(formData.get("squareFeet") as string) : null;

        const amenities = formData.get("amenities") as string;
        const images = formData.get("images") as string;

        const cleaningFee = formData.get("cleaningFee") ? parseFloat(formData.get("cleaningFee") as string) : 0;
        const serviceFee = formData.get("serviceFee") ? parseFloat(formData.get("serviceFee") as string) : 0;

        const guestAccess = formData.get("guestAccess") as string;
        const neighborhood = formData.get("neighborhood") as string;
        const interaction = formData.get("interaction") as string;
        const houseRules = formData.get("houseRules") as string;
        const notes = formData.get("notes") as string;
        const gettingAround = formData.get("gettingAround") as string;
        const checkIn = formData.get("checkIn") as string || "04:00 PM";
        const checkOut = formData.get("checkOut") as string || "11:00 AM";
        const monthlyPrice = formData.get("monthlyPrice") ? parseFloat(formData.get("monthlyPrice") as string) : null;
        const priceDisplay = (formData.get("priceDisplay") as string) || 'nightly';

        const finalPrice = isNaN(price) ? 0 : price;
        const finalMaxGuests = isNaN(maxGuests) ? 1 : maxGuests;

        const imagesArray = images
            ? images.split(/[,\n]/).map(img => img.trim()).filter(img => img.length > 0)
            : [];

        const amenitiesArray = amenities
            ? amenities.split(',').map(a => a.trim()).filter(a => a.length > 0)
            : [];

        const pricingRulesRaw = formData.get("pricingRules") as string;
        let pricingRulesArray: any[] = [];
        try {
            if (pricingRulesRaw) {
                pricingRulesArray = JSON.parse(pricingRulesRaw);
            }
        } catch (e) {
            console.error("Failed to parse pricing rules JSON");
        }

        let finalHostId = userId;
        if (finalHostId === "admin") {
            // Find an actual admin user in the DB to serve as the host, otherwise it will crash on ObjectId
            const realAdmin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
            if (realAdmin) {
                finalHostId = realAdmin.id;
            } else {
                // Creates a dummy admin record so that relation constraint is satisfied
                const dummyAdmin = await prisma.user.create({
                    data: {
                        name: "Admin",
                        email: "admin-system@canderra.us",
                        role: "ADMIN"
                    }
                });
                finalHostId = dummyAdmin.id;
            }
        }

        const data = {
            title,
            slug,
            metaDescription: metaDescription?.trim() || null,
            description,
            price: finalPrice,
            location,
            type,
            maxGuests: finalMaxGuests,
            bedrooms,
            beds,
            bathrooms: isNaN(bathrooms) ? 1.0 : bathrooms,
            squareFeet: squareFeet,
            amenities: JSON.stringify(amenitiesArray),
            images: JSON.stringify(imagesArray),
            cleaningFee: isNaN(cleaningFee) ? 0 : cleaningFee,
            serviceFee: isNaN(serviceFee) ? 0 : serviceFee,
            guestAccess: guestAccess || null,
            neighborhood: neighborhood || null,
            interaction: interaction || null,
            houseRules: houseRules || null,
            notes: notes || null,
            gettingAround: gettingAround || null,
            checkIn: checkIn || "04:00 PM",
            checkOut: checkOut || "11:00 AM",
            monthlyPrice: monthlyPrice,
            priceDisplay: priceDisplay,
            hostId: finalHostId,
            ...(pricingRulesArray.length > 0 && {
                pricingRules: {
                    create: pricingRulesArray.map(rule => ({
                        startDate: new Date(rule.startDate),
                        endDate: new Date(rule.endDate),
                        price: Number(rule.price)
                    }))
                }
            })
        };

        console.log("PRISMA_CREATE_DATA:", data);

        const property = await prisma.property.create({ data });

        revalidatePath("/search");
        revalidatePath("/");
        revalidatePath(getPropertyPath(property.slug, property.id));
        return { success: true, propertyId: property.id, slug: property.slug };
    } catch (error: any) {
        console.error("CREATE_PROPERTY_ERROR:", error);
        return { error: `Failed to create property: ${error.message || 'Unknown error'}` };
    }
}

export async function updateProperty(propertyId: string, formData: FormData) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return { error: "You must be logged in to update properties." };
    }

    const userId = (session.user as any).id;

    if (!userId) {
        return { error: "User ID not found in session" };
    }

    // Check if user is admin
    if (!(await isAdmin())) {
        return { error: "Only administrators can update properties." };
    }

    try {
        const title = ((formData.get("title") as string) || "").trim() || "Untitled Property";
        const description = (formData.get("description") as string) || "";
        const metaDescription = (formData.get("metaDescription") as string) || null;
        const price = parseFloat(formData.get("price") as string);
        const location = (formData.get("location") as string) || "";
        const type = (formData.get("type") as string) || "Apartment";
        const maxGuests = parseInt(formData.get("maxGuests") as string);
        const slug = await generateUniqueSlug(title, propertyId);
        const bedrooms = parseInt(formData.get("bedrooms") as string) || 1;
        const beds = parseInt(formData.get("beds") as string) || 1;
        const bathrooms = parseFloat(formData.get("bathrooms") as string) || 1;
        const squareFeet = formData.get("squareFeet") ? parseInt(formData.get("squareFeet") as string) : null;

        const amenities = formData.get("amenities") as string;
        const images = formData.get("images") as string;

        const cleaningFee = formData.get("cleaningFee") ? parseFloat(formData.get("cleaningFee") as string) : 0;
        const serviceFee = formData.get("serviceFee") ? parseFloat(formData.get("serviceFee") as string) : 0;

        const guestAccess = formData.get("guestAccess") as string;
        const neighborhood = formData.get("neighborhood") as string;
        const interaction = formData.get("interaction") as string;
        const houseRules = formData.get("houseRules") as string;
        const notes = formData.get("notes") as string;
        const gettingAround = formData.get("gettingAround") as string;
        const checkIn = formData.get("checkIn") as string || "04:00 PM";
        const checkOut = formData.get("checkOut") as string || "11:00 AM";
        const monthlyPrice = formData.get("monthlyPrice") ? parseFloat(formData.get("monthlyPrice") as string) : null;
        const priceDisplay = (formData.get("priceDisplay") as string) || 'nightly';

        const finalPrice = isNaN(price) ? 0 : price;
        const finalMaxGuests = isNaN(maxGuests) ? 1 : maxGuests;

        const imagesArray = images
            ? images.split(/[,\n]/).map(img => img.trim()).filter(img => img.length > 0)
            : [];

        const amenitiesArray = amenities
            ? amenities.split(',').map(a => a.trim()).filter(a => a.length > 0)
            : [];

        const pricingRulesRaw = formData.get("pricingRules") as string;
        let pricingRulesArray: any[] = [];
        try {
            if (pricingRulesRaw) {
                pricingRulesArray = JSON.parse(pricingRulesRaw);
            }
        } catch (e) {
            console.error("Failed to parse pricing rules JSON");
        }

        const data = {
            title,
            slug,
            metaDescription: metaDescription?.trim() || null,
            description,
            price: finalPrice,
            location,
            type,
            maxGuests: finalMaxGuests,
            bedrooms,
            beds,
            bathrooms: isNaN(bathrooms) ? 1.0 : bathrooms,
            squareFeet: squareFeet,
            amenities: JSON.stringify(amenitiesArray),
            images: JSON.stringify(imagesArray),
            cleaningFee: isNaN(cleaningFee) ? 0 : cleaningFee,
            serviceFee: isNaN(serviceFee) ? 0 : serviceFee,
            guestAccess: guestAccess || null,
            neighborhood: neighborhood || null,
            interaction: interaction || null,
            houseRules: houseRules || null,
            notes: notes || null,
            gettingAround: gettingAround || null,
            checkIn: checkIn || "04:00 PM",
            checkOut: checkOut || "11:00 AM",
            monthlyPrice: monthlyPrice,
            priceDisplay: priceDisplay,
        };

        console.log("PRISMA_UPDATE_DATA:", data);

        // Run as transaction so we delete old rules and insert new ones
        const [_, property] = await prisma.$transaction([
            prisma.pricingRule.deleteMany({
                where: { propertyId: propertyId }
            }),
            prisma.property.update({
                where: { id: propertyId },
                data: {
                    ...data,
                    ...(pricingRulesArray.length > 0 && {
                        pricingRules: {
                            create: pricingRulesArray.map(rule => ({
                                startDate: new Date(rule.startDate),
                                endDate: new Date(rule.endDate),
                                price: Number(rule.price)
                            }))
                        }
                    })
                },
            })
        ]);

        revalidatePath("/search");
        revalidatePath("/");
        revalidatePath(getPropertyPath(property.slug, property.id));
        return { success: true, propertyId: property.id, slug: property.slug };
    } catch (error) {
        console.error(error);
        return { error: "Failed to update property" };
    }
}

export async function deleteProperty(propertyId: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return { error: "You must be logged in." };
    }

    const userId = (session.user as any).id;
    const userRole = (session.user as any).role;

    // Check if user is admin
    if (!(await isAdmin())) {
        return { error: "Unauthorized" };
    }

    try {
        await prisma.property.delete({
            where: { id: propertyId }
        });

        revalidatePath("/search");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Delete Property Error:", error);
        return { error: "Failed to delete property" };
    }
}

export async function getDistinctLocations() {
    try {
        const locations = await prisma.property.findMany({
            select: {
                location: true
            },
            distinct: ['location']
        });

        return locations.map(l => l.location).sort();
    } catch (error) {
        console.error("Failed to fetch locations:", error);
        return [];
    }
}
