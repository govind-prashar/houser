import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const admin = await prisma.user.findUnique({
        where: { email: 'admin@canderra.com' },
        select: { email: true, name: true, role: true }
    })

    if (admin) {
        console.log('Admin user found:')
        console.log('Email:', admin.email)
        console.log('Name:', admin.name)
        console.log('Role:', admin.role)
    } else {
        console.log('Admin user not found. Creating now...')
        const bcrypt = await import('bcryptjs')
        const hashedPassword = await bcrypt.hash('password123', 10)
        
        const newAdmin = await prisma.user.create({
            data: {
                email: 'admin@canderra.com',
                name: 'Admin User',
                password: hashedPassword,
                image: 'https://i.pravatar.cc/150?u=admin',
                role: 'ADMIN',
            },
        })
        console.log('Admin user created successfully!')
        console.log('Email:', newAdmin.email)
        console.log('Password: password123')
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })

