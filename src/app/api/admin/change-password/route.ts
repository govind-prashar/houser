'use server'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { isAdmin } from '@/lib/admin'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const admin = await isAdmin()
        if (!admin) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
        }

        const { currentPassword, newPassword } = await request.json()

        // Verify current password matches env
        const envPassword = process.env.ADMIN_PASSWORD
        if (currentPassword !== envPassword) {
            return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
        }

        if (!newPassword || newPassword.length < 8) {
            return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 })
        }

        // Update the .env file
        const envPath = path.resolve(process.cwd(), '.env')
        let envContent = fs.readFileSync(envPath, 'utf-8')

        // Replace the ADMIN_PASSWORD line
        envContent = envContent.replace(
            /^ADMIN_PASSWORD=.*$/m,
            `ADMIN_PASSWORD=${newPassword}`
        )

        fs.writeFileSync(envPath, envContent, 'utf-8')

        // Update the runtime environment variable so the new password works immediately
        process.env.ADMIN_PASSWORD = newPassword

        return NextResponse.json({ success: true, message: 'Password changed successfully. It will persist across restarts.' })
    } catch (error) {
        console.error('Change password error:', error)
        return NextResponse.json({ error: 'Failed to change password' }, { status: 500 })
    }
}
