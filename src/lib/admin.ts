import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function isAdmin() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return false;
    }

    const userId = (session.user as any).id;

    if (!userId) {
        return false;
    }

    // Bypass database lookup for hardcoded environment variables admin
    if (userId === 'admin') {
        return true;
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true },
        });
        return user?.role === "ADMIN";
    } catch (e) {
        console.error("Error in isAdmin check:", e);
        return false;
    }
}

