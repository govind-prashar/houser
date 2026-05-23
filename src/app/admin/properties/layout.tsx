import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { isAdmin } from '@/lib/admin'

export default async function AdminPropertiesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/admin/login?callbackUrl=/admin/properties')
    }

    const admin = await isAdmin()

    if (!admin) {
        redirect('/')
    }

    return <>{children}</>
}
