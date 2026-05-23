'use server'

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

import { sendBookingNotificationEmail } from "@/lib/mail";

export async function createBooking(
    propertyId: string,
    startDate: Date,
    endDate: Date,
    totalPrice: number,
    guests: number,
    guestName: string,
    guestEmail: string,
    guestPhone: string
) {
    const session = await getServerSession(authOptions);

    // Get user ID if logged in, otherwise we will need to create a guest booking.
    // However, Prisma schema might require a userId for Booking.
    // Let's create or find a dummy "Guest User" to link anonymous bookings if the schema requires it,
    // Or we will just associate it with an existing user if their email matches.
    let userId = session?.user ? (session.user as any).id : null;

    if (!userId) {
        // Try to find if this guest email already has an account
        const existingUser = await prisma.user.findUnique({
            where: { email: guestEmail }
        });

        if (existingUser) {
            userId = existingUser.id;
        } else {
            // Create a guest user account automatically
            const guestUser = await prisma.user.create({
                data: {
                    name: guestName,
                    email: guestEmail,
                    role: "GUEST",
                }
            });
            userId = guestUser.id;
        }
    }

    const property = await prisma.property.findUnique({
        where: { id: propertyId },
        include: { pricingRules: true }
    });

    if (!property) {
        return { error: "Property not found." };
    }

    // Server-side validation of dynamic pricing to prevent frontend spoofing
    let calculatedTotal = 0;
    const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) || 1;

    for (let i = 0; i < nights; i++) {
        const currentDate = new Date(startDate.getTime() + (i * 24 * 60 * 60 * 1000));
        currentDate.setHours(0, 0, 0, 0);

        const ruleForDay = property.pricingRules.find(rule => {
            const ruleStart = new Date(rule.startDate).setHours(0, 0, 0, 0);
            const ruleEnd = new Date(rule.endDate).setHours(0, 0, 0, 0);
            return currentDate.getTime() >= ruleStart && currentDate.getTime() <= ruleEnd;
        });

        if (ruleForDay) {
            calculatedTotal += ruleForDay.price;
        } else {
            calculatedTotal += property.price;
        }
    }

    // Add fees
    calculatedTotal += (property as any).cleaningFee || 0;
    calculatedTotal += (property as any).serviceFee || 0;

    try {
        const booking = await prisma.booking.create({
            data: {
                userId,
                propertyId,
                startDate,
                endDate,
                totalPrice: calculatedTotal,
                guests,
                status: "CONFIRMED"
            },
        });

        // Send email notification asynchronously
        // Fetch full property for valid data
        const property = await prisma.property.findUnique({ where: { id: propertyId } });

        if (property) {
            await sendBookingNotificationEmail(
                booking,
                { name: guestName, email: guestEmail, phone: guestPhone },
                { title: property.title, location: property.location }
            );
        }

        revalidatePath(`/properties/${propertyId}`);
        return { success: true, bookingId: booking.id };
    } catch (error) {
        console.error(error);
        return { error: "Failed to create booking" };
    }
}
