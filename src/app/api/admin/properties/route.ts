import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { isAdmin } from '@/lib/admin'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const admin = await isAdmin()
        if (!admin) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
        }

        const properties = await prisma.property.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                title: true,
                location: true,
                price: true,
                images: true,
            }
        })

        return NextResponse.json({ properties })
    } catch (error) {
        console.error('Fetch properties error:', error)
        return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 })
    }
}
