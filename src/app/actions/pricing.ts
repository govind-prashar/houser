'use server';

import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getPricingRules(propertyId: string) {
    try {
        const rules = await prisma.pricingRule.findMany({
            where: { propertyId },
            orderBy: { startDate: 'asc' }
        });
        return { data: rules };
    } catch (error) {
        console.error("Error fetching pricing rules:", error);
        return { error: "Failed to fetch pricing rules." };
    }
}

export async function createPricingRule(propertyId: string, startDate: Date, endDate: Date, price: number) {
    if (!(await isAdmin())) {
        return { error: "Only administrators can manage pricing rules." };
    }

    try {
        const rule = await prisma.pricingRule.create({
            data: {
                propertyId,
                startDate,
                endDate,
                price
            }
        });

        revalidatePath(`/admin/properties/${propertyId}/pricing`);
        revalidatePath(`/properties/${propertyId}`);
        return { success: true, data: rule };
    } catch (error) {
        console.error("Error creating pricing rule:", error);
        return { error: "Failed to create pricing rule." };
    }
}

export async function deletePricingRule(ruleId: string, propertyId: string) {
    if (!(await isAdmin())) {
        return { error: "Only administrators can manage pricing rules." };
    }

    try {
        await prisma.pricingRule.delete({
            where: { id: ruleId }
        });

        revalidatePath(`/admin/properties/${propertyId}/pricing`);
        revalidatePath(`/properties/${propertyId}`);
        return { success: true };
    } catch (error) {
        console.error("Error deleting pricing rule:", error);
        return { error: "Failed to delete pricing rule." };
    }
}
